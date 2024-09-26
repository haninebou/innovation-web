import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/AdminNav.css';
import logo from '../images/logo2.png';

const AdminNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controls sidebar open/close state
  const sidebarRef = useRef(null); // Reference to the sidebar container

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClickOutsideSidebar = (event) => {
    if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSidebar);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSidebar);
    };
  }, [sidebarOpen]);

  return (
    <div className='admin-nav'>
      <div className="navbar-container">
        <button className="menu-button" onClick={toggleSidebar}>☰</button>
        <div className="navbar-logo">
          <Link to="/admin/dashboard">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
      </div>
      <div
        ref={sidebarRef}
        className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}
      >
        <Link className="sidebar-link" to="/admin/dashboard">Dashboard</Link>
        <Link className="sidebar-link" to="/admin/account">Account</Link>
        <Link className="sidebar-link" to="/admin/categories">Manage Categories</Link>
        <Link className="sidebar-link" to="/admin/products">Manage Products</Link>
        <Link className="sidebar-link" to="/logout">Logout</Link>
      </div>
    </div>
  );
};

export default AdminNav;
