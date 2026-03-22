import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaUser, FaSignOutAlt, FaPlus, FaHeart, FaCalendarAlt, FaBars } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-primary text-2xl" />
            <span className="font-bold text-xl">PropertyApp</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/properties" className="hover:text-primary transition">Properties</Link>
            {userInfo && (
              <>
                <Link to="/my-bookings" className="hover:text-primary transition">Bookings</Link>
                <Link to="/saved-properties" className="hover:text-primary transition">Saved</Link>
                <Link to="/compare" className="hover:text-primary transition">Compare</Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <Link to="/add-property" className="hidden md:flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                  <FaPlus />
                  <span>List Property</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-1 hover:text-primary"
                  >
                    {userInfo.profileImage?.url ? (
                      <img src={userInfo.profileImage.url} alt={userInfo.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-500" />
                      </div>
                    )}
                    <span className="hidden md:inline">{userInfo.name.split(' ')[0]}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">
                        <FaCalendarAlt className="inline mr-2" /> Bookings
                      </Link>
                      <Link to="/saved-properties" className="block px-4 py-2 hover:bg-gray-100">
                        <FaHeart className="inline mr-2" /> Saved
                      </Link>
                      {userInfo.isAdmin && (
                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;