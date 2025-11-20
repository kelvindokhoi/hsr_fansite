import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        {/* Protected routes */}
        <Route 
          path="/gacha-pulling" 
          element={
            <ProtectedRoute>
              {/* <GachaPulling /> - Create this later */}
              <div>Gacha Pulling Page (Protected)</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/character-list" 
          element={
            <ProtectedRoute>
              {/* <CharacterList /> - Create this later */}
              <div>Character List Page (Protected)</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;