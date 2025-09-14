// src/pages/BuyersMarket.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, onSnapshot, doc, getDoc, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

function BuyersMarket() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

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

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Buyer')) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isLoading) return;
    const q = query(collection(db, 'cropListings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [isLoading]);

  useEffect(() => {
    if (!user || isLoading) return;
    const q = query(collection(db, 'buyRequests'), where('buyerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    });
    return unsubscribe;
  }, [user, isLoading]);

  const handleBuy = async (listing) => {
    try {
      console.log('Seller ID from listing:', listing.sellerId);
      console.log('Full listing data:', listing);
      const farmerDoc = await getDoc(doc(db, 'users', listing.sellerId));
      console.log('Farmer Doc exists:', farmerDoc.exists());
      console.log('Farmer Doc data:', farmerDoc.data());
      const farmerData = farmerDoc.exists() ? farmerDoc.data() : { name: 'Unknown Farmer', phone: 'N/A' };

      const buyerPhone = user ? user.phone || 'N/A' : 'N/A';

      await addDoc(collection(db, 'buyRequests'), {
        listingId: listing.id,
        listingCropName: listing.cropName,
        listingSellerId: listing.sellerId,
        buyerId: user ? user.uid : null,
        buyerName: user ? user.name || 'Anonymous Buyer' : 'Anonymous Buyer',
        buyerPhone: buyerPhone,
        buyerContact: user ? user.email || 'N/A' : 'N/A',
        farmerName: farmerData.name || 'Unknown Farmer',
        farmerPhone: farmerData.phone || 'N/A',
        timestamp: new Date(),
      });
      setSelectedListing({ 
        ...listing, 
        farmerName: farmerData.name || 'Unknown Farmer', 
        farmerPhone: farmerData.phone || 'N/A' 
      });
    } catch (error) {
      console.error('Error sending buy request:', error);
    }
  };

  // Filter listings based on search and price
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.place.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === '' || listing.price <= parseFloat(priceFilter);
    return matchesSearch && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-green-700 font-medium">Loading marketplace...</p>
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
            <h1 className="text-3xl font-bold mb-2">{t('buyersMarket.title', 'Fresh Crop Marketplace')}</h1>
            <p className="text-green-100 text-lg">Find and purchase quality crops from local farmers</p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-green-700 bg-opacity-50">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{listings.length}</div>
                <div className="text-green-100 text-sm">Available Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{requests.length}</div>
                <div className="text-green-100 text-sm">Your Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredListings.length}</div>
                <div className="text-green-100 text-sm">Matching Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Search and Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 sticky top-8">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Search & Filter</h2>
                <p className="text-gray-500 text-sm mt-1">Find the perfect crops</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Crops or Location
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., Rice, Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter max price"
                  />
                </div>

                <button 
                  onClick={() => {setSearchTerm(''); setPriceFilter('');}}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Available Crops Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Available Crops</h2>
                  <p className="text-gray-600 mt-1">Browse fresh crops from local farmers</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow">
                  {filteredListings.length} of {listings.length} crops shown
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Crops Found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || priceFilter ? 'Try adjusting your search filters to see more results.' : 'No crops are currently listed. Check back soon!'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-blue-400">
                      {/* Listing Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-4 rounded-xl mr-4">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">{listing.cropName}</h3>
                              <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                {listing.sellerName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">₹{listing.price}</div>
                            <div className="text-sm text-gray-500">per kg</div>
                          </div>
                        </div>
                      </div>

                      {/* Listing Details */}
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                              <div className="text-green-600 font-semibold text-sm">Available</div>
                              <div className="text-green-700 font-bold">{listing.quantity} kg</div>
                            </div>
                            <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                              <div className="text-blue-600 font-semibold text-sm">Total Cost</div>
                              <div className="text-blue-700 font-bold">₹{(listing.quantity * listing.price).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {listing.place}
                        </div>

                        <button
                          onClick={() => handleBuy(listing)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"></path>
                          </svg>
                          {t('buyersMarket.buy', 'Send Buy Request')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Confirmation */}
            {selectedListing && (
              <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 mb-1">{t('buyersMarket.requestSent', 'Request Sent Successfully!')}</h3>
                      <p className="text-green-700 text-sm">The farmer will contact you soon with purchase details</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedListing(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="mt-4 bg-white p-4 rounded-lg border border-green-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Crop:</span>
                      <span className="ml-2">{selectedListing.cropName} ({selectedListing.quantity} kg)</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-2">₹{selectedListing.price}/kg</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2">{selectedListing.place}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Farmer:</span>
                      <span className="ml-2">{selectedListing.farmerName}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-100">
                    <span className="font-medium text-gray-700">Contact:</span>
                    <span className="ml-2">{selectedListing.farmerPhone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* My Requests Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{t('buyersMarket.myRequests', 'My Purchase Requests')}</h2>
                  <p className="text-gray-600 mt-1">Track your crop purchase requests</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow">
                  {requests.length} {requests.length === 1 ? 'request' : 'requests'}
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Requests Yet</h3>
                  <p className="text-gray-500 mb-6">Start browsing crops above to make your first purchase request.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-400">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{req.listingCropName}</h3>
                            <div className="text-sm text-gray-600 space-x-4">
                              <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {req.timestamp ? new Date(req.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                              </span>
                              <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                {req.farmerName || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                            <div className="text-orange-600 font-semibold text-sm">Status</div>
                            <div className="text-orange-700 font-medium text-sm">Pending</div>
                          </div>
                        </div>
                      </div>
                      
                      {req.farmerPhone && req.farmerPhone !== 'N/A' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            Farmer Contact: {req.farmerPhone}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyersMarket;