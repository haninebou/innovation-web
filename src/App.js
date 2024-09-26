import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Profile from './Components/Profile';
import SignUp from './Components/SignUp';
import Navbar from './Components/NavBar';
import Home from './Components/Home';
import SingleProduct from './Components/SingleProduct';
import Products from './Components/Products';
import ContactUs from './Components/ContactUs';
import CommandeForm from './Components/CommandeForm';
import Cart from './Components/Cart';
import AdminNav from './Components/AdminNav';
import Categories from './Components/Categories';
import AddProduct from './Components/AddProduct';
import AllProducts from './Components/AllProducts';
import Orders from './Components/Orders';
import NotAuthorized from './Components/NotAuthorized';
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CommandeForm />} />
        
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute element={<AdminNav />} />} 
        />
        
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/addpro" element={<AddProduct />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/allproducts" element={<AllProducts />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
