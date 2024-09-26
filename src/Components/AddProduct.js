import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Collapse, Badge } from 'react-bootstrap';
import { FaTrash, FaEdit, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNav from './AdminNav';

const AddProduct = () => {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(0);
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [openDescriptionId, setOpenDescriptionId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

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
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditingProductId(null);
    setProductName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImages([]);
    setStock(0);
    setColors('');
    setSizes('');
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('categoryId', category);
    formData.append('stock', stock);
    formData.append('colors', colors);
    formData.append('sizes', sizes);

    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      let url = 'http://localhost:8081/addpro';
      let method = 'POST';

      if (editingProductId) {
        url = `http://localhost:8081/products/${editingProductId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        fetchProducts(); 
        handleClose();
      } else {
        console.error('Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product) => {
  setEditingProductId(product.id);
  setProductName(product.name);
  setPrice(product.price);
  setDescription(product.description);
  setCategory(product.category_id); 
  setImages([]); // Clear the images, or prefill with current images if desired
  setStock(product.stock); // Set stock for editing
  
  // Ensure that colors and sizes are defined and are arrays
  setColors(product.colors?.join(',') || ''); // Safely handle undefined or empty colors
  setSizes(product.sizes?.join(',') || '');   // Safely handle undefined or empty sizes

  setShow(true);
};


  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8081/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleDescription = (productId) => {
    setOpenDescriptionId(openDescriptionId === productId ? null : productId);
  };

  return (
    <>
      <AdminNav />
      <div className="container">
        <div className='d-flex justify-content-center'>
         <Button className='mt-5' variant="dark" onClick={handleShow}>
          Add New Product
        </Button>
        </div>
        

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingProductId ? 'Edit Product' : 'Add New Product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductPrice" className="mt-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductStock" className="mt-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductCategory" className="mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formProductColors" className="mt-3">
                <Form.Label>Colors (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product colors"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductSizes" className="mt-3">
                <Form.Label>Sizes (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product sizes"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formProductImages" className="mt-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                {editingProductId ? 'Update Product' : 'Add Product'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Table to display products */}
       <Table hover className="mt-5">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Description</th>
      <th>Category</th>
      <th>Colors</th>
      <th>Sizes</th>
      <th>Images</th>
    
    </tr>
  </thead>
  <tbody>
    {products.length > 0 && products.map((product) => (
      <tr key={product.id}>
        <td>{product.id}</td>
        <td>{product.name}</td>
        <td>{product.price}</td>
        <td>{product.stock > 0 ? product.stock : <Badge bg="danger">Out of Stock</Badge>}</td>
        <td>
          <Button
            variant="link"
            onClick={() => toggleDescription(product.id)}
            aria-controls={`description-collapse-${product.id}`}
            aria-expanded={openDescriptionId === product.id}
          >
            {openDescriptionId === product.id ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
          <Collapse in={openDescriptionId === product.id}>
            <div id={`description-collapse-${product.id}`}>
              {product.description}
            </div>
          </Collapse>
        </td>
        <td>{product.categoryName}</td>
        <td>
          {/* Ensure colors is an array and render it */}
          {product.colors?.length > 0 ? (
            product.colors.map((color, index) => (
              <span key={index} className="badge bg-secondary mr-1">{color}</span>
            ))
          ) : (
            <span>No colors</span>
          )}
        </td>
        <td>
          {/* Ensure sizes is an array and render it */}
          {product.sizes?.length > 0 ? (
            product.sizes.map((size, index) => (
              <span key={index} className="badge bg-primary mr-1">{size}</span>
            ))
          ) : (
            <span>No sizes</span>
          )}
        </td>
        <td>
          {product.images?.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:8081/${image}`}
              alt={product.name}
              style={{ width: '50px', height: '50px', marginRight: '5px' }}
            />
          ))}
        </td>
        <td>
          <Button variant="" className="text-success" onClick={() => handleEditProduct(product)}>
            <FaEdit />
          </Button>
          <Button variant="" className="text-danger" onClick={() => handleDeleteProduct(product.id)}>
            <FaTrash />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      </div>
    </>
  );
};

export default AddProduct;
