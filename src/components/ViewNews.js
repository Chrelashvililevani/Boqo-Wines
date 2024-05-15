import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from './firebase';
import { doc, getDoc } from '@firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from 'react-modal';
import './style.css';

const ViewNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  

  useEffect(() => {
    // Set the app element for react-modal when the component mounts
    Modal.setAppElement('#root');

    const fetchNewsDetails = async () => {
      try {
        const newsDoc = doc(firestore, 'News', id);
        const docSnapshot = await getDoc(newsDoc);

        if (docSnapshot.exists()) {
          const newsData = { id: docSnapshot.id, ...docSnapshot.data() };
          setNews(newsData);
          if (newsData.imageUrls) {
            setImageUrls(newsData.imageUrls);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching news details:', error);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const openFullscreen = (index) => {
    setSelectedImageIndex(index);
    setIsFullscreen(true);
    updateZIndexes(true); // Call the function to update z-indexes when fullscreen mode is activated
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImageIndex(null);
    updateZIndexes(false); // Call the function to update z-indexes when fullscreen mode is deactivated
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Hide arrows
  };

  const updateZIndexes = (fullscreen) => {
    // Check if the elements exist in the DOM before accessing their styles
    const fixedNavElement = document.getElementById('fixed-nav');
    const menuButtonContainerElement = document.querySelector('.menu-botton-container');

    if (fixedNavElement) {
      // Set z-index based on the fullscreen mode
      fixedNavElement.style.zIndex = fullscreen ? 0 : 100;
    }
    if (menuButtonContainerElement) {
      // Set z-index based on the fullscreen mode
      menuButtonContainerElement.style.zIndex = fullscreen ? 0 : 100;
    }
  };

  if (!news) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className='view-news-body'>
      <div className='view-news-header'></div>
      <div className="view-news-container">
        <h1>{news.title}</h1>
        <p>{news.description}</p>
        {isFullscreen ? (
          <Slider {...settings}>
            {imageUrls.map((imageUrl, index) => (
              <div key={imageUrl} className='images-centered'>
                <img className="slider-image" src={imageUrl} alt={`Image ${index}`} />
              </div>
            ))}
          </Slider>
        ) : (
          <Slider {...settings}>
            {imageUrls.map((imageUrl, index) => (
              <div key={imageUrl} className='images-centered'>
                <img className="slider-image" src={imageUrl} alt={`Image ${index}`} onClick={() => openFullscreen(index)} />
              </div>
            ))}
          </Slider>
        )}
      </div>

      <Modal
        isOpen={isFullscreen}
        onRequestClose={closeFullscreen}
        contentLabel="Fullscreen Modal"
      >
        <div className="fullscreen-modal-content">
          <button onClick={closeFullscreen} className='close-button'>X</button>
          <Slider {...settings}>
            {imageUrls.map((imageUrl, index) => (
              <div key={imageUrl} className='images-centered'>
                <img className="slider-image-fullscreened" src={imageUrl} alt={`Image ${index}`} />
              </div>
            ))}
          </Slider>
        </div>
      </Modal>
    </div>
  );
};

export default ViewNews;
