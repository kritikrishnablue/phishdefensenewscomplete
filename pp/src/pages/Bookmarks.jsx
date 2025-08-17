import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaBookmark, FaTrash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function Bookmarks() {
  const { isDarkMode } = useTheme();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {  
    if (isAuthenticated) {
      loadBookmarks();
    }
  }, [isAuthenticated]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbookmark = async (article) => {
    try {
      await userAPI.unbookmarkArticle(article.url);
      setBookmarks(prev => prev.filter(b => b.url !== article.url));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`p-4 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`border rounded-lg p-6 text-center ${
          isDarkMode 
            ? 'bg-yellow-900 border-yellow-700' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <FaBookmark className={`text-3xl mx-auto mb-4 ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <h2 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
          }`}>Login Required</h2>
          <p className={`mb-4 ${
            isDarkMode ? 'text-yellow-100' : 'text-yellow-700'
          }`}>
            Please login to view your bookmarked articles.
          </p>
          <a 
            href="/login" 
            className={`inline-block px-4 py-2 rounded transition-colors ${
              isDarkMode 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Bookmarks</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Your saved articles and reading list
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={() => setBookmarks([])}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <FaTrash className="text-sm" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Loading bookmarks...</p>
          </div>
        )}

        {error && (
          <div className={`border rounded-lg p-4 mb-4 ${
            isDarkMode 
              ? 'bg-red-900 border-red-700 text-red-200' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && bookmarks.length === 0 && (
          <div className="text-center py-8">
            <div className={`rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <FaBookmark className={`text-4xl mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>No Bookmarks</h3>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                You haven't bookmarked any articles yet. Start reading and bookmark articles you want to save for later.
              </p>
              <a 
                href="/" 
                className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              >
                Browse News
              </a>
            </div>
          </div>
        )}

        {!loading && !error && bookmarks.length > 0 && (
          <div>
            <div className={`mb-4 p-4 border rounded-lg ${
              isDarkMode 
                ? 'bg-teal-500 border-teal-500' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-blue-200' : 'text-teal-500'
              }`}>Your Bookmarks</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-blue-100' : 'text-teal-500'
              }`}>
                You have {bookmarks.length} bookmarked articles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map(article => (
                <div key={article.url} className="relative">
                  <NewsCard
                    article={article}
                    showStatus={true}
                  />
                  <button
                    onClick={() => handleUnbookmark(article)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-10 ${
                      isDarkMode 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Remove bookmark"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {!loading && !error && bookmarks.length > 0 && (
        <div className={`mt-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Bookmarks Summary</h3>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div>
              <span className="font-medium">Total Bookmarks:</span> {bookmarks.length}
            </div>
            <div>
              <span className="font-medium">Categories:</span> {
                [...new Set(bookmarks.map(b => b.category || 'general'))].length
              }
            </div>
            <div>
              <span className="font-medium">Sources:</span> {
                [...new Set(bookmarks.map(b => b.source?.name || 'Unknown'))].length
              }
            </div>
            <div>
              <span className="font-medium">Latest:</span> {
                bookmarks.length > 0 ? new Date(bookmarks[0].publishedAt || Date.now()).toLocaleDateString() : 'None'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
