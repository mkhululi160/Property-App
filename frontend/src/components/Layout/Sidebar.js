import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaSearch, FaHeart, FaCalendarAlt, FaPlus, FaUser, FaChartLine } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/properties', icon: FaSearch, label: 'Browse Properties' },
  ];

  if (userInfo) {
    menuItems.push(
      { path: '/saved-properties', icon: FaHeart, label: 'Saved Properties' },
      { path: '/my-bookings', icon: FaCalendarAlt, label: 'My Bookings' },
      { path: '/add-property', icon: FaPlus, label: 'List Property' },
      { path: '/profile', icon: FaUser, label: 'Profile' }
    );
  }

  if (userInfo?.isAdmin) {
    menuItems.push({ path: '/dashboard', icon: FaChartLine, label: 'Dashboard' });
  }

  return (
    <aside className="w-64 bg-white shadow-lg hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;