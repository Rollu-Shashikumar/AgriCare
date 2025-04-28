import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CropHealth from './pages/CropHealth';
import Marketplace from './pages/Marketplace';
import MentalHealth from './pages/MentalHealth';
import Community from './pages/Community';
import MarketPrices from './pages/MarketPrices';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;