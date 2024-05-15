import React, { useState, useEffect } from 'react';
import './style.css';
import UseScrollEffect from './UseScrollEffect';
import { firestore } from './firebase'; // Import Firestore instance from firebase.js
import { collection, getDocs, onSnapshot, query, orderBy, limit } from '@firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link component for navigation


const Slider = ({ newsList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const initializeSlider = () => {
      const slider = document.querySelector('.info-slide-container');
      const slideWidth = slider.offsetWidth;
      goToSlide(0, slider, slideWidth);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    initializeSlider();
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToSlide = (index, slider, slideWidth) => {
    if (slider) {
      const offset = -index * (slideWidth + 50); // Adjust the 50 value as necessary for spacing between slides
      slider.style.transform = `translateX(${offset}px)`;
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % newsList.length;
    const slider = document.querySelector('.info-slide-container');
    const slideWidth = slider.offsetWidth;
    goToSlide(newIndex, slider, slideWidth);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + newsList.length) % newsList.length;
    const slider = document.querySelector('.info-slide-container');
    const slideWidth = slider.offsetWidth;
    goToSlide(newIndex, slider, slideWidth);
  };

  return (
    <div className="info">
      <button className="arrow prev" onClick={prevSlide}>&#10094;</button>
      <button className="arrow next" onClick={nextSlide}>&#10095;</button>
      <div className="info-slide-container">
        {newsList.map((news, index) => (
          <div
            key={news.id}
            className="info-slide"
            style={{
              backgroundImage: news.imageUrls && news.imageUrls.length > 0 ? `url(${news.imageUrls[0]})` : 'none', // Check if imageUrl array exists and contains at least one URL
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div>
              <h1 style={{ color: 'white' }} className='h1-back'>{news.title}</h1>
              <p style={{ color: 'white', padding: '20px' }} className='p-back'>{news.description.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}</p>
              <Link key={news.id} to={`/news/${news.id}`}>
                <button className='news-button-main'>ვრცლად</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Info = () => {
  const isScrollingUp = UseScrollEffect();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsCollection = collection(firestore, 'News');
        const querySnapshot = await getDocs(query(newsCollection, orderBy('timestamp', 'desc'), limit(5))); // Fetch only the latest 5 items
        const newsData = [];

        querySnapshot.forEach((doc) => {
          const news = { id: doc.id, ...doc.data() };
          newsData.push(news);
        });

        setNewsList(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();

    // Set up real-time listener for changes to the "News" collection
    const unsubscribe = onSnapshot(query(collection(firestore, 'News'), orderBy('timestamp', 'desc'), limit(5)), (snapshot) => {
      const updatedNewsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(updatedNewsList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <Slider newsList={newsList} />
  );
};

export default Info;
