import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Updated import
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import CharacterListPage from './pages/CharacterListPage';
import './css/App.css';

function App() {
  return (
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route
          path="/character-list"
          element={
            <ProtectedRoute>
              <CharacterListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gacha-pulling"
          element={
            <ProtectedRoute>
              <div>Gacha Pulling Page (Protected)</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
