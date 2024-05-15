import React from 'react';
import { useNavigate } from 'react-router-dom';

const Enter = ({ onConfirm }) => {
  const navigate = useNavigate();

  const handleYes = () => {
    // Redirect to the main page
    navigate('/');
    // Call the onConfirm callback to update the state in Main.js
    onConfirm();
  };


  return (
    <div className="enter-container">
      <div className='enter-zero'></div>
      <div className='entrance'>
        <div className='entrance-one'>
        <div className='entrance-zero'>
          <button className='button-yes' onClick={handleYes}>Enter</button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Enter;
