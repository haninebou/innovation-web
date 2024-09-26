import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Navbar from './NavBar';
import Footer from './Footer';
import '../CSS/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemoveFromCart = (productId, color, size) => {
    const updatedCartItems = cartItems.filter(item => 
      !(item.product_id === productId && item.color === color && item.size === size)
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleUpdateQuantity = (productId, color, size, quantity) => {
    const updatedCartItems = cartItems.map(item =>
      item.product_id === productId && item.color === color && item.size === size
        ? { ...item, quantity: quantity }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  return (
    <>
      <Navbar />
      <div className="cart-page-container">
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          <div className="pro-com mt-2">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={`http://localhost:8081/${item.image}`} alt={item.name} className="pro-img" />
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name} - {item.color}, {item.size}</span>
                  <span className="cart-item-price">{item.price.toFixed(2)} DZ</span>
                </div>
                <div className="cart-item-actions">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="remove-item-icon"
                    onClick={() => handleRemoveFromCart(item.product_id, item.color, item.size)}
                  />
                  <div className="cart-item-quantity">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleUpdateQuantity(item.product_id, item.color, item.size, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}

        <div className="d-flex justify-content-center mt-4">
          <Link to="/checkout" className="confirm-order-button">Place Order</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
