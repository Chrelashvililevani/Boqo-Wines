import React, { useEffect } from 'react';

const UseScrollEffect = () => {
  useEffect(() => {
    let lastScrollTop = 0;
    let isScrollingUp = false;
    const header = document.querySelector('.header');
    const suddenLogo = document.querySelector('.sudden-logo');
    const info = document.querySelector('.info');

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Check scroll direction
      const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';

      // Set isScrollingUp to true if scrolling direction is up
      isScrollingUp = scrollDirection === 'up';

      // Adjust the margin-top of the info div based on scroll direction
      if (isScrollingUp && scrollTop === 0) {
        setTimeout(() => {
          suddenLogo.style.display = 'flex'; // Show the sudden-logo
          suddenLogo.style.opacity = '1'; // Set opacity to 1
          header.style.marginBottom = '10px'; // Adjust this value to your requirement
        }, 500); // Adjust the delay time as needed
        suddenLogo.style.transition = 'opacity 0.5s ease'; // Set opacity transition
        info.style.transition = 'margin-top 0.5s ease'; // Set transition
        info.style.marginTop = '200px'; // Adjust this value to your header height
      } else {
        suddenLogo.style.opacity = '0'; // Set opacity to 0 to hide the sudden-logo
        suddenLogo.style.display = 'none'; // Hide the sudden-logo
        info.style.transition = 'margin-top 0.5s ease'; // Set transition
        info.style.marginTop = '0'; // Move info to the top
        header.style.marginBottom = '50px'; // Adjust this value to your requirement
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to run this effect only once

  return null; // Since this component doesn't render anything, return null
};

export default UseScrollEffect;

