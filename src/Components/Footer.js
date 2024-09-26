import React from 'react';
import '../CSS/Footer.css';

const Footer = () => {
  return (
    <footer className="footer wd-100 ">
      
      <nav>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
        </ul>
     </nav>
          <p>&copy; 2024 InnovWebsite . All rights reserved.</p>
    </footer>
  );
};

export default Footer;
