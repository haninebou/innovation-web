import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faPhone, faUser, faHome } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/Login.css';
import login from '../images/login1.png'; 
import Navbar from './NavBar';
import Footer from './Footer';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const [signUpMessage, setSignUpMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    const handlePasswordFocus = () => setIsPasswordFocused(true);
    const handlePasswordBlur = () => setIsPasswordFocused(false);
    const handleConfirmPasswordFocus = () => setIsConfirmPasswordFocused(true);
    const handleConfirmPasswordBlur = () => setIsConfirmPasswordFocused(false);

    const togglePasswordVisibility = (e, field) => {
        e.preventDefault();
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 5) {
            setSignUpMessage("Password must be at least 5 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setSignUpMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/auth/signup', {
                username,
                email,
                password,
                address,
                phone
            });
            console.log(response.data);
            setSignUpMessage("Sign up successful!");
            localStorage.setItem('userId', response.data.userId);
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setSignUpMessage(error.response.data || "Sign up failed. Please try again.");
            } else if (error.request) {
                console.error('Error request:', error.request);
                setSignUpMessage("No response from server. Please try again later.");
            } else {
                console.error('Error', error.message);
                setSignUpMessage("Sign up failed. Please try again.");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login d-flex justify-content-center align-items-center">
                <div className="row w-100">
                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-image">
                        <img src={login} alt="Login" className="login-image" />
                    </div>
                    <div className="col-md-6  align-items-center justify-content-center bg-light">
                        <div className="signup-container">
                            
                                <h1 className='login-title'>Welcome!</h1>
                                
                           
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faUser} /> Username
                                    </Form.Label>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="email"
                                        placeholder=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faEnvelope} /> Email
                                    </Form.Label>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faHome} /> Address
                                    </Form.Label>
                                </Form.Group>
                                 <Form.Group className="form-group">
                                    <Form.Control
                                        type="number"
                                        placeholder=""
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faPhone} /> Phone Number
                                    </Form.Label>
                                </Form.Group>

                                <Form.Group className="form-group position-relative">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        ref={passwordInputRef}
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> Password
                                    </Form.Label>
                                    {isPasswordFocused && (
                                        <span 
                                            onMouseDown={(e) => togglePasswordVisibility(e, 'password')} 
                                            className="password-toggle-icon"
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                    {password.length > 0 && password.length < 5 && (
                                        <Form.Text className="text-danger">
                                            Password must be at least 5 characters long.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="form-group position-relative">
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder=""
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        ref={confirmPasswordInputRef}
                                        onFocus={handleConfirmPasswordFocus}
                                        onBlur={handleConfirmPasswordBlur}
                                    />
                                    <Form.Label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> Confirm Password
                                    </Form.Label>
                                    {isConfirmPasswordFocused && (
                                        <span 
                                            onMouseDown={(e) => togglePasswordVisibility(e, 'confirmPassword')} 
                                            className="password-toggle-icon"
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                    {confirmPassword.length > 0 && password !== confirmPassword && (
                                        <Form.Text className="text-danger">
                                            Passwords do not match.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <div className='d-flex justify-content-center'>
                                    <input type="submit" value="Sign Up" className="btn btn-primary btn-block butt-class" />
                                </div>

                                <div className='text-center mt-1'>
                                    <Link to="/login" className='link'>
                                        <span className='mx-2'>Already have an account?</span>
                                    </Link>
                                </div>

                                {signUpMessage && <p className='text-center mt-3'>{signUpMessage}</p>}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUp;
