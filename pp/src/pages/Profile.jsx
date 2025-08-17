import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI, locationAPI } from '../services/api';
import { FaUser, FaCog, FaHistory, FaBookmark, FaHeart, FaGlobe, FaNewspaper, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { isDarkMode } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    topics: [],
    sources: [],
    countries: []
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState(null);

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'in', name: 'India' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'au', name: 'Australia' },
    { code: 'ca', name: 'Canada' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
    { code: 'cn', name: 'China' },
    { code: 'br', name: 'Brazil' }
  ];

  const topics = [
    'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'
  ];

  const sources = [
    'BBC News', 'CNN', 'Reuters', 'The New York Times', 'The Guardian', 'Al Jazeera',
    'NPR', 'ABC News', 'CBS News', 'NBC News', 'Fox News', 'MSNBC'
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // Fetch detected location
    locationAPI.getLocation().then(loc => setDetectedLocation(loc.location)).catch(() => setDetectedLocation(null));
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userAPI.getProfile();
      setProfile(profileData);
      setPreferences(profileData.preferences || { topics: [], sources: [], countries: [] });
      
      // Load recently viewed articles
      const historyData = await userAPI.getRecentlyViewed();
      setRecentlyViewed(historyData.recently_viewed || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (type, value, checked) => {
    setPreferences(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const savePreferences = async () => {
    try {
      await userAPI.updatePreferences(preferences);
      updateUser({ preferences });
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences: ' + error.message);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-red-400 text-center">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center text-gray-400">Please login to view your profile.</div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`p-4 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={`rounded-xl shadow-2xl border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-8 rounded-t-xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaUser className="text-3xl" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl font-bold mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {user.username || user.email}
              </motion.h1>
              <motion.p 
                className="text-cyan-100 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                News Aggregator User
              </motion.p>
              <motion.div 
                className="flex items-center gap-4 mt-2 text-sm text-cyan-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span>📊 {user.bookmarks?.length || 0} Bookmarks</span>
                <span>❤️ {user.liked_articles?.length || 0} Liked</span>
                <span>📖 {user.reading_history?.length || 0} Read</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className={`border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="flex">
            {[
              { id: 'profile', label: 'Profile', icon: FaUser },
              { id: 'preferences', label: 'Preferences', icon: FaCog },
              { id: 'history', label: 'Reading History', icon: FaHistory },
              { id: 'bookmarks', label: 'Bookmarks', icon: FaBookmark },
              { id: 'liked', label: 'Liked Articles', icon: FaHeart }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 flex items-center gap-2 transition-all duration-300 font-medium relative ${
                  activeTab === tab.id
                    ? isDarkMode 
                      ? 'text-teal-400' 
                      : 'text-teal-600'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className="text-sm" />
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div 
          className="p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                  className={`p-6 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <h3 className={`font-bold text-lg ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Account Information</h3>
                  </div>
                  <div className="space-y-3">
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong className="text-teal-500">Email:</strong> {user.email}
                    </p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong className="text-teal-500">Username:</strong> {user.username || 'N/A'}
                    </p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong className="text-teal-500">Member since:</strong> {new Date().toLocaleDateString()}
                    </p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <strong className="text-teal-500">Location:</strong> {detectedLocation ? `${detectedLocation.city || ''}${detectedLocation.city ? ', ' : ''}${detectedLocation.region || ''}${detectedLocation.region ? ', ' : ''}${detectedLocation.country_name || detectedLocation.country_code || 'Unknown'}` : 'Detecting...'}
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className={`p-6 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <FaNewspaper className="text-white" />
                    </div>
                    <h3 className={`font-bold text-lg ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Statistics</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Bookmarks</span>
                        <span className="text-2xl font-bold text-cyan-500">{user.bookmarks?.length || 0}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Liked Articles</span>
                        <span className="text-2xl font-bold text-pink-500">{user.liked_articles?.length || 0}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Reading History</span>
                        <span className="text-2xl font-bold text-green-500">{user.reading_history?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="text-sm" />
                Logout
              </motion.button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>News Preferences</h3>
                <motion.button
                  onClick={savePreferences}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center gap-2 font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave className="text-sm" />
                  Save Preferences
                </motion.button>
              </div>

              {/* Countries */}
              <motion.div 
                className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FaGlobe />
                  Preferred Countries
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {countries.map(country => (
                    <motion.label 
                      key={country.code} 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.countries.includes(country.code)}
                        onChange={(e) => handlePreferenceChange('countries', country.code, e.target.checked)}
                        className={`rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      {country.name}
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Topics */}
              <motion.div 
                className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FaNewspaper />
                  Preferred Topics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {topics.map(topic => (
                    <motion.label 
                      key={topic} 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.topics.includes(topic)}
                        onChange={(e) => handlePreferenceChange('topics', topic, e.target.checked)}
                        className={`rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Sources */}
              <motion.div 
                className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <h4 className={`font-bold text-lg mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Preferred Sources</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {sources.map(source => (
                    <motion.label 
                      key={source} 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.sources.includes(source)}
                        onChange={(e) => handlePreferenceChange('sources', source, e.target.checked)}
                        className={`rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      {source}
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Reading History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Recently Viewed Articles</h3>
              {recentlyViewed.length > 0 ? (
                <div className="space-y-2">
                  {recentlyViewed.map((articleId, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <a 
                        href={articleId} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-teal-400 hover:text-teal-300' 
                            : 'text-teal-600 hover:text-teal-700'
                        }`}
                      >
                        {articleId}
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaHistory className={`text-4xl mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No reading history yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Bookmarked Articles</h3>
              {user.bookmarks?.length > 0 ? (
                <div className="space-y-2">
                  {user.bookmarks.map((bookmark, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <a 
                        href={bookmark} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-teal-400 hover:text-teal-300' 
                            : 'text-teal-600 hover:text-teal-700'
                        }`}
                      >
                        {bookmark}
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBookmark className={`text-4xl mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No bookmarks yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Liked Articles Tab */}
          {activeTab === 'liked' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Liked Articles</h3>
              {user.liked_articles?.length > 0 ? (
                <div className="space-y-2">
                  {user.liked_articles.map((articleId, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <a 
                        href={articleId} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`transition-colors duration-200 ${
                          isDarkMode 
                            ? 'text-teal-400 hover:text-teal-300' 
                            : 'text-teal-600 hover:text-teal-600'
                        }`}
                      >
                        {articleId}
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaHeart className={`text-4xl mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No liked articles yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
