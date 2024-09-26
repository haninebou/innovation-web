import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../CSS/CircleSlider.css'; 
 
import book1 from '../images/image5.jpg';
import book2 from '../images/image4.jpg';
import book3 from '../images/image3.jpg';
import { Link } from 'react-router-dom';

const CircleSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className='circle-slider'>
      <Slider {...settings}>
        <div className="slide-item">
          <Link to="products">
            <div className="circle">
              <img className='slider-img' src={book1} alt=''/>
            </div>
          </Link>
        </div>
        <div className="slide-item">
          <Link to="products">
            <div className="circle">
              <img className='slider-img' src={book2} alt=''/>
            </div>
          </Link>
        </div>
        <div className="slide-item">
          <Link to="products">
            <div className="circle">
              <img className='slider-img' src={book3} alt=''/>
            </div>
          </Link>
        </div>
       
       
      </Slider>
    </div>
  );
}

export default CircleSlider;
