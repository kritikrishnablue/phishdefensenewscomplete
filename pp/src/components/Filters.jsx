import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'in', name: 'India' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  // Add more as needed
]

const categories = [
  'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'
]

const sources = [
  { value: 'all', label: 'All Sources' },
  { value: 'newsapi', label: 'NewsAPI' },
  { value: 'gnews', label: 'GNews' },
]

export default function Filters({ values, onChange, disableCategory = false }) {
  const { isDarkMode } = useTheme()
  const [local, setLocal] = useState(values || {
    country: 'us',
    category: '',
    source: 'all',
    q: ''
  })
  const [channels, setChannels] = useState([])

  useEffect(() => {
    // Fetch channels from backend
    fetch('http://127.0.0.1:8000/news/channels')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || [])
      })
      .catch(() => setChannels([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...local, [name]: value }
    setLocal(updated)
    onChange && onChange(updated)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div>
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Country</label>
        <select 
          name="country" 
          value={local.country} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Category</label>
        <select 
          name="category" 
          value={local.category} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
          disabled={disableCategory}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Source</label>
        <select 
          name="source" 
          value={local.source} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          <option value="all">All Sources</option>
          {channels.map(channel => <option key={channel} value={channel}>{channel}</option>)}
        </select>
      </div>
      <div>
        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Search</label>
        <input
          name="q"
          value={local.q}
          onChange={handleChange}
          placeholder="Search keywords..."
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>
    </div>
  )
} 