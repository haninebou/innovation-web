import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/SingleProduct.css';
import '../CSS/Aide.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';

import Navbar from './NavBar';
import Footer from './Footer';
import StarRate from './StarRate';

const SingleProduct = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // New states for color and size
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProductDetails(data);
        setSelectedPhoto(data.images[0]);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        if (!productDetails) return;
        const response = await fetch(`http://localhost:8081/products?category=${productDetails.category_id}`);
        const data = await response.json();
        const filteredProducts = data.filter(product => product.id !== parseInt(id));
        setSimilarProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };
    fetchSimilarProducts();
  }, [productDetails, id]);

  useEffect(() => {
    const fetchProductComments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/products/${id}/comments`);
        if (!response.ok) {
          throw new Error('Error fetching comments');
        }
        const data = await response.json();
        setComments(data.comments); // Set the comments state
        setAverageRating(data.averageRating); // Set the average rating based on comments
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchProductComments();
  }, [id]);

  const handlePhotoClick = (photo) => setSelectedPhoto(photo);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both a color and a size.');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.product_id === productDetails.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.color = selectedColor;
      existingItem.size = selectedSize;
    } else {
      cartItems.push({
        product_id: productDetails.id,
        name: productDetails.name,
        price: productDetails.price,
        quantity: quantity,
        image: productDetails.images[0],
        color: selectedColor,
        size: selectedSize,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setSuccessMessage('Item added to cart successfully!');
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const commentText = event.target.elements.Comment.value;
    const newComment = {
      productId: id,
      userName: 'Anonymous',
      comment: commentText,
      rating: rating,
    };

    try {
      const response = await fetch(`http://localhost:8081/products/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      // Refetch comments after successful submission
      const fetchProductComments = async () => {
        try {
          const response = await fetch(`http://localhost:8081/products/${id}/comments`);
          if (!response.ok) {
            throw new Error('Error fetching comments');
          }
          const data = await response.json();
          setComments(data.comments); // Update the comments state
          setAverageRating(data.averageRating); // Update the average rating
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
      await fetchProductComments(); // Refetch comments

      setRating(0);
      setShow1(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            color={index < Math.round(rating) ? "black" : "grey"}
          />
        ))}
      </div>
    );
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container single-product">
        <div className="row">
          <div className='name-price'>
              <h2 className='productName' id='purpleColor'>{productDetails.name}</h2>
              <h5 id='purpleColor'>Price: {productDetails.price}DZ</h5>
              <h5 id='purpleColor'>{renderStars(averageRating)}</h5>
            </div>
          <div className="col-md-5 align-items-center order-md-2">
            <img className="img-fluid mainProductPhoto" src={`http://localhost:8081/${selectedPhoto}`} alt="Product" />
          </div>
          <div className="col-md-2 order-md-1">
            <div className="row productPhotos">
              {productDetails.images.map((photo, index) => (
                <img
                  className="img-thumbnail m-2 Sidephoto"
                  key={index}
                  src={`http://localhost:8081/${photo}`}
                  alt={`Product ${index + 1}`}
                  onClick={() => handlePhotoClick(photo)}
                />
              ))}
            </div>
          </div>
          <div className="col-md-5 order-md-3">
            <div className='price-name'>
              <h2 className='productName' id='purpleColor'>{productDetails.name}</h2>
              <h5 id='purpleColor'>Price: {productDetails.price}DZ</h5>
              <h5 id='purpleColor'>{renderStars(averageRating)}</h5>
            </div>
             

            {/* Color and Size selectors */}
            <div className="mt-3">
              {/* Color Selector */}
              <label id='purpleColor' htmlFor="color"><strong>Colors:</strong></label>
              <select 
                id="color" 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)} 
                className="form-select mb-3 mt-2"
              >
                <option value="">Select Color</option>
                {Array.isArray(productDetails.colors) ? productDetails.colors.map((color, index) => (
                  <option key={index} value={color}>{color}</option>
                )) : <option value="">No Colors Available</option>}
              </select>

              {/* Size Selector */}
              <label id='purpleColor' htmlFor="size"><strong>Sizes:</strong></label>
              <select 
                id="size" 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)} 
                className="form-select mb-3 mt-2"
              >
                <option value="">Select Size</option>
                {Array.isArray(productDetails.sizes) ? productDetails.sizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                )) : <option value="">No Sizes Available</option>}
              </select>
            </div>

            <div>
              <label id='purpleColor' className='mt-3' htmlFor="quantity"><strong>Quantity:</strong></label>
              <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} className="mb-3 mt-2 quantity" min="1" />
            </div>
            <div>
              <p><strong id='purpleColor'>Description:</strong> {productDetails.description}</p>
            </div>
            <div className='d-flex mt-5'>
              <button className="btn addButton" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <FontAwesomeIcon className='wishIcon' icon={faComment} onClick={handleShow1} data-bs-toggle="tooltip" title="ADD A COMMENT" />
            </div>

            {/* Cart Modal */}
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>{successMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" as={Link} to="/cart">
                  View Cart
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={show1} onHide={handleClose1} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title id='purpleColor'>ADD YOUR COMMENT!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5 id='purpleColor' className='text-center mt-3 mb-4'>
                  <StarRate rating={rating} setRating={setRating} />
                </h5>
                <Form onSubmit={handleCommentSubmit}>
                  <Form.Control as="textarea" rows={4} name="Comment" style={{ backgroundColor: 'transparent', borderRadius: '0', boxShadow: 'none', width: '100%' }} />
                  <div className='d-flex justify-content-center mt-5 mb-2'>
                    <Button variant="light" type="submit" className='my-buttons-products mt-3'>Send</Button>
                    <Button variant="light" className='addButton mx-2 mt-3' onClick={handleClose1}>Cancel</Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>

        {/* Comments Section */}
        <div className='row mb-5 mt-5'>
          <div className="container mt-3 proacc">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Comments</Accordion.Header>
                <Accordion.Body>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index}>
                        <p>{comment.comment}</p>
                        {renderStars(comment.rating)}
                        <hr />
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        {/* Similar Products */}
        <div className="container mt-5 mb-5 text-center">
          <div className="line-container">
            <hr className="line" />
            <h1 className="purpleColor line-heading">Interesting</h1>
            <hr className="line" />
          </div>
          <div className="row row-cols-2 row-cols-md-3 g-0  mt-5 text-center ">
            {similarProducts.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card my-card">
                  <Link to={`/product/${product.id}`}>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={`http://localhost:8081/${product.images[0]}`}
                        alt={product.name}
                        className="car-img my-img"
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;
