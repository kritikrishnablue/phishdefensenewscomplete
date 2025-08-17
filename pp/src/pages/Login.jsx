import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="p-4 max-w-md mx-auto flex items-center justify-center min-h-[80vh] theme-transition"
      style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="shadow-2xl rounded-xl p-8 w-full border theme-transition backdrop-blur-sm"
        style={{
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDarkMode ? '#475569' : '#e2e8f0'
        }}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.h1 
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: isDarkMode ? '#0ea5e9' : '#0891b2' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Sign In
        </motion.h1>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <motion.label 
              className="block text-sm font-semibold mb-2"
              style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </motion.label>
            <motion.input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-105 focus:scale-105"
              style={{
                borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                backgroundColor: isDarkMode ? '#334155' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                focusRingColor: isDarkMode ? '#0ea5e9' : '#06b6d4'
              }}
              required
              disabled={loading}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileFocus={{ 
                boxShadow: isDarkMode 
                  ? '0 0 0 3px rgba(14, 165, 233, 0.3)' 
                  : '0 0 0 3px rgba(6, 182, 212, 0.3)'
              }}
            />
          </div>
          
          <div>
            <motion.label 
              className="block text-sm font-semibold mb-2"
              style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <FaLock className="inline mr-2" />
              Password
            </motion.label>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-105 focus:scale-105"
                style={{
                  borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                  backgroundColor: isDarkMode ? '#334155' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#0f172a'
                }}
                required
                disabled={loading}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                whileFocus={{ 
                  boxShadow: isDarkMode 
                    ? '0 0 0 3px rgba(14, 165, 233, 0.3)' 
                    : '0 0 0 3px rgba(6, 182, 212, 0.3)'
                }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300"
                style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}
                disabled={loading}
                whileHover={{ 
                  scale: 1.2, 
                  color: isDarkMode ? '#cbd5e1' : '#475569'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
            </div>
          </div>
          
          <motion.button 
            type="submit" 
            className="w-full px-4 py-3 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: isDarkMode ? '#0ea5e9' : '#0891b2',
              borderColor: isDarkMode ? '#0284c7' : '#0e7490'
            }}
            disabled={loading}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: isDarkMode ? '#0284c7' : '#0e7490'
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
          
          {error && (
            <motion.div 
              className="text-center text-sm border rounded-lg p-3"
              style={{
                color: isDarkMode ? '#f87171' : '#b91c1c',
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                borderColor: isDarkMode ? '#dc2626' : '#fecaca'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.form>

        {/* Register Link */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold transition-colors duration-300"
              style={{ color: isDarkMode ? '#0ea5e9' : '#0891b2' }}
            >
              Sign up here
            </Link>
          </p>
        </motion.div>

        {/* Forgot Password */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a 
            href="#" 
            className="text-sm transition-colors duration-300"
            style={{ color: isDarkMode ? '#0ea5e9' : '#0891b2' }}
          >
            Forgot your password?
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
