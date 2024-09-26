import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form, Row, Col } from 'react-bootstrap';
import '../CSS/Categories.css';
import AdminNav from './AdminNav';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', photos: ['', '', '', ''] });
    const [error, setError] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8081/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setCategories(data);
            } else {
                const errorText = await response.text();
                throw new Error('Server returned non-JSON response');
            }
        } catch (error) {
            setError('Failed to fetch categories');
        }
    };

    const handleAddCategory = () => {
        setEditingCategoryId(null); // Clear editing state
        setNewCategory({ name: '', photos: ['', '', '', ''] });
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setNewCategory({
            name: category.name,
            photos: category.photos || ['', '', '', '']
        });
        setEditingCategoryId(category.id);
        setShowModal(true);
    };

    const handleSaveCategory = async () => {
        const formData = new FormData();
        formData.append('name', newCategory.name);
        newCategory.photos.forEach((photo) => {
            if (photo) {
                formData.append('photos', photo);
            }
        });

        try {
            let url = 'http://localhost:8081/categories';
            let method = 'POST';
            
            if (editingCategoryId) {
                url = `http://localhost:8081/categories/${editingCategoryId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setShowModal(false);
            setEditingCategoryId(null); // Reset editing state
            fetchCategories(); // Refresh categories list after saving
        } catch (error) {
            setError('Failed to save category');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`http://localhost:8081/categories/${categoryId}`, { method: 'DELETE' });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                fetchCategories(); // Refresh categories list after deletion
            } catch (error) {
                setError('Failed to delete category');
            }
        }
    };

    const handlePhotoChange = (index, file) => {
        const updatedPhotos = [...newCategory.photos];
        updatedPhotos[index] = file;
        setNewCategory({ ...newCategory, photos: updatedPhotos });
    };

    return (
        <>
            <AdminNav />
            <div className="container text-center my-4 mt-5">
                
                {error && <div className="alert alert-danger">{error}</div>}
                <Button variant="primary" onClick={handleAddCategory} className="mb-4">Add New Category</Button>

                <Row className="justify-content-center mt-5">
                    {categories.map(category => (
                        <Col md={4} lg={3} className="mb-4" key={category.id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{category.name}</Card.Title>
                                    <div className='mt-3'>
                                    <Button variant="danger" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                                    <Button variant="secondary" className="ml-2 mx-2" onClick={() => handleEditCategory(category)}>Edit</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCategoryName">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter category name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCategoryPhotos" className="mt-3">
                                <Form.Label>Category Photos</Form.Label>
                                {[0, 1, 2, 3].map(index => (
                                    <Form.Control
                                        key={index}
                                        type="file"
                                        className="mt-2"
                                        onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveCategory}>
                            {editingCategoryId ? 'Update Category' : 'Save Category'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Categories;
