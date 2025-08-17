from app.database.mongo import news_collection
from datetime import datetime, timedelta

def get_trending_articles(limit=10, hours=48, preferred_category=None, preferred_region=None):
    now = datetime.utcnow()
    since = now - timedelta(hours=hours)
    # Only consider articles from the last X hours (if publishedAt or saved_at exists)
    time_filter = {"saved_at": {"$gte": since}}
    articles = list(news_collection.find(time_filter))
    trending = []
    for a in articles:
        # Engagement fields
        views = a.get("views", 0)
        clicks = a.get("clicks", 0)
        shares = a.get("share_count", 0)
        likes = a.get("like_count", 0)
        comments = a.get("comments", 0)
        published_at = a.get("publishedAt") or a.get("saved_at")
        # Parse published_at to datetime
        if isinstance(published_at, str):
            try:
                published_at_dt = datetime.fromisoformat(published_at)
            except Exception:
                published_at_dt = now
        elif isinstance(published_at, datetime):
            published_at_dt = published_at
        else:
            published_at_dt = now
        hours_since_published = (now - published_at_dt).total_seconds() / 3600
        # Trending score formula
        score = (
            0.3 * views +
            0.3 * clicks +
            0.2 * shares +
            0.1 * likes +
            0.1 * comments
        )
        # Freshness decay
        score *= 1 / (1 + hours_since_published)
        # Optional boosts
        if preferred_category and (
            preferred_category.lower() in (str(a.get("category") or "") + str(a.get("title") or "") + str(a.get("description") or "")).lower()
        ):
            score *= 1.2
        if preferred_region and preferred_region.lower() in str(a.get("userCountry") or "").lower():
            score *= 1.1
        a["trending_score"] = score
        trending.append(a)
    trending.sort(key=lambda x: x["trending_score"], reverse=True)
    return trending[:limit]

def search_articles(
    keywords: str = "",
    start_date: str = None,
    end_date: str = None,
    source: str = None,
    limit: int = 20
):
    query = {}
    if keywords:
        query["$text"] = {"$search": keywords}
    if start_date or end_date:
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date
        query["publishedAt"] = date_filter
    if source:
        query["channel"] = source

    projection = {"score": {"$meta": "textScore"}}
    cursor = news_collection.find(query, projection)
    if keywords:
        cursor = cursor.sort([("score", {"$meta": "textScore"})])
    else:
        cursor = cursor.sort("publishedAt", -1)
    cursor = cursor.limit(limit)
    articles = list(cursor)
    for a in articles:
        a["like_count"] = a.get("like_count", 0)
        a["dislike_count"] = a.get("dislike_count", 0)
        a["share_count"] = a.get("share_count", 0)
    return articles 