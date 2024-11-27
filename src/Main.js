import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Tours from './components/Tours';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Enter from './components/Enter';
import ScrollToTopButton from './components/ScrollToTopButton';
import ViewNews from './components/ViewNews';
import WinesPage from './components/WinesPage';
import WineDetailPage from './components/WineDetailPage';
import './components/style.css';
import CheckoutPage from './components/CheckoutPage';
import Layout from './components/layout';
import BoughtWinesPage from './components/BoughtWinesPage';
import Home from './components/Home'; // Added import statement for Home component





const Main = () => {
  const [enterConfirmed, setEnterConfirmed] = useState(false);


  const handleEnterConfirmed = () => {
    setEnterConfirmed(true);
  };

  const [isLogin, setIsLogin] = useState(true); // Track whether the user is in login or registration mode
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track authentication status




  return (
    <Router>
      <>
        {!enterConfirmed && <Enter onConfirm={handleEnterConfirmed} />}
        {enterConfirmed && (
          <>
            <Navigation />
            <Layout />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/WinesPage" element={<WinesPage />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/Tours" element={<Tours />} />
              <Route
                path="/news/:id"
                element={<ViewNews />}
              />
              <Route path="/Wines/:wineId" element={<WineDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/my-wines" element={<BoughtWinesPage />} />
            </Routes>
            <ScrollToTopButton />
            <Footer />
          </>
        )}
      </>
    </Router>
  );
};

export default Main;
