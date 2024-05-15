import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from './firebase';
import { doc, getDoc } from '@firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from 'react-modal';
import AddToCart from './AddToCart'; // Import AddToCart component


const modalStyles = {
    content: {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        padding: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: 'none',
        zIndex: '100',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '100',
    },
};

function WineDetailPage() {
    const { wineId } = useParams();
    const [wine, setWine] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showMessage, setShowMessage] = useState(false); // Lift showMessage state up


    useEffect(() => {
        const fetchWineDetails = async () => {
            try {
                if (!wineId) {
                    console.error('Invalid wineId:', wineId);
                    return;
                }

                const wineDocRef = doc(firestore, 'Wines', wineId);
                const docSnapshot = await getDoc(wineDocRef);

                if (docSnapshot.exists()) {
                    const wineData = { id: docSnapshot.id, ...docSnapshot.data() };
                    setWine(wineData);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching wine details:', error);
            }
        };

        fetchWineDetails();
    }, [wineId]);

    const handleAddToCart = () => {
        // Implement the logic to add the wine to the cart
    };

    if (!wine) {
        return <div>Loading...</div>;
    }

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const openFullscreen = (index) => {
        setSelectedImageIndex(index);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <div className="wines-page">
            <div className='wines-header'></div>
            <div className='wines-title'><h1>{wine.title}</h1></div>
            <div className='wines-content'>
                <div>
                    <div className="wine-detail-page">
                        <p>{wine.description}</p>
                        <div className="wine-images">
                            {wine.imageUrls.map((imageUrl, index) => (
                                <div key={index} onClick={() => openFullscreen(index)}>
                                    <img src={imageUrl} alt={`Wine ${index}`} />
                                </div>
                            ))}
                        </div>
                        <p>ფასი: {wine.price} ლარი</p>
                        <AddToCart wineId={wine.id} showMessage={showMessage} setShowMessage={setShowMessage} /> {/* Pass showMessage and setShowMessage */}
                    </div>  
                </div>
                {showMessage && (
                <div className="message">
                    <p>გთხოვთ გაიაროთ ავტორიზაცია რომ შეძლოთ კალათაში ღვინოების დამატება.</p>
                </div>
                )}
            </div>
    
            <Modal
                isOpen={isFullscreen}
                onRequestClose={closeFullscreen}
                style={modalStyles}
                contentLabel="Fullscreen Modal"
            >
                <button onClick={closeFullscreen} className="close-button-black">X</button>
                <div className="fullscreen-slider">
                    {wine.imageUrls.length > 1 ? (
                        <Slider {...settings} initialSlide={selectedImageIndex}>
                            {wine.imageUrls.map((imageUrl, index) => (
                                <div key={index}>
                                    <img src={imageUrl} alt={`Wine ${index}`} className="fullscreen-image"/>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <img src={wine.imageUrls[0]} alt={`Wine 0`} className="fullscreen-image"/>
                    )}
                </div>
            </Modal>
        </div>
    );
    }

export default WineDetailPage;
