import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../CSS/MySlider.css';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const SimpleSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/products');  // Adjust the URL as needed
        const data = await response.json();
        // Optionally sort products if needed, for example by date added
        const sortedProducts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <div className='simple-slider mt-5 mb-5' data-aos="fade-up">
      <div className='my-slider'>
        <div className="slider-container">
          <Slider {...settings}>
            {products.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card my-card">
                  <Link to={`/product/${product.id}`}>
                    {product.images && product.images.length > 0 && (
                      <img 
                        src={`http://localhost:8081/${product.images[0]}`}  // Assuming images is an array
                        alt={product.name}
                        className="card-img-top my-img"
                      />
                    )}
                  </Link>
                  <div className="icon-pane">
                    <Link to='/cart' className="overlay-link">
                      <FontAwesomeIcon icon={faShoppingCart} className="cart-icon cart-left-icon" />
                    </Link>
                    <Link to='/wishlist' className="overlay-link">
                      <FontAwesomeIcon icon={faHeart} size="3x" className="cart-icon cart-right-icon" />
                    </Link>
                  </div>
                  <div className="position-icon">
                    <Badge bg="dark" className="card-text position-absolute bottom-0 end-0 p-2">
                      {product.price}DZ
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      <div className="text-center ">
        <Link to="/allproducts">
          <button className="see-more mt-1 ">Show More</button>
        </Link>
      </div>
    </div>
  );
};

export default SimpleSlider;
