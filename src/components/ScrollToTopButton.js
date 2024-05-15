import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Import FontAwesome arrow icon


const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Adding an empty dependency array to ensure the effect runs only once on mount

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
        <FaArrowUp />   
    </button>
  );
};

export default ScrollToTopButton;
