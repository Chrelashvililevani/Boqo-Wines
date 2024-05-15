import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { firestore } from './firebase';
import { collection, getDocs, onSnapshot, query, orderBy, limit } from '@firebase/firestore';
import AddToCart from './AddToCart'; // Import AddToCart component
import { Link } from 'react-router-dom';


function WineSlider() {
    const [currentWineIndex, setCurrentWineIndex] = useState(0);
    const [wineWidth, setWineWidth] = useState(0);
    const winesSliderRef = useRef(null);
    const wineContainersRef = useRef([]);
    const [winesList, setWinesList] = useState([]);
    const [showMessage, setShowMessage] = useState(false); // Lift showMessage state up

    useEffect(() => {
        const initializeWinesSlider = () => {
            const winesSlider = winesSliderRef.current;
            if (winesSlider) {
                const wineContainers = winesSlider.querySelectorAll('.wines-container');
                if (wineContainers.length > 0) {
                    wineContainersRef.current = Array.from(wineContainers);
                    const firstContainerWidth = wineContainersRef.current[0].offsetWidth;
                    setWineWidth(firstContainerWidth);
                    goToWine(currentWineIndex);
                }
            }
        };
    
        initializeWinesSlider();
        window.addEventListener('resize', initializeWinesSlider);
        return () => {
            window.removeEventListener('resize', initializeWinesSlider);
        };
    }, [currentWineIndex, winesList]); // Added winesList to the dependencies array
    
    const goToWine = (index) => {
        if (wineContainersRef.current.length > 0) {
            const offset = -index * wineWidth;
            const winesSlider = winesSliderRef.current;
            winesSlider.style.transform = `translateX(${offset}px)`;
        }
    };
        
    const nextWine = () => {
        const nextIndex = (currentWineIndex + 1) % winesList.length;
        setCurrentWineIndex(nextIndex);
    };
    
    const prevWine = () => {
        const prevIndex = (currentWineIndex - 1 + winesList.length) % winesList.length;
        setCurrentWineIndex(prevIndex);
    };
        
    useEffect(() => {
        const fetchWines = async () => {
            try {
                const winesCollection = collection(firestore, 'Wines');
                const winesSnapshot = await getDocs(query(winesCollection, orderBy('timestamp', 'desc'), limit(10)));
                const winesData = winesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWinesList(winesData);
            } catch (error) {
                console.error('Error fetching wines:', error);
            }
        };

        fetchWines();

        const unsubscribe = onSnapshot(query(collection(firestore, 'Wines'), orderBy('timestamp', 'desc'), limit(5)), (snapshot) => {
            const updatedWinesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setWinesList(updatedWinesList);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="wines">
            <button className="arrow prev" onClick={prevWine}>&#10094;</button>
            <button className="arrow next" onClick={nextWine}>&#10095;</button>
            <div className="wines-slider-container" ref={winesSliderRef}>
                {winesList.map((wine, index) => (
                    <div className="wines-container" key={index}>
                        <div>
                            <img className="img-wines" src={wine.imageUrls[0]} alt={`Wine ${index}`} />
                        </div>
                        <div className="wines-add">
                           <Link to={`/Wines/${wine.id}`} className="wines-list-link"> {/* Pass wine.id as URL parameter */}
                                <h1 className='wine-title-h1'>{wine.title}</h1>
                                <p>ფასი: {wine.price} ლარი</p>
                            </Link>
                            <AddToCart wineId={wine.id} showMessage={showMessage} setShowMessage={setShowMessage} /> {/* Pass showMessage and setShowMessage */}
                        </div>
                    </div>
                ))}
            </div>
            {showMessage && (
                <div className="message">
                    <p>გთხოვთ გაიაროთ ავტორიზაცია რომ შეძლოთ კალათაში ღვინოების დამატება.</p>
                </div>
            )}
        </div>
    );
}

export default WineSlider;
