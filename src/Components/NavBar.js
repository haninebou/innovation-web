import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faSearch, faTimes, faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo2.png';
import '../CSS/NavBar.css';
import Cart from './Cart'; // Import the Cart component

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Initialized as an empty array
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch('http://localhost:8081/categories');
        const productResponse = await fetch('http://localhost:8081/products');
        const categoriesData = await categoryResponse.json();
        const productsData = await productResponse.json();

        // Ensure the data is an array to prevent runtime errors
        setCategories(Array.isArray(categoriesData) ? categoriesData : []); 
        setProducts(Array.isArray(productsData) ? productsData : []); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
      const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(query)
      );
      setSearchResults([...filteredProducts, ...filteredCategories]);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    if (result.price !== undefined) {
      navigate(`/product/${result.id}`);
    } else {
      navigate(`/products/${result.id}`);
    }
    setSearchResults([]);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleClickOutsideSidebar = (event) => {
    if (isSidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.menu-icon')) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideSidebar);
    return () => {
      document.removeEventListener('click', handleClickOutsideSidebar);
    };
  }, [isSidebarOpen]);

  const handleCategoryClick = (category) => {
    navigate(`/products/${category.id}`);
    setIsSidebarOpen(false); // Close the sidebar
  };

  return (
    <div className='nav-bar wd-100 container '>
      <nav className="navbar">
        <FontAwesomeIcon icon={faBars} className="menu-icon" onClick={toggleSidebar} />
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Nussa Logo" />
          </Link>
        </div>
        <div className="navbar-icons">
          <FontAwesomeIcon icon={faSearch} className='navbar-icon' onClick={toggleSearch} />
          {isAuthenticated ? (
            <Link to="/profile"><FontAwesomeIcon icon={faUser} className='navbar-icon nav-phone' /></Link>
          ) : (
            <Link to="/signup"><FontAwesomeIcon icon={faUser} className='navbar-icon  nav-phone' /></Link>
          )}
          <Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} className='navbar-icon  ' /></Link>
        </div>
      </nav>
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={toggleSearch} />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((result, index) => (
                  <li key={index} onClick={() => handleResultClick(result)}>
                    {result.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <ul>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(category => (
              <li key={category.id}>
                <button
                  className="category-button"
                  onClick={() => handleCategoryClick(category)}
                >
                  <img 
                    src={category.photos && JSON.parse(category.photos).length > 0 ? `http://localhost:8081/${JSON.parse(category.photos)[0]}` : logo} 
                    alt={category.name} 
                    className="category-image" 
                  />
                  <span className="category-name">{category.name}</span>
                </button>
              </li>
            ))
          ) : (
            <li>No categories available</li>
          )}
          {isAuthenticated && (
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
