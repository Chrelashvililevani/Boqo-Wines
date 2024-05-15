import React, { useState, useEffect } from 'react'; // Import useState and useEffect from react
import './style.css'; // Import your CSS file
import UseScrollEffect from './UseScrollEffect';

const SuddenLogo = () => {
    const isScrollingUp = UseScrollEffect();  
  return (
    <div className="sudden-logo">
      <div className="sudden-logo-logo">
        <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" style={{ height: '100%', padding: '0px', margin: '0px' }} />
      </div>
    </div>
  );
};


export default SuddenLogo;
