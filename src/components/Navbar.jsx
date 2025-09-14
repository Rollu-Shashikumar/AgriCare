import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState(null); // New: Track user role
  const [isLoading, setIsLoading] = useState(true);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Monitor authentication state and fetch user name/role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser ? currentUser.uid : 'No user');
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || 'User');
            setUserRole(userData.role || null); // Set role (e.g., 'Buyer', 'Farmer')
            console.log('User data fetched:', { name: userData.name, role: userData.role });
          } else {
            console.log('No user document found in Firestore');
            setUserName('User');
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName('User');
          setUserRole(null);
        }
      } else {
        setUserName('User');
        setUserRole(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      console.log('User signed out, redirecting to home');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="h-16 border-b border-green-500"></div>;
  }

  return (
    <nav className="bg-white text-gray-800 shadow-sm sticky top-0 z-50 border-b border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Tagline */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-700">AgriCare</h1>
                <p className="text-xs text-green-600 hidden sm:block">Smart Solutions for Modern Farming</p>
              </div>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Dropdown - Always Visible */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-300 text-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>

            {user ? (
              <>
                {/* Profile Icon with Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 focus:outline-none text-gray-700 hover:text-green-700"
                  >
                    <span className="text-sm font-medium">{userName}</span>
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM2 20c0-5.523 4.477-10 10-10s10 4.477 10 10v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"
                        />
                      </svg>
                    </div>
                  </button>
                  {isProfileOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {userRole === 'Buyer' ? (
                        // Only show BuyersMarket for Buyers
                        <li>
                          <NavLink
                            to="/buyers-market"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            {t('navbar.buyersMarket', 'Browse Crops')}
                          </NavLink>
                        </li>
                      ) : (
                        // Show all links for other roles (e.g., Farmer)
                        <>
                          <li>
                            <NavLink
                              to="/crop-health"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {t('navbar.cropHealth')}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/marketplace"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {t('navbar.marketplace')}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/market-prices"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {t('navbar.marketPrices')}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/mental-health"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {t('navbar.mentalHealth')}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/community"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {t('navbar.community')}
                            </NavLink>
                          </li>
                        </>
                      )}
                      <li className="border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          {t('navbar.signOut')}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="text-green-700 border border-green-600 px-4 py-1 rounded-md hover:bg-green-50 text-sm font-medium transition-colors"
                >
                  {t('navbar.login')}
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  {t('navbar.register')}
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-green-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <ul className="space-y-2">
            {/* Language Dropdown - Always Visible in Mobile Menu */}
            <li className="pb-2 border-b border-gray-100">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border border-gray-300 text-gray-700 rounded px-2 py-1 w-full focus:outline-none focus:border-green-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </li>
            {user ? (
              <>
                {userRole === 'Buyer' ? (
                  // Only show BuyersMarket for Buyers in mobile
                  <li>
                    <NavLink
                      to="/buyers-market"
                      className="block px-2 py-2 text-gray-700 hover:text-green-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('navbar.buyersMarket', 'Browse Crops')}
                    </NavLink>
                  </li>
                ) : (
                  // Show all links for other roles (e.g., Farmer) in mobile
                  <>
                    <li>
                      <NavLink
                        to="/crop-health"
                        className="block px-2 py-2 text-gray-700 hover:text-green-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navbar.cropHealth')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/marketplace"
                        className="block px-2 py-2 text-gray-700 hover:text-green-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navbar.marketplace')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/market-prices"
                        className="block px-2 py-2 text-gray-700 hover:text-green-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navbar.marketPrices')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/mental-health"
                        className="block px-2 py-2 text-gray-700 hover:text-green-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navbar.mentalHealth')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/community"
                        className="block px-2 py-2 text-gray-700 hover:text-green-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('navbar.community')}
                      </NavLink>
                    </li>
                  </>
                )}
                <li className="pt-2 border-t border-gray-100 mt-2">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-2 py-2 text-red-600 hover:text-red-700"
                  >
                    {t('navbar.signOut')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="flex flex-col space-y-2 pt-2">
                  <NavLink
                    to="/login"
                    className="block text-center text-green-700 border border-green-600 px-4 py-2 rounded-md hover:bg-green-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navbar.login')}
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navbar.register')}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;