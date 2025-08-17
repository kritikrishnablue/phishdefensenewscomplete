import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Categories from './pages/Categories';
import Personalized from './pages/Personalized';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/personalized" element={<Personalized />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;