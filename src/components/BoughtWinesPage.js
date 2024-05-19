import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from '@firebase/firestore';
import { firestore, auth } from './firebase';

const BoughtWinesPage = () => {
  const [boughtWines, setBoughtWines] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchBoughtWines = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const boughtWinesQuery = query(
            collection(firestore, 'wines-sold'),
            where('userId', '==', userId),
            where('status', '==', 'sold'),
            orderBy('timeBought', 'desc')
          );
          const querySnapshot = await getDocs(boughtWinesQuery);
          const winesPromises = querySnapshot.docs.map(async (docSnapshot) => {
            const wineSoldData = docSnapshot.data();
            const wineId = wineSoldData.wineId;
            const quantity = wineSoldData.quantity;
            const additionalPrice = wineSoldData.additionalPrice || 0;
            const wineAging = wineSoldData.WineAging || 0;
            const recipientName = wineSoldData.recipientName || '';
            const recipientAddress = wineSoldData.recipientAddress || '';
            const wineDocRef = doc(firestore, 'Wines', wineId);
            const wineDocSnap = await getDoc(wineDocRef);
            if (wineDocSnap.exists()) {
              const wineData = wineDocSnap.data();
              const price = wineData.price;
              const imageUrls = wineData.imageUrls;
              return {
                id: docSnapshot.id,
                ...wineData,
                price: price,
                quantity: quantity,
                imageUrls: imageUrls,
                additionalPrice: additionalPrice,
                totalPrice: (parseFloat(price) + parseFloat(additionalPrice)) * quantity,
                wineAging: wineAging,
                recipientName: recipientName,
                recipientAddress: recipientAddress,
              };
            } else {
              console.error('Wine document not found for ID:', wineId);
              return null;
            }
          });
          const wines = await Promise.all(winesPromises);
          setBoughtWines(wines.filter((wine) => wine !== null));
        } else {
          setBoughtWines([]);
        }
      } catch (error) {
        console.error('Error fetching bought wines:', error);
      }
    };

    fetchBoughtWines();
  }, [user]);

  return (
    <>
      <div className='wines-header'></div>
      <div className="bought-wines-page">
        <h2>შეძენილი ღვინოები</h2>
        <div className="bought-wines-list">
          {boughtWines.map(wine => (
            <div key={wine.id} className='bought-row'>
              <h3>{wine.title}</h3>
              <img src={wine.imageUrls[0]} className='image-bought' alt={`${wine.title}`} />
              <p>ჯამური ფასი: {wine.totalPrice} GEL</p>
              <p>რაოდენობა: {wine.quantity}</p>
              {wine.wineAging > 0 && <p>დაძველება: {wine.wineAging} წლით</p>}
              {wine.recipientName && <p>მიმღები: {wine.recipientName}</p>}
              {wine.recipientAddress && <p>მისამართი: {wine.recipientAddress}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BoughtWinesPage;
