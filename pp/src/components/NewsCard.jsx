import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaShare, FaThumbsUp, FaThumbsDown, FaEye, FaExternalLinkAlt, FaPlay, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { debugArticleImages, getEnhancedImageUrl, isLikelyCorsBlocked, getCorsProxyUrl, testImageWithFallback } from '../utils/imageUtils';
import ArticleSummary from './ArticleSummary';
import { useNavigate } from 'react-router-dom';

export default function NewsCard({ article, onLike, onBookmark, onShare, showStatus = true }) {
  const { isDarkMode } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const articleId = article.url || article.id;

  // Check if article has video content
  const hasVideo = article.urlToImage?.includes('video') || 
                   article.title?.toLowerCase().includes('video') ||
                   article.description?.toLowerCase().includes('video') ||
                   article.url?.includes('youtube') ||
                   article.url?.includes('vimeo');

  // Generate category based on article content
  const getCategory = () => {
    if (article.category) return article.category;
    if (article.title?.toLowerCase().includes('cybersecurity') || article.title?.toLowerCase().includes('security')) return 'cybersecurity';
    if (article.title?.toLowerCase().includes('technology') || article.title?.toLowerCase().includes('tech')) return 'technology';
    if (article.title?.toLowerCase().includes('business')) return 'business';
    if (article.title?.toLowerCase().includes('politics')) return 'politics';
    if (article.title?.toLowerCase().includes('science')) return 'science';
    if (article.title?.toLowerCase().includes('health')) return 'health';
    return 'general';
  };

  // Enhanced getImageUrl function
  const getImageUrl = () => {
    if (enhancedImageUrl) {
      return enhancedImageUrl;
    }
    
    if (article.urlToImage && article.urlToImage !== 'null' && article.urlToImage !== '') {
      return article.urlToImage;
    }
    if (article.image && article.image !== 'null' && article.image !== '') {
      return article.image;
    }
    if (article.urlToImage && typeof article.urlToImage === 'string' && article.urlToImage.length > 0) {
      return article.urlToImage;
    }
    
    const category = getCategory();
    const articleId = article.url || article.id || article._id;
    return `https://picsum.photos/400/250?random=${articleId || Date.now() + Math.random()}`;
  };

  // Get enhanced image URL
  useEffect(() => {
    const loadEnhancedImage = async () => {
      const url = await getEnhancedImageUrl(article);
      setEnhancedImageUrl(url);
    };
    loadEnhancedImage();
  }, [article]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error with better fallback
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageError(true);
    setImageLoading(false);
    if (!e.target.src.includes('/proxy/image?url=') && (isLikelyCorsBlocked(e.target.src) || e.type === 'error')) {
      const backendProxy = `http://127.0.0.1:8000/proxy/image?url=${encodeURIComponent(e.target.src)}`;
      console.log('Trying backend image proxy:', backendProxy);
      e.target.src = backendProxy;
      return;
    }
    const articleId = article.url || article.id || article._id;
    const fallbackUrl = `https://picsum.photos/400/250?random=${articleId || Date.now() + Math.random()}`;
    if (e.target.src !== fallbackUrl) {
      e.target.src = fallbackUrl;
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark articles');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await userAPI.unbookmarkArticle(articleId);
        setIsBookmarked(false);
      } else {
        await userAPI.bookmarkArticle(articleId, article);
        setIsBookmarked(true);
      }
      if (onBookmark) onBookmark(article);
    } catch (error) {
      console.error('Failed to bookmark article:', error);
      alert('Failed to bookmark article');
    } finally {
      setLoading(false);
    }
  };

  // Handle article click (mark as read and show summary)
  const handleArticleClick = async () => {
    if (isAuthenticated && !isRead) {
      try {
        await userAPI.addToHistory(articleId);
        setIsRead(true);
      } catch (error) {
        console.error('Failed to add to reading history:', error);
      }
    }
    
    setShowSummary(true);
  };

  // Handle read original article
  const handleReadOriginal = () => {
    window.open(article.url, '_blank');
  };

  // Handle read full article click
  const handleReadFullArticle = () => {
    navigate(`/article/${encodeURIComponent(article.url || article.id)}`, { state: { article } });
  };

  const category = getCategory();
  const imageUrl = getImageUrl();

  // Get category color
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'cybersecurity': return 'bg-red-500';
      case 'technology': return 'bg-blue-500';
      case 'business': return 'bg-green-500';
      case 'politics': return 'bg-purple-500';
      case 'science': return 'bg-yellow-500';
      case 'health': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <motion.div 
        className="rounded-lg overflow-hidden transition-all duration-300 border transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
        style={{ 
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderColor: isDarkMode ? '#475569' : '#e2e8f0'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.03,
          y: -8,
          boxShadow: isDarkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Article Image */}
        <div className="relative">
          {imageUrl && !imageError ? (
            <div className="relative">
              <motion.img
                src={imageUrl}
                alt={article.title} 
                className="w-full h-48 object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  filter: isDarkMode ? 'brightness(0.9)' : 'brightness(1)'
                }}
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }}>
                  <motion.div 
                    className="rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: isDarkMode ? '#0ea5e9' : '#06b6d4' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
              {/* Video Play Button Overlay */}
              {hasVideo && !imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <motion.div 
                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <FaPlay className="text-white text-lg ml-1" />
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }}>
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaEye className="text-4xl mx-auto mb-2" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }} />
                </motion.div>
                <p className="text-sm capitalize" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>{category}</p>
              </div>
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <motion.span 
              className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(category)}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              {category}
            </motion.span>
          </div>
          
          {/* Bookmark Button */}
          <motion.button
            onClick={handleBookmark}
            className="absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all duration-500 transform hover:scale-125 hover:rotate-12"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              boxShadow: isBookmarked 
                ? '0 0 20px rgba(14, 165, 233, 0.6)' 
                : '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 1.6, rotate: 360 }}
            whileHover={{ 
              scale: 1.25, 
              rotate: 15,
              boxShadow: isBookmarked 
                ? '0 0 25px rgba(14, 165, 233, 0.8)' 
                : '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Bookmark"
          >
            <AnimatePresence initial={false} mode="wait">
              {isBookmarked ? (
                <motion.span
                  key="bookmarked"
                  initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0, 
                    opacity: 1,
                    filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.8))'
                  }}
                  exit={{ scale: 0.3, rotate: 180, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                >
                  <FaBookmark className="text-sm" style={{ color: isDarkMode ? '#0ea5e9' : '#06b6d4' }} />
                </motion.span>
              ) : (
                <motion.span
                  key="not-bookmarked"
                  initial={{ scale: 0.3, rotate: 180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.3, rotate: -180, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                >
                  <FaBookmark className="text-sm" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Article Content */}
        <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
          {/* Source and Date */}
          <div className="flex items-center justify-between mb-3">
            <motion.span 
              className="text-sm font-medium"
              style={{ color: isDarkMode ? '#0ea5e9' : '#0891b2' }}
              whileHover={{ scale: 1.05 }}
            >
              {article.source?.name || article.source || 'News Source'}
            </motion.span>
            <div className="flex items-center gap-2 text-xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <FaClock className="text-xs" />
              <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
          </div>

          {/* AI Summary Badge */}
          <div className="flex items-center gap-2 mb-3">
            <motion.span className="text-sm" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>⚡</motion.span>
            <span className="text-xs font-medium" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>AI Summary</span>
          </div>

          {/* Title */}
          <motion.h3 
            className="font-bold text-lg mb-3 line-clamp-2 cursor-pointer transition-colors leading-tight"
            style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
            whileHover={{ 
              color: isDarkMode ? '#0ea5e9' : '#0891b2',
              scale: 1.02
            }}
            transition={{ duration: 0.2 }}
          >
            {article.title}
          </motion.h3>

          {/* Description */}
          <p className="text-sm mb-4 line-clamp-3 leading-relaxed" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
            {article.description || article.summary || 'No description available'}
          </p>

          {/* Meta and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <span className="font-medium">4 min read</span>
            </div>
            <motion.button
              onClick={handleReadFullArticle}
              className="flex items-center gap-2 px-3 py-1 text-sm font-medium transition-all duration-300 rounded-md"
              style={{ color: isDarkMode ? '#0ea5e9' : '#0891b2' }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(8, 145, 178, 0.1)',
                x: 4
              }}
              whileTap={{ scale: 0.95 }}
            >
              Read full article
              <motion.div
                whileHover={{ x: 2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <FaExternalLinkAlt className="text-xs" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Article Summary Modal */}
      {/* Remove modal opening for summary, as we now use a dedicated page */}
    </>
  );
}