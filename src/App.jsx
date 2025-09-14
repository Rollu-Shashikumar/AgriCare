import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Adjust path if needed
import Home from './pages/Home';
import CropHealth from './pages/CropHealth';
import Marketplace from './pages/Marketplace'; // Farmer side
import BuyersMarket from './pages/BuyersMarket'; // Buyer side
import MentalHealth from './pages/MentalHealth';
import Community from './pages/Community';
import MarketPrices from './pages/MarketPrices';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

// Simple ProtectedRoute (no context needed - uses local auth listener)
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // True if user logged in
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-green-600">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login (preserve intended path)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated: Render the page (role checks inside components)
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes> {/* Open <Routes> here */}
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/crop-health"
              element={
                <ProtectedRoute>
                  <CropHealth />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace" // Farmer side
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyers-market" // Buyer side
              element={
                <ProtectedRoute>
                  <BuyersMarket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market-prices"
              element={
                <ProtectedRoute>
                  <MarketPrices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mental-health"
              element={
                <ProtectedRoute>
                  <MentalHealth />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes> {/* Close <Routes> here - FIXED! */}
        </main>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;