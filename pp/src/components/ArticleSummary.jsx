import { useState } from 'react';
import { FaArrowLeft, FaBookmark, FaShare, FaGlobe, FaExternalLinkAlt, FaThumbsUp, FaPlay, FaImage } from 'react-icons/fa';
import RelatedArticles from './RelatedArticles';
import { useTheme } from '../context/ThemeContext';

export default function ArticleSummary({ article, onClose, onBookmark, onShare }) {
  const { isDarkMode } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Check if article has video content
  const hasVideo = article.urlToImage?.includes('video') || 
                   article.title?.toLowerCase().includes('video') ||
                   article.description?.toLowerCase().includes('video') ||
                   article.url?.includes('youtube') ||
                   article.url?.includes('vimeo');

  // Get the best available image URL
  const getImageUrl = () => {
    if (article.urlToImage && article.urlToImage !== 'null' && article.urlToImage !== '') {
      return article.urlToImage;
    }
    if (article.image && article.image !== 'null' && article.image !== '') {
      return article.image;
    }
    if (article.urlToImage && typeof article.urlToImage === 'string' && article.urlToImage.length > 0) {
      return article.urlToImage;
    }
    return null;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark(article);
  };

  const handleShare = () => {
    if (onShare) onShare(article);
  };

  const handleReadOriginal = () => {
    window.open(article.url, '_blank');
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Generate category tags based on article content
  const getCategoryTags = () => {
    const tags = [];
    if (article.category) tags.push(article.category);
    if (article.title?.toLowerCase().includes('ai')) tags.push('AI');
    if (article.title?.toLowerCase().includes('cybersecurity') || article.title?.toLowerCase().includes('security')) tags.push('Cybersecurity');
    if (article.title?.toLowerCase().includes('phishing') || article.title?.toLowerCase().includes('email')) tags.push('Phishing');
    if (article.title?.toLowerCase().includes('email')) tags.push('Email Security');
    if (article.title?.toLowerCase().includes('machine learning') || article.title?.toLowerCase().includes('ml')) tags.push('Machine Learning');
    if (article.title?.toLowerCase().includes('enterprise')) tags.push('Enterprise');
    if (hasVideo) tags.push('Video');
    
    return tags.length > 0 ? tags : ['technology'];
  };

  const categoryTags = getCategoryTags();
  const imageUrl = getImageUrl();

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
      isDarkMode ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaArrowLeft className="text-sm" />
            Back to News
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'bg-teal-500 text-white' 
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaBookmark className="text-sm" />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaShare className="text-sm" />
            </button>
          </div>
        </div>

        {/* Category Tags */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categoryTags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  index === 0 
                    ? 'bg-teal-500 text-white' 
                    : tag === 'Video' 
                      ? 'bg-red-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index === 0 ? tag : tag === 'Video' ? `▶ ${tag}` : `◆ ${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Article Title */}
        <div className="px-6 py-4">
          <h1 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {article.title}
          </h1>
        </div>

        {/* Article Meta */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{article.source?.name || article.source || 'News Source'}</p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>By {article.author || 'Unknown Author'}</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="flex items-center gap-1">
                <span>📅</span>
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date'}
              </span>
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                {hasVideo ? '8 min watch' : '4 min read'}
              </span>
              <span className="flex items-center gap-1">
                <span>👁️</span>
                15.4K views
              </span>
            </div>
          </div>
        </div>

        {/* Article Image/Video */}
        <div className="px-6 py-4">
          {imageUrl && !imageError ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
              />
              {imageLoading && (
                <div className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              )}
              {/* Video Play Button Overlay */}
              {hasVideo && !imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                    <FaPlay className="text-white text-xl ml-1" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full h-64 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div className="text-center">
                <FaImage className={`text-6xl mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>No image available</p>
                {hasVideo && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <FaPlay className="text-red-500 text-lg" />
                    <span className="text-red-500 font-medium">Video content available</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="px-6 py-4">
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-teal-400 text-lg">⚡</span>
              <h3 className={`font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>AI Summary</h3>
              {hasVideo && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
                  <FaPlay className="text-xs" />
                  Video
                </span>
              )}
            </div>
            <div className={`leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {article.summary || article.description || 'No summary available. This article discusses important developments in the field, providing insights and analysis on current trends and future implications.'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={handleReadOriginal}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <FaGlobe className="text-sm" />
              <FaExternalLinkAlt className="text-sm" />
              {hasVideo ? 'Watch Original Video' : 'Read Original Article'}
            </button>
            <div className={`flex items-center gap-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Last updated: {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown'}</span>
              <div className={`flex items-center gap-1 px-3 py-1 rounded ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <FaThumbsUp className="text-sm" />
                <span>342</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <RelatedArticles />
      </div>
    </div>
  );
} 