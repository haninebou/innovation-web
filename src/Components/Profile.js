import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Profile.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEdit, faSave, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import Navbar from './NavBar';
import Footer from './Footer';
import login from '../images/login1.png';

const Profile = () => {
    const [userData, setUserData] = useState({ username: '', email: '', address: '', phone: '' });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [editMode, setEditMode] = useState({ email: false, address: false, phone: false });
    const [newEmail, setNewEmail] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState({ old: false, new: false, confirm: false });
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/auth/profile/${userId}`);
                setUserData(response.data);
                setNewEmail(response.data.email);
                setNewAddress(response.data.address);
                setNewPhone(response.data.phone);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setPasswordMessage("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8081/auth/change-password`, {
                userId,
                oldPassword,
                newPassword
            });

            setPasswordMessage(response.data);
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordMessage("Error changing password");
        }
    };

    const handleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleSave = async (field) => {
        const updatedData = field === 'email' ? { email: newEmail } : field === 'address' ? { address: newAddress } : { phone: newPhone };

        try {
            await axios.put(`http://localhost:8081/auth/update-profile/${userId}`, updatedData);
            setUserData((prev) => ({ ...prev, ...updatedData }));
            setEditMode((prev) => ({ ...prev, [field]: false }));
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const togglePasswordVisibility = (e, field) => {
        e.preventDefault();
        if (field === 'oldPassword') {
            setShowOldPassword(!showOldPassword);
        } else if (field === 'newPassword') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handlePasswordFocus = (field) => {
        setIsPasswordFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handlePasswordBlur = (field) => {
        setIsPasswordFocused((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div>
            <Navbar />
            <div className="login d-flex justify-content-center align-items-center">
                <div className="row w-100">
                    <div className="col-md-12 d-none d-md-flex align-items-center justify-content-center bg-light">
                        <div className="login-container mx-5">
                            
                            <h2 className='login-title  mb-5'>Hello, {userData.username}</h2>
                            <div className="profile-info">
                                <p>
                                    <strong>Email:</strong>
                                    {editMode.email ? (
                                        <>
                                            <input 
                                                type="email" 
                                                value={newEmail} 
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                            <FontAwesomeIcon 
                                                icon={faSave} 
                                                onClick={() => handleSave('email')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}} 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {userData.email}
                                            <FontAwesomeIcon 
                                                icon={faEdit} 
                                                onClick={() => handleEdit('email')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}}   
                                            />
                                        </>
                                    )}
                                </p>
                                <p>
                                    <strong>Address:</strong>
                                    {editMode.address ? (
                                        <>
                                            <input 
                                                type="text" 
                                                value={newAddress} 
                                                onChange={(e) => setNewAddress(e.target.value)}
                                            />
                                            <FontAwesomeIcon 
                                                icon={faSave} 
                                                onClick={() => handleSave('address')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}} 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {userData.address}
                                            <FontAwesomeIcon 
                                                icon={faEdit} 
                                                onClick={() => handleEdit('address')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}}
                                            />
                                        </>
                                    )}
                                </p>
                                <p>
                                    <strong>Phone:</strong>
                                    {editMode.phone ? (
                                        <>
                                            <input 
                                                type="text" 
                                                value={newPhone} 
                                                onChange={(e) => setNewPhone(e.target.value)}
                                            />
                                            <FontAwesomeIcon 
                                                icon={faSave} 
                                                onClick={() => handleSave('phone')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}} 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {userData.phone}
                                            <FontAwesomeIcon 
                                                icon={faEdit} 
                                                onClick={() => handleEdit('phone')}
                                                className="edit-icon mx-1"
                                                style={{cursor:"pointer"}}
                                            />
                                        </>
                                    )}
                                </p>
                            </div>
                            
                        </div>
                        <div className='login-container mx-5'>
                            <h2 className='login-title mt-2'>Change Password</h2>
                            <form onSubmit={handleChangePassword}>
                                <div className="form-group position-relative">
                                    <input 
                                        type={showOldPassword ? "text" : "password"} 
                                        className="form-control" 
                                        placeholder=" " 
                                        required 
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        onFocus={() => handlePasswordFocus('old')}
                                        onBlur={() => handlePasswordBlur('old')}
                                    />
                                    <label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> Old Password
                                    </label>
                                    {isPasswordFocused.old && (
                                        <span 
                                            onMouseDown={(e) => togglePasswordVisibility(e, 'oldPassword')} 
                                            className="password-toggle-icon"
                                            style={{cursor:"pointer"}}
                                        >
                                            <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                </div>
                                <div className="form-group position-relative">
                                    <input 
                                        type={showNewPassword ? "text" : "password"} 
                                        className="form-control" 
                                        placeholder=" " 
                                        required 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onFocus={() => handlePasswordFocus('new')}
                                        onBlur={() => handlePasswordBlur('new')}
                                    />
                                    <label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> New Password
                                    </label>
                                    {isPasswordFocused.new && (
                                        <span 
                                            onMouseDown={(e) => togglePasswordVisibility(e, 'newPassword')} 
                                            className="password-toggle-icon"
                                            style={{cursor:"pointer"}}
                                        >
                                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                </div>
                                <div className="form-group position-relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        className="form-control" 
                                        placeholder=" " 
                                        required 
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        onFocus={() => handlePasswordFocus('confirm')}
                                        onBlur={() => handlePasswordBlur('confirm')}
                                    />
                                    <label className="login-label">
                                        <FontAwesomeIcon icon={faLock} /> Confirm Password
                                    </label>
                                    {isPasswordFocused.confirm && (
                                        <span 
                                            onMouseDown={(e) => togglePasswordVisibility(e, 'confirmPassword')} 
                                            className="password-toggle-icon"
                                            style={{cursor:"pointer"}}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </span>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary btn-block butt-class">Change Password</button>
                            </form>
                            {passwordMessage && <p>{passwordMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
