import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaLeaf, FaCloudSun, FaSyncAlt, FaFlask, FaBug, FaPaperPlane, FaRobot, FaUser, FaMapMarkerAlt, FaTint, FaInfoCircle, FaSeedling } from 'react-icons/fa';

const CropHealth = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm AgriCare, your agricultural knowledge assistant. Ask me about crops, soil, pests, weather, or farming techniques." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [cropRotationInput, setCropRotationInput] = useState('');
  const [fertilizerInput, setFertilizerInput] = useState('');
  const [pestImage, setPestImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [weather, setWeather] = useState({ temp: '--°C', location: '--', humidity: '--' });
  const [isLoading, setIsLoading] = useState(false);
  const [userLat, setUserLat] = useState('');
  const [userLon, setUserLon] = useState('');
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLon(position.coords.longitude);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setUserLat(40.7128);
          setUserLon(-74.0060);
          fetchWeather(40.7128, -74.0060);
        }
      );
    } else {
      console.log('Geolocation not supported.');
      fetchWeather(40.7128, -74.0060);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/weather', { params: { lat, lon } });
      const data = response.data.split('\n');
      console.log("Raw weather data:", data);  // Debug log
      const locationLine = data[0] || '';
      const location = locationLine.startsWith('Weather in ')
        ? locationLine.split('Weather in ')[1]?.trim() || 'Unknown Location'
        : 'Unknown Location';
      setWeather({
        temp: data[2]?.split(': ')[1] || '--°C',
        location: location,
        humidity: data[3]?.split(': ')[1] || '--'
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({
        temp: '--°C',
        location: 'Unable to fetch location',
        humidity: '--'
      });
    }
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(scrollToBottom, 100);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    appendMessage('user', userInput);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userInput);
      formData.append('lat', userLat);
      formData.append('lon', userLon);

      const response = await axios.post('http://127.0.0.1:5000/chat', formData);
      const formattedText = response.data.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      appendMessage('bot', formattedText);
    } catch (error) {
      appendMessage('bot', "I'm sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  const handleCropRotationSubmit = async (e) => {
    e.preventDefault();
    if (!cropRotationInput.trim()) return;

    appendMessage('user', `Crop Rotation Query: ${cropRotationInput}`);
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/crop_rotation', { message: cropRotationInput });
      const formattedText = response.data.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      appendMessage('bot', formattedText);
    } catch (error) {
      appendMessage('bot', 'Error getting crop rotation advice. Please try again.');
    } finally {
      setIsLoading(false);
      setCropRotationInput('');
    }
  };

  const handleFertilizerSubmit = async (e) => {
    e.preventDefault();
    if (!fertilizerInput.trim()) return;

    appendMessage('user', `Fertilizer Query: ${fertilizerInput}`);
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/fertilizer', { message: fertilizerInput });
      const formattedText = response.data.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      appendMessage('bot', formattedText);
    } catch (error) {
      appendMessage('bot', 'Error getting fertilizer recommendations. Please try again.');
    } finally {
      setIsLoading(false);
      setFertilizerInput('');
    }
  };

  const handlePestSubmit = async (e) => {
    e.preventDefault();
    if (!pestImage) return;

    appendMessage('user', 'Pest Detection: Image uploaded');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', pestImage);

    try {
      const response = await axios.post('http://127.0.0.1:5000/detect_pest', formData);
      appendMessage('bot', response.data.response || response.data.error);
    } catch (error) {
      appendMessage('bot', 'Error detecting pest. Please try again.');
    } finally {
      setIsLoading(false);
      setPestImage(null);
      setFileName('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 font-sans text-gray-800">
      {/* Styles */}
      <style>
        {`
          @keyframes messageAppear {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes typing {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.4; transform: scale(1); }
          }
          .animate-messageAppear {
            animation: messageAppear 0.3s ease forwards;
          }
          .animate-typing {
            animation: typing 1.2s infinite ease-in-out;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
          .delay-400 {
            animation-delay: 0.4s;
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Weather Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <FaCloudSun className="text-4xl" />
              <div>
                <h3 className="font-bold text-xl">Weather Conditions</h3>
                <p className="text-blue-100">Important for planning your farm activities</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{weather.temp}</p>
                <p className="text-sm text-blue-100">Temperature</p>
              </div>
              <div className="text-center border-l border-blue-300 pl-6">
                <p className="text-lg font-medium">{weather.location}</p>
                <p className="text-sm text-blue-100">Location</p>
              </div>
              <div className="text-center border-l border-blue-300 pl-6">
                <p className="text-lg font-medium">{weather.humidity}</p>
                <p className="text-sm text-blue-100">Humidity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tools */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="space-y-6">
              {/* Tool Introduction */}
              <div className="bg-white rounded-xl p-5 shadow-md border border-green-100 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-700 text-white p-3 rounded-full">
                    <FaSeedling className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Farming Tools</h3>
                    <p className="text-green-600">Optimize your agricultural practices</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">
                  Use our specialized tools to improve crop yields, manage soil health, and identify pests effectively.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FaSyncAlt className="text-green-700 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Crop Rotation</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FaFlask className="text-green-700 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Fertilizer</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FaBug className="text-green-700 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Pest Control</span>
                  </div>
                </div>
              </div>

              {/* Crop Rotation Advice */}
              <div className="bg-white rounded-xl p-5 shadow-md border border-green-100 card-hover">
                <h5 className="flex items-center gap-2 text-green-800 font-semibold mb-4 text-lg border-b border-green-100 pb-2">
                  <FaSyncAlt className="text-green-700" /> Crop Rotation Planner
                </h5>
                <form onSubmit={handleCropRotationSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Crops & Soil Type</label>
                  <input
                    type="text"
                    value={cropRotationInput}
                    onChange={(e) => setCropRotationInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500"
                    placeholder="E.g., Corn in sandy loam soil..."
                    required
                  />
                  <button type="submit" className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition font-medium flex items-center justify-center gap-2">
                    <FaSyncAlt /> Get Rotation Advice
                  </button>
                </form>
              </div>

              {/* Fertilizer Recommendations */}
              <div className="bg-white rounded-xl p-5 shadow-md border border-green-100 card-hover">
                <h5 className="flex items-center gap-2 text-green-800 font-semibold mb-4 text-lg border-b border-green-100 pb-2">
                  <FaFlask className="text-green-700" /> Fertilizer Recommender
                </h5>
                <form onSubmit={handleFertilizerSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop & Soil Conditions</label>
                  <input
                    type="text"
                    value={fertilizerInput}
                    onChange={(e) => setFertilizerInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500"
                    placeholder="E.g., Tomatoes in clay soil..."
                    required
                  />
                  <button type="submit" className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition font-medium flex items-center justify-center gap-2">
                    <FaFlask /> Get Recommendations
                  </button>
                </form>
              </div>

              {/* Pest Detection */}
              <div className="bg-white rounded-xl p-5 shadow-md border border-green-100 card-hover">
                <h5 className="flex items-center gap-2 text-green-800 font-semibold mb-4 text-lg border-b border-green-100 pb-2">
                  <FaBug className="text-green-700" /> Pest Identifier
                </h5>
                <form onSubmit={handlePestSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Plant Image</label>
                  <div className="mb-3">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition">
                      {fileName ? (
                        <div className="text-center">
                          <FaInfoCircle className="text-green-700 mx-auto mb-2 text-xl" />
                          <span className="block text-sm font-medium text-gray-700">{fileName}</span>
                          <span className="text-xs text-gray-500">Click to change file</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FaBug className="text-green-700 mx-auto mb-2 text-xl" />
                          <span className="block text-sm font-medium text-gray-700">Select an image</span>
                          <span className="text-xs text-gray-500">Click to browse files</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setPestImage(e.target.files[0]);
                          setFileName(e.target.files[0]?.name || '');
                        }}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  <button type="submit" className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition font-medium flex items-center justify-center gap-2">
                    <FaBug /> Analyze Image
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Chat Bot */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg flex flex-col h-[75vh] border border-green-100">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-green-700 rounded-full p-2">
                    <FaRobot className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">AgriCare Assistant</h2>
                    <p className="text-sm opacity-85">Your Agricultural Knowledge Partner</p>
                  </div>
                </div>
                <div className="bg-green-800 bg-opacity-30 px-3 py-1 rounded-full text-xs">
                  AI Powered
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4" ref={chatMessagesRef}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] p-4 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-50 border border-blue-100 self-end text-gray-800' 
                        : 'bg-white border border-gray-200 self-start'
                    } relative animate-messageAppear shadow-sm`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="absolute -left-2 -bottom-1 bg-green-700 text-white rounded-full p-1">
                        <FaRobot />
                      </div>
                    )}
                    {msg.sender === 'user' && (
                      <div className="absolute -right-2 -bottom-1 bg-blue-600 text-white rounded-full p-1">
                        <FaUser />
                      </div>
                    )}
                    <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 self-start inline-flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-typing"></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-typing delay-200"></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-typing delay-400"></span>
                  </div>
                )}
              </div>
              <div className="p-4 border-t bg-white rounded-b-xl">
                <form onSubmit={handleChatSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500"
                    placeholder="Ask about crops, soil, pests, weather forecasts, or farming techniques..."
                    required
                  />
                  <button type="submit" className="bg-green-700 text-white p-3 px-5 rounded-r-lg hover:bg-green-800 transition flex items-center justify-center">
                    <FaPaperPlane />
                  </button>
                </form>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  AgriCare uses AI to provide agricultural guidance but always consult with experts for critical farming decisions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CropHealth;