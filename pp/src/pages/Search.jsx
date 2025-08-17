import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import Filters from '../components/Filters';
import { newsAPI } from '../services/api';
import { FaSearch, FaCalendar, FaFilter, FaDatabase } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function Search() {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState(location.state?.keyword || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Search on mount or when keyword changes
  useEffect(() => {
    if (location.state?.category) {
      handleSearchByCategory(location.state.category);
    } else if (location.state?.keyword) {
      setSearchInput(location.state.keyword);
      handleSearch(location.state.keyword);
    }
  }, [location.state]);

  // Main search handler
  const handleSearch = async (input) => {
    if (!input || !input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.searchNews({ keywords: input });
      setArticles(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.searchNews({ category });
      setArticles(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const clearResults = () => {
    setArticles([]);
    setError(null);
    setSearchInput('');
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Search News</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Find news articles by entering any word, phrase, paragraph, or category below.
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleFormSubmit} className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Type any word, phrase, paragraph, or category..."
          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 text-lg"
          disabled={loading}
        >
          <FaSearch className="text-xl" />
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={clearResults}
          className={`px-4 py-3 text-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Clear
        </button>
      </form>

      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Searching...</p>
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

        {!loading && !error && articles.length > 0 && (
          <div>
            <div className={`mb-4 p-4 border rounded-lg ${
              isDarkMode 
                ? 'bg-green-900 border-green-700' 
                : 'bg-green-50 border-green-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-green-200' : 'text-green-800'
              }`}>Search Results</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-green-100' : 'text-green-700'
              }`}>
                Found {articles.length} articles matching your search.
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

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-8">
            <FaSearch className={`text-4xl mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>No Results Found</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Try a different word, phrase, or category.
            </p>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {!loading && !error && articles.length > 0 && (
        <div className={`mt-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Search Summary</h3>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div>
              <span className="font-medium">Results:</span> {articles.length}
            </div>
            <div>
              <span className="font-medium">Keywords:</span> {searchInput || 'None'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
