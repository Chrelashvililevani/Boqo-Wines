import React, { useState, useEffect } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { firestore } from './firebase';
import AddToCart from './AddToCart'; // Import AddToCart component
import { Link } from 'react-router-dom';

function WinesPage() {
    const [winesList, setWinesList] = useState([]);
    const [showMessage, setShowMessage] = useState(false); // Lift showMessage state up

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const winesCollection = collection(firestore, 'Wines');
                const winesSnapshot = await getDocs(winesCollection);
                const winesData = winesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWinesList(winesData);
            } catch (error) {
                console.error('Error fetching wines:', error);
            }
        };

        fetchWines();
    }, []);

    return (
        <div className="wines-page">
            <div className='wines-header'></div>
            <div className="wines-list">
                {winesList.map((wine, index) => (
                    <div key={index} className="wine-item">
                        <Link to={`/Wines/${wine.id}`} className="wines-list-link"> {/* Pass wine.id as URL parameter */}
                            <div className="wine-details">
                                <h1>{wine.title}</h1>
                                {/* Add more wine details as needed */}
                            </div>
                            <div className="wine-image">
                                <img src={wine.imageUrls[0]} alt={`Wine ${index}`} className="img-wines-wines"/>
                            </div>
                            <p>ფასი: {wine.price} ლარი</p>

                        </Link>
                        <AddToCart wineId={wine.id} showMessage={showMessage} setShowMessage={setShowMessage} /> {/* Pass showMessage and setShowMessage */}
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

export default WinesPage;
