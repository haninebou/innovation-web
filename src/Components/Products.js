import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-bootstrap/Carousel';
import Badge from 'react-bootstrap/Badge';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './NavBar';
import Footer from './Footer';
import '../CSS/Products.css';

const Products = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Fetch categories (same as in Home.js)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8081/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products by category or all products if no category is selected
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = categoryId
          ? `http://localhost:8081/products?category=${categoryId}`
          : `http://localhost:8081/products`;
        const response = await fetch(url);
        const data = await response.json();

        // Sort products by created_at in descending order
        const sortedProducts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const min = minPrice === '' ? 0 : parseInt(minPrice, 10);
    const max = maxPrice === '' ? Infinity : parseInt(maxPrice, 10);
    return product.price >= min && product.price <= max;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar />
      <div className='products-page container mb-5' data-aos="zoom-in">
        {/* Categories Carousel */}

        <div className='d-flex mt-5 mb-5' data-aos="fade-up">
          <div className='categories col-12'>
            <Carousel>
              {categories.map((category, index) => (
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
              ))}
            </Carousel>
          </div>
        </div>
        {/* Price Range Filter */}
        <div className='price-range mt-5'>
          <div className="price-filter d-flex mt-5" data-aos="zoom-in">
            <div className="filter-container mx-2">
              <div className="form-group">
                <input
                  type="number"
                  min={1}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder=" "
                  required
                />
                <label>Min Price</label>
              </div>
            </div>
            <div className="filter-container mx-2">
              <div className="form-group">
                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder=" "
                  required
                />
                <label>Max Price</label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row row-cols-2 row-cols-md-3 g-0  mt-5 text-center" data-aos="fade-up">
          {currentProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card my-card">
                <Link to={`/product/${product.id}`}>
                  {product.images && product.images.length > 0 && (
                    <img
                      src={`http://localhost:8081/${product.images[0]}`}  // Assuming images is an array
                      alt={product.name}
                      className="car-img my-img"
                    />
                  )}
                </Link>
             {/* <div className="icon-pane">
                  <Link to='/cart' className="overlay-link">
                    <FontAwesomeIcon icon={faShoppingCart} className="cart-icon cart-left-icon" />
                  </Link>
                  <Link to='/wishlist' className="overlay-link">
                    <FontAwesomeIcon icon={faHeart} size="3x" className="cart-icon cart-right-icon" />
                  </Link>
                </div>*/}   
                <div className="position-icon">
                  <Badge bg="dark" className="card-text position-absolute bottom-0 end-0 p-2">
                    {product.price}DZ
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination mt-4 d-flex justify-content-center">
          <ul className="pagination justify-content-center custom-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
