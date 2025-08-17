import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCog, FaFilter } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function Personalized() {
  const { isDarkMode } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadPersonalizedNews();
    }
  }, [isAuthenticated]);

  const loadPersonalizedNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.getPersonalized('all');
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <FaUser className={`text-3xl mx-auto mb-4 ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <h2 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
          }`}>Login Required</h2>
          <p className={`mb-4 ${
            isDarkMode ? 'text-yellow-100' : 'text-yellow-700'
          }`}>
            Please login to view your personalized news feed based on your preferences and reading history.
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
            }`}>Personalized News</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              News tailored to your preferences and reading history
            </p>
          </div>
          <a 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            <FaCog className="text-sm" />
            Manage Preferences
          </a>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Loading personalized news...</p>
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

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-8">
            <div className={`rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <FaUser className={`text-4xl mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>No Personalized News</h3>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                We couldn't find personalized news for you. This might be because:
              </p>
              <ul className={`text-left space-y-1 mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>• You haven't set any preferences yet</li>
                <li>• You haven't liked or bookmarked any articles</li>
                <li>• Your reading history is empty</li>
              </ul>
              <a 
                href="/profile" 
                className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              >
                Set Your Preferences
              </a>
            </div>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div>
            <div className={`mb-4 p-4 border rounded-lg ${
              isDarkMode 
                ? 'bg-blue-900 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-800'
              }`}>Your Personalized Feed</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-blue-100' : 'text-blue-700'
              }`}>
                Showing {articles.length} articles based on your preferences, reading history, and engagement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <NewsCard
                  key={article.url || article.title}
                  article={article}
                  showStatus={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {!loading && !error && articles.length > 0 && (
        <div className={`mt-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Personalization Summary</h3>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div>
              <span className="font-medium">Total Articles:</span> {articles.length}
            </div>
            <div>
              <span className="font-medium">Source:</span> {'All'}
            </div>
            <div>
              <span className="font-medium">Recommended:</span> {
                articles.filter(a => a.status === 'Recommended').length
              }
            </div>
            <div>
              <span className="font-medium">Read:</span> {
                articles.filter(a => a.status === 'Read').length
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
