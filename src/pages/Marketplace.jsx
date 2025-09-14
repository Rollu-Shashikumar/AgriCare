// src/pages/Marketplace.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

function Marketplace() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [place, setPlace] = useState('');
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local auth listener: Set user and fetch role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = { ...currentUser, ...userDoc.data() };
            setUser(userData);
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Redirect if not Farmer
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Farmer')) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // Fetch farmer's listings (real-time)
  useEffect(() => {
    if (!user || isLoading) return;
    const q = query(collection(db, 'cropListings'), where('sellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user, isLoading]);

  // Fetch buy requests for farmer's listings (real-time) with buyer details
  useEffect(() => {
    if (!user || isLoading) return;
    const q = query(collection(db, 'buyRequests'), where('listingSellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    });
    return unsubscribe;
  }, [user, isLoading]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName || !quantity || !price || !place) return;

    try {
      await addDoc(collection(db, 'cropListings'), {
        cropName,
        quantity: Number(quantity),
        price: Number(price),
        place,
        sellerId: user.uid,
        sellerName: user.name || 'Anonymous Farmer',
        createdAt: new Date(),
      });
      setCropName('');
      setQuantity('');
      setPrice('');
      setPlace('');
    } catch (error) {
      console.error('Error adding listing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-green-700 font-medium">Loading your marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{t('marketplace.title', 'Farmer\'s Marketplace')}</h1>
            <p className="text-green-100 text-lg">Sell your fresh crops directly to buyers</p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-green-700 bg-opacity-50">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{listings.length}</div>
                <div className="text-green-100 text-sm">Active Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{requests.length}</div>
                <div className="text-green-100 text-sm">Buy Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold">₹{listings.reduce((total, listing) => total + (listing.quantity * listing.price), 0).toLocaleString()}</div>
                <div className="text-green-100 text-sm">Total Inventory Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add New Listing Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500 sticky top-8">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Add New Listing</h2>
                <p className="text-gray-500 text-sm mt-1">Create a new crop listing</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.cropName', 'Crop Name')}
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="e.g., Rice, Wheat, Tomatoes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.quantity', 'Quantity')} (kg)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Enter quantity in kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.price', 'Price per kg')} (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Price per kilogram"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplace.place', 'Location')}
                  </label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="City, District"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {t('marketplace.submit', 'Create Listing')}
                </button>
              </form>
            </div>
          </div>

          {/* Listings Display */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('marketplace.yourListings', 'Your Crop Listings')}</h2>
                <p className="text-gray-600 mt-1">Manage and track your crop sales</p>
              </div>
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow">
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'} active
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first crop listing to connect with buyers and grow your business.</p>
                <div className="inline-flex items-center text-green-600 bg-green-50 px-6 py-3 rounded-full font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                  Use the form on the left to get started
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {listings.map((listing) => {
                  const listingRequests = requests.filter(req => req.listingId === listing.id);
                  
                  return (
                    <div key={listing.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-green-400">
                      {/* Listing Header */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-4 rounded-xl mr-4">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">{listing.cropName}</h3>
                              <div className="flex items-center text-gray-600 text-sm space-x-4">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  </svg>
                                  {listing.place}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  {new Date(listing.createdAt?.toDate()).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">₹{listing.price}</div>
                            <div className="text-sm text-gray-500">per kg</div>
                          </div>
                        </div>
                      </div>

                      {/* Listing Details */}
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                              <div className="text-blue-600 font-semibold text-sm">Available Quantity</div>
                              <div className="text-blue-700 font-bold">{listing.quantity} kg</div>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                              <div className="text-green-600 font-semibold text-sm">Total Value</div>
                              <div className="text-green-700 font-bold">₹{(listing.quantity * listing.price).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                              listingRequests.length > 0 
                                ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                : 'bg-gray-50 text-gray-600 border-gray-100'
                            }`}>
                              {listingRequests.length} {listingRequests.length === 1 ? 'request' : 'requests'}
                            </span>
                          </div>
                        </div>

                        {/* Buy Requests Section */}
                        <div className="border-t border-gray-100 pt-5">
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            {t('marketplace.buyRequests', 'Buy Requests')}
                          </h4>
                          
                          {listingRequests.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <p className="text-gray-500 font-medium">{t('marketplace.noRequests', 'No requests yet')}</p>
                              <p className="text-gray-400 text-sm mt-1">Buyers will contact you soon!</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {listingRequests.map((req, index) => (
                                <div key={req.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-800 mb-1">
                                          {t('marketplace.requestFrom', { buyer: req.buyerName })}
                                        </div>
                                        <div className="text-sm text-gray-600 space-x-4">
                                          <span className="inline-flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                            {req.buyerPhone || 'N/A'}
                                          </span>
                                          <span className="inline-flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            {req.buyerContact || 'N/A'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                        Contact
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;