import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './NavBar';
import '../CSS/Home.css';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import image from '../images/image32.jpg';
import image1 from '../images/image32.jpg';
import image3 from '../images/image33.jpg';
import image4 from '../images/image30.jpg';
import image5 from '../images/image34.jpg';
import Badge from 'react-bootstrap/Badge';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 2000 });

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8081/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/products');
        const data = await response.json();
        const sortedProducts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Check if the screen is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if screen width is less than 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    fetchCategories();
    fetchProducts();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to group products into chunks of 4 for non-mobile
  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const productChunks = chunkArray(products, 4); // 4 products per slide for desktop

  return (
    <>
      <Navbar />
      <div className="home">
        <div className="home-image-container-desktop" data-aos="zoom-in">
          <img src={image} alt="home" className="home-image" />
          <Link to="/allproducts">
            <button className="see-more-button" data-aos="zoom-in">Discover Our Products</button>
          </Link>
        </div>
        <div className="home-image-container-phone" data-aos="zoom-in">
          <img src={image1} alt="home" className="home-image1" />
          <Link to="/allproducts">
            <button className="see-more-button1" data-aos="zoom-in">Discover Our Products</button>
          </Link>
        </div>

        <div className='home-phone container mt-5'>
          <div className="line-container-1" data-aos="zoom-in">
            <hr className="line-1" />
            <h2 className=" line-heading-1">Categories</h2>
            <hr className="line-1" />
          </div>
          <div className='categories' data-aos="fade-up">
            <Carousel>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <Carousel.Item key={index}>
                    <Link to={`/products/${category.id}`} className="carousel-item-link">
                      <div className="carousel-item-container">
                        <div className="carousel-item-images">
                          {JSON.parse(category.photos).map((photo, idx) => (
                            <img key={idx} src={`http://localhost:8081/${photo}`} alt='Category' className='cat-image' />
                          ))}
                        </div>
                      </div>
                      <Carousel.Caption>
                        <span className="category-name">{category.name}</span>
                      </Carousel.Caption>
                    </Link>
                  </Carousel.Item>
                ))
              ) : (
                <p>No categories available</p>
              )}
            </Carousel>
          </div>

          <div className='mt-5'>
            <div className="line-container-1 " data-aos="zoom-in">
              <hr className="line-1" />
              <h2 className=" line-heading-1"> Products</h2>
              <hr className="line-1" />
            </div>
          </div>

          {/* Product Carousel */}
          <div className='products-carousel' data-aos="fade-up">
  <Carousel>
    {isMobile ? (
      // Render one product per slide on mobile
      products.map((product, index) => (
        <Carousel.Item key={index}>
          <div className="d-flex justify-content-center">
            <div className="col-md-12 mb-5">
              <div className="card my-card">
                <Link to={`/product/${product.id}`}>
                  {product.images && product.images.length > 0 && (
                    <img 
                      src={`http://localhost:8081/${product.images[0]}`} 
                      alt={product.name}
                      className="card-img-top my-img"
                    />
                  )}
                </Link>
                <div className="position-icon">
                  <Badge bg="dark" className="card-text position-absolute bottom-0 end-0 p-2">
                    {product.price}DZ
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))
    ) : (
      // Render multiple products per slide for larger screens
      productChunks.map((chunk, index) => (
        <Carousel.Item key={index}>
         
            <div className="row">
              {chunk.map((product) => (
                <div key={product.id} className="col-md-3 mb-5">
                  <div className="card my-card">
                    <Link to={`/product/${product.id}`}>
                      {product.images && product.images.length > 0 && (
                        <img 
                          src={`http://localhost:8081/${product.images[0]}`} 
                          alt={product.name}
                          className="card-img-top my-img"
                        />
                      )}
                    </Link>
                    <div className="position-icon">
                      <Badge bg="dark" className="card-text position-absolute bottom-0 end-0 p-2">
                        {product.price}DZ
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
           
          </div>
        </Carousel.Item>
      ))
    )}
  </Carousel>
</div>

        </div>

        <div className="about-us mb-5 " data-aos="fade-up">
          <div className="container about-us-container">
            <div className='mt-5'>
              <div className="line-container-1 " data-aos="zoom-in">
                <hr className="line-1" />
                <h2 className=" line-heading-1"> About Us</h2>
                <hr className="line-1" />
              </div>
            </div>
            <div className="about-us-content">
              <div className="about-us-text" data-aos="fade-right">
                <p>
                  Welcome to Our Store! Our mission is to provide high-quality, trendy, and timeless products
                  that suit your needs. We believe in delivering excellence through quality products and outstanding
                  customer service. We strive to make your shopping experience enjoyable and seamless.
                </p>
                <p>
                  Whether you're looking for the latest styles or functional essentials, we have something for everyone.
                  Your satisfaction is our priority!
                </p>
              </div>

              <div className="about-us-carousels">
                <Carousel className="about-carousel">
                  <Carousel.Item>
                    <img src={image5} alt="Our Store" className="about-carousel-image" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={image3} alt="Our Team" className="about-carousel-image" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={image4} alt="Our Store" className="about-carousel-image" />
                  </Carousel.Item>
                </Carousel>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Home;
