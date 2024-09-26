import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import '../CSS/CommandeForm.css';
import Navbar from './NavBar';
import Footer from './Footer';

// Define delivery prices for different states
const deliveryPrices = {
  Adrar: 1000,
  Constantine: 200,
  Alger: 700,
  // Add other states and their delivery prices as necessary
};

function CommandeForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    state: 'Constantine',  // Default state
    postalCode: '',
  });

  const [deliveryMode, setDeliveryMode] = useState('stop-desk');
  const [deliveryPrice, setDeliveryPrice] = useState(deliveryPrices[formData.state]);  // Default delivery price
  const [subtotal, setSubtotal] = useState(0);  // Subtotal of products in the cart
  const [total, setTotal] = useState(0);        // Total cost (subtotal + delivery)
  const [products, setProducts] = useState([]); // Products in the cart

  // Fetch cart items from localStorage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setProducts(storedCartItems);
  }, []);

  // Calculate subtotal and total whenever products or delivery price changes
  useEffect(() => {
    const calculatedSubtotal = products.reduce((acc, product) => acc + parseInt(product.price) * product.quantity, 0);
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + deliveryPrice);
  }, [products, deliveryPrice]);

  // Update delivery price based on state and delivery mode
  useEffect(() => {
    const newDeliveryPrice = deliveryMode === 'stop-desk' ? deliveryPrices[formData.state] : deliveryPrices[formData.state] + 200;
    setDeliveryPrice(newDeliveryPrice);
    setTotal(subtotal + newDeliveryPrice);
  }, [formData.state, deliveryMode, subtotal]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle delivery mode change (e.g., 'stop-desk' or 'Adomicile')
  const handleDeliveryModeChange = (e) => {
    setDeliveryMode(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
  fullName: formData.fullName,
  email: formData.email,
  address: formData.address,
  phoneNumber: formData.phoneNumber,
  state: formData.state,
  postalCode: formData.postalCode,
  deliveryMode,
  deliveryPrice,
  subtotal,
  total,
  products: products.map(product => ({
    product_id: product.product_id,
    quantity: product.quantity,
    price: product.price,
    color: product.color,    // Added color
    size: product.size,      // Added size
  })),
};


    try {
      const response = await fetch('http://localhost:8081/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        // Clear form and cart after successful order
        setFormData({
          fullName: '',
          email: '',
          address: '',
          phoneNumber: '',
          state: 'Constantine',
          postalCode: '',
        });
        localStorage.removeItem('cartItems');
        setProducts([]);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className='container CommandeForm mb-5'>
        <div className='row mt-4'>
          <div className='col formulaire-de-commande'>
            <Form onSubmit={handleSubmit} className='com-form'>
              <div className='row'>
                <Form.Group as={Col} controlId="fullName">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <Form.Group className='mt-4' controlId="address">
                <Form.Control
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className='row mt-4'>
                <Form.Group as={Col} controlId="postalCode">
                  <Form.Control
                    type="number"
                    placeholder="Postal Code"
                    name="postalCode"
                    value={formData.postalCode || ''}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="state">
                  <Form.Control
                    as="select"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    required
                  >
                    {Object.keys(deliveryPrices).map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>

              <Form.Group className='mt-4 mb-5' controlId="phoneNumber">
                <Form.Control
                  type="tel"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className='delivery'>
                <Form.Group className="mt-4" controlId="deliveryMode">
                  <Form.Label>Delivery Mode</Form.Label>
                  <Form.Control
                    as="select"
                    value={deliveryMode}
                    onChange={handleDeliveryModeChange}
                  >
                    <option value="stop-desk">Stop Desk Yalidine</option>
                    <option value="Adomicile">Adomicile</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-4" controlId="deliveryPrice">
                  <Form.Label>Delivery Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${deliveryPrice} DA`}
                    readOnly
                  />
                </Form.Group>
              </div>

              <Button className='mt-4 my-buttons-products mt-5 com-button d-flex justify-content-center' variant="light" type="submit">
                Confirm Order
              </Button>
              
            </Form>
          </div>

          <div className='col facture'>
            <div className='pro-com'>
  {products.map((product, index) => (
    <div key={index} className="d-flex cart-div-md-com">
      <img src={`http://localhost:8081/${product.image}`} className="pro-img mt-2" alt={product.name} />
      <div className="col text-start">
        <div className="row">
          <h6 id='purpleColor' className=" mt-2 ">{product.name},{product.color},{product.size}</h6>
        </div>
        <div className="row">
          <h6 id='purpleColor' className=" mt-2">{product.price} DA</h6>
        </div>
       
      </div>
      <h5 id='purpleColor' className=' mt-4 mx-5'>{product.quantity}</h5>
    </div>
  ))}
</div>


            <div className='fact-button mt-5'>
              <div className='mt-5 fact text-center'>
                <h6>Subtotal: {subtotal} DA</h6>
                <h6>Delivery Price: {deliveryPrice} DA</h6>
                <h3>Total: {total} DA</h3>
              </div>
            </div>
          </div>
          <Button className='mt-4 my-buttons-products mt-5 com-button-sm d-flex justify-content-center' variant="light" type="submit">
                Confirm Order
              </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CommandeForm;
