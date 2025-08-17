import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { googleOAuth } from '../services/googleOAuth';
import { appleOAuth } from '../services/appleOAuth';
import { FaGoogle, FaApple, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const { isDarkMode } = useTheme();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState({ google: false, apple: false });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        preferences: {
          topics: [],
          sources: [],
          countries: []
        },
        bookmarks: [],
        liked_articles: []
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <motion.div 
      className={`p-4 max-w-md mx-auto flex items-center justify-center min-h-[80vh] transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={`shadow-2xl rounded-xl p-8 w-full border backdrop-blur-sm transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.h1 
          className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? 'text-teal-400' : 'text-teal-600'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create an Account
        </motion.h1>
        
      
         
          
          
        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${
              isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
            }`}>or register with email</span>
          </div>
        </div>

        {/* Registration Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Username Field */}
          <div>
            <motion.label 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <FaUser className="inline mr-2" />
              Username
            </motion.label>
            <motion.input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                errors.username 
                  ? 'border-red-500' 
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              required
              disabled={loading}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileFocus={{ 
                boxShadow: isDarkMode 
                  ? '0 0 0 3px rgba(6, 182, 212, 0.3)' 
                  : '0 0 0 3px rgba(6, 182, 212, 0.2)'
              }}
            />
            {errors.username && (
              <motion.p 
                className="text-red-400 text-sm mt-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <motion.label 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </motion.label>
            <motion.input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                errors.email 
                  ? 'border-red-500' 
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              required
              disabled={loading}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              whileFocus={{ 
                boxShadow: isDarkMode 
                  ? '0 0 0 3px rgba(6, 182, 212, 0.3)' 
                  : '0 0 0 3px rgba(6, 182, 212, 0.2)'
              }}
            />
            {errors.email && (
              <motion.p 
                className="text-red-400 text-sm mt-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <motion.label 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <FaLock className="inline mr-2" />
              Password
            </motion.label>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                  errors.password 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                required
                disabled={loading}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                whileFocus={{ 
                  boxShadow: isDarkMode 
                    ? '0 0 0 3px rgba(6, 182, 212, 0.3)' 
                    : '0 0 0 3px rgba(6, 182, 212, 0.2)'
                }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
                whileHover={{ 
                  scale: 1.2, 
                  color: isDarkMode ? '#cbd5e1' : '#374151'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            </div>
            {errors.password && (
              <motion.p 
                className="text-red-400 text-sm mt-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <motion.label 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            >
              <FaLock className="inline mr-2" />
              Confirm Password
            </motion.label>
            <div className="relative">
              <motion.input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                  errors.confirmPassword 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                required
                disabled={loading}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.3 }}
                whileFocus={{ 
                  boxShadow: isDarkMode 
                    ? '0 0 0 3px rgba(6, 182, 212, 0.3)' 
                    : '0 0 0 3px rgba(6, 182, 212, 0.2)'
                }}
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
                whileHover={{ 
                  scale: 1.2, 
                  color: isDarkMode ? '#cbd5e1' : '#374151'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            </div>
            {errors.confirmPassword && (
              <motion.p 
                className="text-red-400 text-sm mt-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            className={`w-full px-4 py-3 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-teal-500 border border-teal-600 hover:bg-teal-600' 
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
            disabled={loading}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: isDarkMode ? '#0284c7' : '#0e7490'
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>

          {/* Error Display */}
          {/* {error && (
            <div className="text-red-400 text-center text-sm bg-red-900/20 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )} */}
        </motion.form>

        {/* Login Link */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className={`font-semibold transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-teal-400 hover:text-teal-300' 
                  : 'text-teal-600 hover:text-teal-700'
              }`}
            >
              Sign in here
            </Link>
          </p>
        </motion.div>

        {/* Terms and Privacy */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            By creating an account, you agree to our{' '}
            <a href="#" className={`transition-colors duration-300 ${
              isDarkMode 
                ? 'text-teal-400 hover:text-teal-300' 
                : 'text-teal-600 hover:text-teal-700'
            }`}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className={`transition-colors duration-300 ${
              isDarkMode 
                ? 'text-teal-400 hover:text-teal-300' 
                : 'text-teal-600 hover:text-teal-700'
            }`}>Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
