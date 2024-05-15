import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, onSnapshot } from '@firebase/firestore';
import { firestore, auth } from './firebase';
import { Link } from 'react-router-dom';


const Basket = ({ isBasketOpen }) => {
  const [basketItems, setBasketItems] = useState([]);
  const [user, setUser] = useState(null);

  const fetchBasketItems = async () => {
    try {
      if (isBasketOpen && user) {
        const userId = user.uid;
        const basketQuery = query(collection(firestore, 'wines-sold'), where('userId', '==', userId), where('status', '==', 'checking'));
        const querySnapshot = await getDocs(basketQuery);
        const itemsPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const wineSoldData = docSnapshot.data();
          const wineId = wineSoldData.wineId;
          const quantity = wineSoldData.quantity;
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
              imageUrls: imageUrls
            };
          } else {
            console.error('Wine document not found for ID:', wineId);
            return null;
          }
        });
        const items = await Promise.all(itemsPromises);
        setBasketItems(items.filter(item => item !== null));
      } else {
        setBasketItems([]);
      }
    } catch (error) {
      console.error('Error fetching basket items:', error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    fetchBasketItems();
  }, [isBasketOpen, user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'wines-sold'), () => {
      fetchBasketItems();
    });

    return () => unsubscribe();
  }, [isBasketOpen, user]);

  useEffect(() => {
    if (isBasketOpen ) {
      // Scroll to the basket when it opens
      const basketElement = document.getElementById('basket');
      if (basketElement) {
        basketElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isBasketOpen ]);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const docRef = doc(firestore, 'wines-sold', itemId);
      await updateDoc(docRef, {
        quantity: newQuantity
      });
      setBasketItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, 'wines-sold', itemId));
      setBasketItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleIncrement = (itemId) => {
    const updatedQuantity = basketItems.find(item => item.id === itemId).quantity + 1;
    updateQuantity(itemId, updatedQuantity);
  };
  
  const handleDecrement = (itemId) => {
    const currentQuantity = basketItems.find(item => item.id === itemId).quantity;
    if (currentQuantity > 1) {
      const updatedQuantity = currentQuantity - 1;
      updateQuantity(itemId, updatedQuantity);
    }
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return basketItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div id="basket" className={`basket-container ${isBasketOpen ? 'open' : ''}`}>
        <h2>ჩემი კალათა</h2>
      {basketItems.length > 0 ? (
        <>
        <div className="basket" style={{ maxHeight: '300px', overflowY: 'auto', maxWidth: '500px', backgroundColor: 'white' }}>
          <ul>
            {basketItems.map((item, index) => (
              <li key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '90px' }}>
                  <div>
                    <div className='basket-align'>
                      <div>
                        <h3>{item.title}</h3>
                       </div>
                       <div>
                        <p>ფასი: {item.price} ლარი</p>
                          <p>რაოდენობა: </p>
                          <button className="quantity-btn" onClick={() => handleDecrement(item.id)}>-</button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className='input-changenubmer'
                            />
                            <button className="quantity-btn" onClick={() => handleIncrement(item.id)}>+</button>
                          </div>
                          <div>
                            <button onClick={() => deleteItem(item.id)} className='delete-item'>წაშლა</button>
                          </div>
                      </div>
                  </div>
                  <div>
                    <img src={item.imageUrls[0]} alt={item.title} style={{ maxWidth: '100px' }} />
                  </div>
                </div>
                <div>
                </div>
              </li>
            ))}
          </ul>
        </div>
             <div className='buy-all-items'>
             <div>
               საერთო ფასი: {calculateTotalPrice()} ლარი
             </div>
             <div>
             <Link to="/checkout" className='buy-all'>შეიძინე</Link>
             </div>
           </div>
           </>
      ) : (
        <p>კალათა ცარიელია</p>
      )}
    </div>
  );
};

export default Basket;
