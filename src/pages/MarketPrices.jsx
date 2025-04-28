import { useState } from 'react';
import axios from 'axios';
import { FaChartLine, FaSearch, FaLeaf, FaRupeeSign, FaVideo, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const MarketPrices = () => {
  const [cropName, setCropName] = useState('');
  const [prices, setPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoModal, setVideoModal] = useState({ show: false, url: '', title: '' });
  const [activeTab, setActiveTab] = useState('prices');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName.trim()) {
      setError('Please enter a crop name.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPrices([]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/market_prices', { crop: cropName });
      setPrices(response.data.prices || []);
      if (response.data.prices.length === 0) {
        setError('No prices found for this crop.');
      }
    } catch (err) {
      console.error('Axios error details:', err.response || err.message);
      setError('Error fetching market prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSchemes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/subsidy');
      setSchemes(response.data.agricultural_schemes);
    } catch (error) {
      setSchemes([{ error: 'Error fetching schemes. Please try again.' }]);
    }
  };

  const handleFetchVideos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/video_tutorials');
      setVideos(response.data.video_tutorials);
    } catch (error) {
      setVideos([{ error: 'Error fetching video tutorials. Please try again.' }]);
    }
  };

  const handleWatchVideo = (videoId, title) => {
    setVideoModal({ show: true, url: `https://www.youtube.com/embed/${videoId}`, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ show: false, url: '', title: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>

      {/* Header */}
      {/* <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <FaLeaf className="mr-2" />
                AgriMarket Insights
              </h1>
              <p className="mt-1 text-green-100">Real-time agricultural data for farmers</p>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex mb-6 border-b">
          <button 
            onClick={() => setActiveTab('prices')}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'prices' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-green-600'}`}
          >
            <FaChartLine className="mr-2" /> Market Prices
          </button>
          <button 
            onClick={() => {
              setActiveTab('schemes');
              if (schemes.length === 0) handleFetchSchemes();
            }}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'schemes' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-green-600'}`}
          >
            <FaRupeeSign className="mr-2" /> Agricultural Schemes
          </button>
          <button 
            onClick={() => {
              setActiveTab('videos');
              if (videos.length === 0) handleFetchVideos();
            }}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'videos' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-green-600'}`}
          >
            <FaVideo className="mr-2" /> Video Tutorials
          </button>
        </div>

        {/* Market Prices Section */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-lg shadow-md animate-fadeIn">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Market Price Explorer
              </h2>

              {/* Crop Input Form */}
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter crop name (e.g., Wheat, Chilli)"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Searching...
                      </>
                    ) : (
                      'Get Prices'
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-50 text-red-600 border-l-4 border-red-600 rounded">
                    {error}
                  </div>
                )}
              </form>

              {/* Prices Table */}
              {prices.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg border">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Crop</th>
                        <th className="px-4 py-3 text-right">Min Price (₹)</th>
                        <th className="px-4 py-3 text-right">Modal Price (₹)</th>
                        <th className="px-4 py-3 text-right">Max Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((price, index) => (
                        <tr key={index} className={`border-t hover:bg-gray-50 animate-fadeIn ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3">{price.location}</td>
                          <td className="px-4 py-3 font-medium">{price.crop}</td>
                          <td className="px-4 py-3 text-right">{price.min_price}</td>
                          <td className="px-4 py-3 text-right font-medium text-green-600">{price.modal_price}</td>
                          <td className="px-4 py-3 text-right">{price.max_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !isLoading && !error && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <FaSearch className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-600">Enter a crop name to see current market prices.</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Agricultural Schemes */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-lg shadow-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Agricultural Subsidy Schemes
                </h2>
                <a 
                  href="https://agriwelfare.gov.in/en/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-700 transition"
                >
                  Visit Official Portal <FaExternalLinkAlt className="ml-1" />
                </a>
              </div>

              {schemes.length === 0 ? (
                <div className="text-center py-8">
                  <button 
                    onClick={handleFetchSchemes}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                  >
                    Load Agricultural Schemes
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {schemes.map((scheme, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">{scheme.scheme_name}</h3>
                      {scheme.description && <p className="text-gray-600">{scheme.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Tutorials */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-lg shadow-md animate-fadeIn">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Farming Video Tutorials
              </h2>

              {videos.length === 0 ? (
                <div className="text-center py-8">
                  <button 
                    onClick={handleFetchVideos}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                  >
                    Load Video Tutorials
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="bg-gray-100 h-48 flex items-center justify-center relative">
                        <FaVideo className="text-4xl text-gray-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => handleWatchVideo(video.youtube_id, video.title)}
                            className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                        <button
                          onClick={() => handleWatchVideo(video.youtube_id, video.title)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                        >
                          Watch Tutorial <FaVideo className="ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl animate-fadeIn">
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="text-lg font-semibold">{videoModal.title || 'Tutorial Video'}</h5>
              <button onClick={closeVideoModal} className="text-gray-600 hover:text-gray-800 p-1">
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={videoModal.url}
                  title="YouTube video"
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end rounded-b-lg">
              <button 
                onClick={closeVideoModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default MarketPrices;