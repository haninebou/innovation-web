import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../CSS/ContactUs.css';
import Navbar from './NavBar';
import Footer from './Footer';
import login from '../images/login1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope,faUser} from '@fortawesome/free-solid-svg-icons'; 




 const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_gwljpyb', 'template_pdyiemd', form.current, {
        publicKey: 'JK9Su-KSLQw0X1xH8',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          form.current.reset(); 
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <>
      <Navbar />
      <div className='d-flex justify-content-center'>
      <div className="contact">
        <img className='mx-5' src={login} />
      <form ref={form} onSubmit={sendEmail}>
        <h2 className='mb-4  con-title'>Contact Us</h2>
        <div className="form-group">
          <input type="text" name="user_name" placeholder=" " required />
          <label className="login-label">
               <FontAwesomeIcon icon={faUser} /> Name
           </label>
        </div>
        <div className="form-group">
          <input type="email" name="user_email" placeholder=" " required />
          <label className="login-label">
               <FontAwesomeIcon icon={faEnvelope} /> Email
           </label>
        </div>
        <div className="form-group">
          <textarea name="message" placeholder=" " required />
          <label className="login-label">
               <FontAwesomeIcon icon={faEnvelope} /> Message
           </label>
        </div>
        <input type="submit" value="Send" />
      </form>
        </div>
        </div>
      <Footer />
      </>
  );
};
export default ContactUs;