import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../CSS/Login.css';
import login from '../images/login1.png';
import Navbar from './NavBar';
import Footer from './Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const passwordInputRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/auth/login', {
                email,
                password
            });
            console.log(response.data); 
            setLoginMessage("Login successful!");
            localStorage.setItem('userId', response.data.userId);
            navigate('/'); 
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setLoginMessage(error.response.data || "Login failed. Please try again.");
            } else if (error.request) {
                console.error('Error request:', error.request);
                setLoginMessage("No response from server. Please try again later.");
            } else {
                console.error('Error', error.message);
                setLoginMessage("Login failed. Please try again.");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login d-flex justify-content-center align-items-center">
                <div className="row w-100">
                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-image">
                        <img src={login} alt='' />
                    </div>
                    <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
                        <div className="login-container">
                            <h2 className='login-title mb-4'>Welcome Back!</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder=" " 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label className="login-label">
                                        <FontAwesomeIcon icon={faEnvelope} /> Email
                                    </label>
                                </div>
                                <div className="form-group position-relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-control" 
                                        placeholder=" " 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        ref={passwordInputRef}
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                    />
                                    <label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> Password
                                    </label>
                                    {isPasswordFocused && (
                                        <span 
                                            onMouseDown={togglePasswordVisibility} 
                                            className="password-toggle-icon"
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                </div>
                                <input type="submit" value="Login" className="btn btn-primary btn-block butt-class" />
                            </form>
                            {loginMessage && <p>{loginMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
