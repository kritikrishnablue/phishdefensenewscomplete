import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaShieldAlt, 
  FaSun, 
  FaMoon, 
  FaBell, 
  FaBookmark, 
  FaCog, 
  FaUser,
  FaSearch,
  FaHome,
  FaFire,
  FaLayerGroup,
  FaHeart,
  FaChartLine,
  FaGlobe,
  FaLock,
  FaFlask,
  FaBuilding,
  FaNewspaper,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaEye,
  FaLaptop,
  FaMicroscope
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Shield,
  Laptop,
  Building,
  Globe,
  Microscope,
  Heart,
  Landmark,
  Trophy,
  Plane
} from 'lucide-react';

const sidebarCategories = [
  { id: 'all', label: 'All News', icon: Home, path: '/', color: 'text-white' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield, path: '/categories', color: 'text-red-400' },
  { id: 'technology', label: 'Technology', icon: Laptop, path: '/categories', color: 'text-blue-400' },
  { id: 'business', label: 'Business', icon: Building, path: '/categories', color: 'text-green-400' },
  { id: 'politics', label: 'Politics', icon: Landmark, path: '/categories', color: 'text-purple-400' },
  { id: 'science', label: 'Science', icon: Microscope, path: '/categories', color: 'text-yellow-400' },
  { id: 'health', label: 'Health', icon: Heart, path: '/categories', color: 'text-pink-400' },
  { id: 'world', label: 'World', icon: Globe, path: '/categories', color: 'text-indigo-400' },
  { id: 'sports', label: 'Sports', icon: Trophy, path: '/categories', color: 'text-orange-400' },
  { id: 'travel', label: 'Travel', icon: Plane, path: '/categories', color: 'text-teal-400' },
];

const quickActions = [
  { id: 'trending', label: 'Trending', icon: FaChartLine, path: '/personalized' },
  { id: 'saved', label: 'Saved Articles', icon: FaBookmark, path: '/bookmarks' },
  { id: 'settings', label: 'Settings', icon: FaCog, path: '/settings' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle search submit
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    navigate('/search', { state: { keyword: searchTerm.trim() } });
    setSearchTerm("");
  };

  // Open search page on search bar click
  const handleSearchBarClick = () => {
    navigate('/search');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} transition-colors duration-500`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <div className="flex items-center gap-3">
              <motion.img
                src={isDarkMode ? "/images/logo2.png" : "/images/lightmodelogo.png"}
                alt="Phish Defense News Logo"
                className="w-2xs h-fit object-contain transition-opacity duration-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                key={isDarkMode ? 'dark-logo' : 'light-logo'}
              />
            </div>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/personalized"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Trending
            </NavLink>
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Saved
            </NavLink>
          </nav>

          {/* Right: Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form className="hidden sm:block relative" onSubmit={handleSearch}>
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm cursor-pointer ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} onClick={handleSearch} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <FaSun className="text-lg" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: 180, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -180, scale: 0.5 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <FaMoon className="text-lg" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <NavLink
                  to="/bookmarks"
                  className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-teal-400' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <FaBookmark />
                </NavLink>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <NavLink
                  to="/settings"
                  className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-teal-400 hover:shadow-lg' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-teal-600 hover:shadow-lg'
                  }`}
                >
                  <FaCog />
                </NavLink>
              </motion.div>
              
              {/* User Menu */}
              <div className="relative">
                <motion.button
                  className={`p-2 rounded-full transition-colors focus:outline-none ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setShowProfileDropdown((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser />
                </motion.button>
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col py-2">
                        {isAuthenticated ? (
                          <button
                            className={`px-4 py-2 rounded transition-colors ${
                              isDarkMode 
                                ? 'text-gray-200 hover:bg-gray-700' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              handleLogout();
                              setShowProfileDropdown(false);
                            }}
                          >
                            Logout
                          </button>
                        ) : (
                          <>
                            <NavLink
                              to="/login"
                              className={`px-4 py-2 rounded transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-200 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              Login
                            </NavLink>
                            <NavLink
                              to="/register"
                              className={`px-4 py-2 rounded transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-200 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => setShowProfileDropdown(false)}
                            >
                              Sign Up
                            </NavLink>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 bottom-0 z-40 w-80 border-r transform transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        } ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col h-full p-6">
            {/* View All Categories Button */}
            <div className="mb-6">
              <motion.button
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-teal-500 text-teal-400 hover:bg-gray-600' 
                    : 'bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100'
                }`}
                onClick={() => navigate('/categories')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="5" height="5" rx="1" fill="currentColor"/>
                    <rect x="10" y="3" width="5" height="5" rx="1" fill="currentColor"/>
                    <rect x="17" y="3" width="4" height="5" rx="1" fill="currentColor"/>
                    <rect x="3" y="10" width="5" height="5" rx="1" fill="currentColor"/>
                    <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor"/>
                    <rect x="17" y="10" width="4" height="5" rx="1" fill="currentColor"/>
                    <rect x="3" y="17" width="5" height="4" rx="1" fill="currentColor"/>
                    <rect x="10" y="17" width="5" height="4" rx="1" fill="currentColor"/>
                    <rect x="17" y="17" width="4" height="4" rx="1" fill="currentColor"/>
                  </svg>
                  <span className="font-medium">View All Categories</span>
                </div>
                <FaArrowRight className="text-lg" />
              </motion.button>
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <h5 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Categories
              </h5>
              
              <nav className="space-y-1">
                {sidebarCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive && category.id === window.sessionStorage.getItem('selectedCategory')
                            ? 'bg-teal-500 text-white'
                            : isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                      onClick={() => {
                        setSidebarOpen(false);
                        window.sessionStorage.setItem('selectedCategory', category.id);
                        window.dispatchEvent(new CustomEvent('categoryChanged', { detail: category.id }));
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <category.icon className={`text-xl ${
                              isActive && category.id === 'all' 
                                ? 'text-white' 
                                : category.color
                            }`} />
                            <span className="font-medium text-base">{category.label}</span>
                          </div>
                          {isActive && category.id === 'all' && <FaArrowRight className="text-sm" />}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Quick Actions Section */}
            <div>
              <h5 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Quick Actions
              </h5>
              
              <nav className="space-y-1">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={action.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-teal-500/20 text-teal-400'
                            : isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <action.icon className="text-lg" />
                      <span className="font-medium text-base">{action.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen xl:ml-80 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}