import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from '@firebase/firestore';
import { firestore, auth } from './firebase';
import { Link } from 'react-router-dom';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <div className="buttons">
          <button onClick={onConfirm} className='yes-button'>კი</button>
          <button onClick={onCancel} className='no-button'>არა</button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
    const [basketItems, setBasketItems] = useState([]);
    const [user, setUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [extensionCheckedMap, setExtensionCheckedMap] = useState({}); // New state
    const [extensionYears, setExtensionYears] = useState(1);
    const [showBuyPopup, setShowBuyPopup] = useState(false); // Define state for showing buy confirmation popup
    const [isSold, setIsSold] = useState(false); // Define state to indicate if wines are sold
    const [showDeletePopup, setShowDeletePopup] = useState(false); // Define state for showing buy confirmation popup
    const [totalBottlesBought, setTotalBottlesBought] = useState(0);
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false); // State to track whether purchase is confirmed
  
  

    const handleBuyAllWines = () => {
      setShowBuyPopup(true); // Show confirmation popup for buying wines
    };
  
    const handleConfirmBuy = async () => {
      try {
        let totalQuantity = 0;
        const timestamp = serverTimestamp(); // Import serverTimestamp from Firebase
    
        await Promise.all(basketItems.map(async (item) => {
          const docRef = doc(firestore, 'wines-sold', item.id);
          await updateDoc(docRef, {
            status: 'sold',
            timeBought: timestamp,
            additionalPrice: item.additionalPrice || 0 // Set additionalPrice with a default value of 0 if not provided
          }); // Add timeBought with current timestamp
          totalQuantity += item.quantity;
        }));
    
        setBasketItems(prevItems => prevItems.map(item => ({ ...item, status: 'sold', timeBought: timestamp })));
        setTotalBottlesBought(totalQuantity);
        setIsSold(true);
        setPurchaseConfirmed(true); // Set purchaseConfirmed to true
      } catch (error) {
        console.error('Error updating status:', error);
      } finally {
        setShowBuyPopup(false);
      }
    };
                        
    // Function to cancel buying all wines
    const handleCancelBuy = () => {
      setShowBuyPopup(false); // Close the buy confirmation popup
    };
  
  
  
    // Define fetchBasketItems function
    const fetchBasketItems = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const basketQuery = query(collection(firestore, 'wines-sold'), where('userId', '==', userId), where('status', '==', 'checking'));
          const querySnapshot = await getDocs(basketQuery);
          const itemsPromises = querySnapshot.docs.map(async (docSnapshot) => {
            const wineSoldData = docSnapshot.data();
            const wineId = wineSoldData.wineId;
            const quantity = wineSoldData.quantity;
            const extensionChecked = !!wineSoldData.WineAging; // Check if WineAging exists
            const extensionYears = wineSoldData.WineAging || 1; // Set extensionYears to WineAging or default to 1
            const additionalPrice = extensionChecked ? extensionYears * 50 : 0; // Calculate additional price or default to 0
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
                extensionChecked: extensionChecked,
                extensionYears: extensionYears,
                additionalPrice: additionalPrice,
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
  
      fetchBasketItems();
  
      return () => {
        unsubscribeAuth();
      };
  
    }, [user]);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(firestore, 'wines-sold'), () => {
        fetchBasketItems();
      });
  
      return () => unsubscribe();
    }, [user]);
  
  
  
    const handleExtensionCheckboxChange = async (e, itemId) => {
      const isChecked = e.target.checked;
      setExtensionCheckedMap(prevMap => ({
        ...prevMap,
        [itemId]: isChecked // Update extension checked status for the item
      }));
      
      try {
        const docRef = doc(firestore, 'wines-sold', itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (isChecked) {
            // Add WineAging option
            await updateDoc(docRef, { WineAging: extensionYears, additionalPrice: extensionYears * 50 });
          } else {
            // Remove WineAging option and set additionalPrice to 0
            await updateDoc(docRef, { WineAging: null, additionalPrice: 0 });
          }
      
          // Update the state of the individual item's extensionChecked and additionalPrice
          setBasketItems(prevItems =>
            prevItems.map(item =>
              item.id === itemId ? { ...item, extensionChecked: isChecked, additionalPrice: isChecked ? extensionYears * 50 : 0 } : item
            )
          );
        }
      } catch (error) {
        console.error('Error updating WineAging:', error);
      }
    };
    
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const docRef = doc(firestore, 'wines-sold', itemId);
      await updateDoc(docRef, { quantity: newQuantity });

      // Update the item's quantity in state
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

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      try {
        await deleteDoc(doc(firestore, 'wines-sold', deleteItemId));
    
        // Remove the item from state
        setBasketItems(prevItems => prevItems.filter(item => item.id !== deleteItemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setDeleteItemId(null);
        setShowDeletePopup(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteItemId(null);
    setShowDeletePopup(false);
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

  const calculateTotalPrice = () => {
    // Calculate total price with extension
    let totalPrice = basketItems.reduce((total, item) => {
      let itemPrice = item.price * item.quantity;
      if (item.extensionChecked) {
        itemPrice = (parseFloat(item.price) + parseFloat(item.additionalPrice)) * item.quantity || 0; // Add additionalPrice if it exists
      }
      return total + itemPrice;
    }, 0);
    return totalPrice;
  };
  
      
  const handleExtensionYearsChange = async (e, itemId) => {
    const years = parseInt(e.target.value);
    setBasketItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, extensionYears: years, additionalPrice: years * 50 } : item
      )
    );
  
    try {
      const docRef = doc(firestore, 'wines-sold', itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const wineSoldData = docSnap.data();
        const currentPrice = wineSoldData.price;
        const additionalPrice = years * 50; // 50 Gel per year
  
        // Update WineAging option and additional price
        await updateDoc(docRef, { WineAging: years, additionalPrice: additionalPrice });
  
        // Recalculate total price with the new additional price
        const updatedBasketItems = basketItems.map(item =>
          item.id === itemId ? { ...item, extensionYears: years, additionalPrice: additionalPrice } : item
        );
        setBasketItems(updatedBasketItems);
      }
    } catch (error) {
      console.error('Error updating WineAging:', error);
    }
  };
        
  return (
    <>
      <div className='wines-header'></div>
      {basketItems.length > 0 && (
        <>
        <div className="checkout">
          <div className='checkout-align-map'>
            {basketItems.map((item, index) => (
              <div key={index}>
                <div className='checkout-cont' style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <div>
                    <div className='checkout-align'>
                      <div>
                        <h3>{item.title}</h3>
                      </div>
                      <div>
                        <p>ფასი: {item.price} ლარი</p>
                        <input type="checkbox" checked={item.extensionChecked} onChange={(e) => handleExtensionCheckboxChange(e, item.id)} />
                        დაძველება:
                        {item.extensionChecked && (
                          <select value={item.extensionYears} onChange={(e) => handleExtensionYearsChange(e, item.id)}>
                            <option key={index} >აირჩიე</option>
                            {[...Array(10)].map((_, index) => (
                              <option key={index} value={index + 1}>{index + 1} წელი</option>
                            ))}
                          </select>
                        )}
                        <p>რაოდენობა: </p>
                        <button className="quantity-btn-checkout" onClick={() => handleDecrement(item.id)}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className='input-changenubmer-checkout'
                        />
                        <button className="quantity-btn-checkout" onClick={() => handleIncrement(item.id)}>+</button>
                      </div>
                      <div>
                        <button onClick={() => handleDeleteClick(item.id)} className='delete-item-checkout'>წაშლა</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src={item.imageUrls[0]} alt={item.title} style={{ maxWidth: '100px' }} />
                  </div>
                </div>
                <div>
                </div>
              </div>
            ))}
          </div>
        </div>
              <div className='calc-ptice-total'>
              საერთო ფასი: {calculateTotalPrice()} ლარი
              <button onClick={() => setShowBuyPopup(true)} className='buy-all-now'>შეიძინე</button>
            </div>    
            </>  
      ) }

    {basketItems.length == 0 && (
        <div style={{textAlign: 'center', padding: '20px'}}>
            <img src='./images/empty-box.jpg' style={{minWidth: '150px', width: '20vw'}}/>
            <p>კალათა ცარიელია</p>
            </div>
    ) }
      {/* Confirmation popup for deleting wine */}
      {showDeletePopup && (
        <ConfirmationPopup
          message="ნამდვილად გსურთ წაშლა?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Confirmation popup for buying wines */}
      {showBuyPopup && (
        <ConfirmationPopup
          message="ნამდვილად გსურთ ყველა ღვინის შეძენა?"
          onConfirm={handleConfirmBuy}
          onCancel={handleCancelBuy}
        />
      )}

      {/* JSX to display message when items are sold */}
        {purchaseConfirmed && isSold && (
        <div className='items-are-bought'>
          <div className='bought-pop-up'>
          <p>თქვენ წარმატებით შეიძინეთ {totalBottlesBought} ბოთლი ღვინო!</p>
          <span role="img" aria-label="check mark">✅</span>
            <Link to="/my-wines" className="my-wines-link-m">
              <p>შეძენილი ღვინოების ნახვა</p>
            </Link>
          </div>
          <button className="close-button-buy" onClick={() => setPurchaseConfirmed(false)}>X</button>
        </div>
      )}

    </>
  );
  };

export default CheckoutPage;
