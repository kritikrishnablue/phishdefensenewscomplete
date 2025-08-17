import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaBookmark, FaShare, FaGlobe, FaExternalLinkAlt, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ArticlePage() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  // Use article from location.state if available, otherwise fallback (could fetch by id here)
  const article = location.state?.article || {};

  const handleLike = () => {
    setLiked((v) => !v);
    if (!liked && disliked) setDisliked(false);
  };
  const handleDislike = () => {
    setDisliked((v) => !v);
    if (!disliked && liked) setLiked(false);
  };
  const handleShare = async () => {
    setShared(true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.description,
          url: article.url
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Link copied to clipboard!');
    }
  };
  const handleReadOriginal = () => window.open(article.url, '_blank');

  // Get image
  const imageUrl = article.urlToImage || article.image || '';

  return (
    <motion.div 
      className={`max-w-3xl mx-auto py-10 px-4 min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 text-base font-medium transition-colors duration-300 ${
          isDarkMode 
            ? 'text-gray-400 hover:text-teal-400' 
            : 'text-gray-600 hover:text-teal-600'
        }`}
        whileHover={{ x: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Back to News
      </motion.button>

      {/* Article Image */}
      {imageUrl && (
        <motion.div 
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img 
            src={imageUrl} 
            alt={article.title} 
            className="w-full h-72 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* AI Summary */}
      <motion.div 
        className={`rounded-xl p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400 text-lg">⚡</span>
          <h3 className={`font-bold text-lg ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>AI Summary</h3>
        </div>
        <div className={`text-base leading-relaxed ${showFullSummary ? '' : 'line-clamp-4'} ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {article.summary || article.description || 'No summary available.'}
        </div>
        {((article.summary && article.summary.length > 200) || (article.description && article.description.length > 200)) && (
          <motion.button
            className={`mt-2 text-sm font-medium focus:outline-none transition-colors duration-300 ${
              isDarkMode 
                ? 'text-teal-400 hover:text-teal-300' 
                : 'text-teal-600 hover:text-teal-700'
            }`}
            onClick={() => setShowFullSummary((v) => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showFullSummary ? 'Show less' : 'Show more'}
          </motion.button>
        )}
      </motion.div>

      {/* Actions Row */}
      <motion.div 
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.button
          onClick={handleReadOriginal}
          className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-base"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGlobe /> <FaExternalLinkAlt /> Read Original Article
        </motion.button>
        <motion.button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-base font-medium transition-all duration-300 ${
            liked 
              ? 'bg-teal-500 text-white border-teal-500 shadow-lg' 
              : isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-teal-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-teal-500'
          }`}
          whileTap={{ scale: 1.3, rotate: 15 }}
          whileHover={{ 
            scale: 1.1, 
            y: -3,
            boxShadow: liked 
              ? '0 8px 25px rgba(20, 184, 166, 0.4)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <AnimatePresence initial={false} mode="wait">
            {liked ? (
              <motion.span
                key="liked"
                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1,
                  filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))'
                }}
                exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <FaThumbsUp />
              </motion.span>
            ) : (
              <motion.span
                key="not-liked"
                initial={{ scale: 0.5, rotate: 180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: -180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <FaThumbsUp />
              </motion.span>
            )}
          </AnimatePresence>
          Like
        </motion.button>
        <motion.button
          onClick={handleDislike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-base font-medium transition-all duration-300 ${
            disliked 
              ? 'bg-pink-500 text-white border-pink-500 shadow-lg' 
              : isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-pink-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-pink-500'
          }`}
          whileTap={{ scale: 1.3, rotate: -15 }}
          whileHover={{ 
            scale: 1.1, 
            y: -3,
            boxShadow: disliked 
              ? '0 8px 25px rgba(236, 72, 153, 0.4)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <AnimatePresence initial={false} mode="wait">
            {disliked ? (
              <motion.span
                key="disliked"
                initial={{ scale: 0.5, rotate: 180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1, filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8))' }}
                exit={{ scale: 0.5, rotate: -180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <FaThumbsDown />
              </motion.span>
            ) : (
              <motion.span
                key="not-disliked"
                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <FaThumbsDown />
              </motion.span>
            )}
          </AnimatePresence>
          Dislike
        </motion.button>
        <motion.button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-base font-medium transition-all duration-300 ${
            shared 
              ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg' 
              : isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-cyan-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-cyan-500'
          }`}
          whileTap={{ scale: 1.2, rotate: 10 }}
          whileHover={{ 
            scale: 1.1, 
            y: -3,
            boxShadow: shared 
              ? '0 8px 25px rgba(6, 182, 212, 0.4)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <FaShare /> Share
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 