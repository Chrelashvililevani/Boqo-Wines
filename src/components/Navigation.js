import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, onSnapshot, query, where } from '@firebase/firestore';
import { firestore, auth } from './firebase';
import Basket from './Basket'; // Import the Basket component
import RegisterUser from './RegisterUser'; // Import the RegisterUser component
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Navigation = ({ updateZIndexes }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isBasketOpen, setIsBasketOpen] = useState(false); // State to manage basket window visibility
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State to manage registration window visibility
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    const changeNavColor = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('scroll', changeNavColor);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', changeNavColor);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
        try {
            if (user) {
                const userId = user.uid;
                const cartItemsCollection = collection(firestore, 'wines-sold');
                const cartItemsSnapshot = await getDocs(query(cartItemsCollection, where('userId', '==', userId), where('status', '==', 'checking')));
                const itemCount = cartItemsSnapshot.docs.length; // Use length property to count items
                setCartItemCount(itemCount);
            } else {
                setCartItemCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };
    
    
    
    fetchCartItems();

    const unsubscribe = onSnapshot(collection(firestore, 'wines-sold'), () => {
        fetchCartItems();
    });

    return () => unsubscribe();
}, [user]);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user); // Update user state
  });

  return () => unsubscribe();
}, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleBasket = () => {
    setIsBasketOpen(!isBasketOpen); // Toggle basket window visibility
  };

  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen); // Toggle registration window visibility
  };

  const scrollToContent = () => {
    const contentDiv = document.querySelector('.presentation-content');
    if (contentDiv) {
      const offset = 120;
      window.scrollTo({
        top: contentDiv.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  return (
    <>
      {isMobile ? (
        <>
          <div className="menu-botton-container" >
            <div className='nav-left'>
              <div className="cart-icon-container" onClick={toggleBasket} style={{ cursor: 'pointer' }}>
                <div className='cart-count-small'>{cartItemCount > 0 && <div className="cart-item-count">{cartItemCount}</div>}</div>
                <div className='cart-icon-container-small'><FontAwesomeIcon icon={faShoppingBasket} size="lg" /></div>
              </div>
            </div>
            <button className='button-mobile' onClick={toggleMenu}>
              <span className="menu-line"></span>
              <span className="menu-line"></span>
              <span className="menu-line"></span>
            </button>
            <div className='nav-right'>
              {user ? (
                <span className="register-button" onClick={toggleRegister} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faUser} size='xl'/>
                </span>
              ) : (
                <span className="register-button" onClick={toggleRegister} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faUser} size='xl'/>
                </span>
              )}
            <FontAwesomeIcon icon={faFacebook} size='2xl'/>
            <FontAwesomeIcon icon={faInstagram} size='2xl'/>
            </div>
          </div>
          {isMenuOpen && (
            <div className="overlay" onClick={toggleMenu}>
              <div className="menu">
                <ul>
                  <li><Link to="/">მთავარი</Link></li>
                  <li><a href="#about" onClick={scrollToContent}>ჩვენს შესახებ</a></li>
                  <li><Link to="/WinesPage">ღვინოები</Link></li>
                  <li><Link to="/tours">ღვინის ტური</Link></li>
                  <li><a href="#contact" onClick={scrollToFooter}>კონტაქტი</a></li>
                </ul>
              </div>
            </div>
          )}
          {/* Render RegisterUser component if isRegisterOpen is true */}
          {isRegisterOpen && <RegisterUser onClose={toggleRegister} />}
          {/* Pass isBasketOpen state to Basket component */}
          {isBasketOpen && <Basket isBasketOpen={isBasketOpen} />}
        </>
      ) : (
        <nav id="fixed-nav">
          <div className='nav-left'>
            <div className="cart-icon-container" onClick={toggleBasket} style={{ cursor: 'pointer' }}>
              <div className='cart-count'>{cartItemCount > 0 && <div className="cart-item-count">{cartItemCount}</div>}</div>
              <div><FontAwesomeIcon icon={faShoppingBasket} size="2x" /></div>
            </div>
          </div>
          <ul className='menu-main'>
            <li><Link to="/">მთავარი</Link></li>
            <li><a href="#about" onClick={scrollToContent}>ჩვენს შესახებ</a></li>
            <li><Link to="/WinesPage">ღვინოები</Link></li>
            <li><Link to="/tours">ღვინის ტური</Link></li>
            <li><a href="#contact" onClick={scrollToFooter}>კონტაქტი</a></li>
          </ul>
          <div className='nav-right'>
            {/* Render RegisterUser component if isRegisterOpen is true */}
            {isRegisterOpen && <RegisterUser onClose={toggleRegister} />}
            {user ? (
              <span className="register-button" onClick={toggleRegister} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faUser} size='xl'/></span>
            ) : (
              <span className="register-button" onClick={toggleRegister} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faUser} size='xl'/></span>
            )}
          <FontAwesomeIcon icon={faFacebook} size='xl'/>
          <FontAwesomeIcon icon={faInstagram} size='xl'/>
          </div>
          {/* Pass isBasketOpen state to Basket component */}
          {isBasketOpen && <Basket isBasketOpen={isBasketOpen} />}
        </nav>
      )}
    </>
  );
};

export default Navigation;
