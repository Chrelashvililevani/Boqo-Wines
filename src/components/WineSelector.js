import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from './firebase';
import { Link } from 'react-router-dom';

const WineSelector = () => {
  const [user, setUser] = useState(null);
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [step, setStep] = useState(1);
  const [fetchedWines, setFetchedWines] = useState([]);
  const [selectedWines, setSelectedWines] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [buyStep, setBuyStep] = useState(false);
  const [giftStep, setGiftStep] = useState(false);
  const [wineQuantities, setWineQuantities] = useState({});
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [giftDetails, setGiftDetails] = useState({ fullName: '', address: '', mobileNumber: '' });
  const [errors, setErrors] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, wineId: null });

  const popupRef = useRef(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.pageX, y: event.pageY },
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef]);

  const ContextMenu = ({ position, onClose}) => {
    const { x, y } = position;
  
    return (
      <>
      <div className="context-menu" style={{ top: y, left: x }}>
        <ul>
          <li onClick={handleSubmit}>შემდეგი</li>
          <li onClick={handleBack}>უკან</li>
          <li onClick={handleReset}>თავიდან</li>
        </ul>
      </div>
      <div onClick={onClose} className="context-menu-backdrop"></div>
      </>
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('wineSelectorState'));
    const savedSelectedWines = JSON.parse(localStorage.getItem('selectedWines'));
    const savedWineQuantities = JSON.parse(localStorage.getItem('wineQuantities'));

    if (savedWineQuantities) {
      setWineQuantities(savedWineQuantities);
    }

    if (savedSelectedWines) {
      setSelectedWines(savedSelectedWines);
    }

    if (savedState) {
      setTaste(savedState.taste);
      setWineType(savedState.wineType);
      setStep(savedState.step);
      setSubmitted(savedState.submitted);
      setBuyStep(savedState.buyStep);
      setGiftStep(savedState.giftStep);
      setGiftDetails(savedState.giftDetails || { fullName: '', address: '', mobileNumber: '' });
    }
  }, []);

  useEffect(() => {
    const stateToSave = { taste, wineType, step, submitted, buyStep, giftStep, giftDetails };
    localStorage.setItem('wineSelectorState', JSON.stringify(stateToSave));
    localStorage.setItem('wineQuantities', JSON.stringify(wineQuantities));
    localStorage.setItem('selectedWines', JSON.stringify(selectedWines));
  }, [taste, wineType, step, submitted, buyStep, giftStep, giftDetails, wineQuantities, selectedWines]);

  useEffect(() => {
    if (submitted) {
      fetchWines(taste, wineType).then((wines) => {
        setFetchedWines(wines);
      });
    }
  }, [submitted, taste, wineType]);

  const fetchWines = async (taste, wineType) => {
    try {
      const winesCollection = collection(firestore, 'Wines');
      const q = query(
        winesCollection,
        where('Taste', '==', taste),
        where('Category', '==', wineType)
      );
      const winesSnapshot = await getDocs(q);
      const winesData = winesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return winesData;
    } catch (error) {
      console.error('Error fetching wines:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchWines(taste, wineType).then((wines) => {
      setFetchedWines(wines);
    });
  }, [taste, wineType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (step === 1 && !taste) {
      newErrors.taste = true;
    }

    if (step === 2 && !wineType) {
      newErrors.wineType = true;
    }

    if (step === 3 && selectedWines.length === 0) {
      newErrors.selectedWines = true;
    }

    if (giftStep && step === 4 && !giftDetails.fullName) {
      newErrors.fullName = true;
    }

    if (giftStep && step === 5 && !giftDetails.address) {
      newErrors.address = true;
    }

    if (giftStep && step === 6 && !giftDetails.mobileNumber) {
      newErrors.mobileNumber = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (step < 3 || (giftStep && step < 7)) {
      setStep((prevStep) => prevStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (buyStep) {
      if (step === 7) {
        setBuyStep(false);
        setStep(3);
      }
    } else if (giftStep) {
      if (step === 5) {
        setStep(4);
      } else if (step === 4) {
        setGiftStep(false);
        setStep(3);
      } else if (step > 5) {
        setStep((prevStep) => prevStep - 1);
      }
    } else if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleReset = () => {
    setTaste('');
    setWineType('');
    setStep(1);
    setSubmitted(false);
    setFetchedWines([]);
    setSelectedWines([]);
    setBuyStep(false);
    setGiftStep(false);
    setWineQuantities({});
    setGiftDetails({ fullName: '', address: '', mobileNumber: '' });
    setErrors({});
  };

  const handleCheckboxChange = (wineId) => {
    setSelectedWines((prevSelectedWines) => {
      const updatedSelectedWines = prevSelectedWines.includes(wineId)
        ? prevSelectedWines.filter((id) => id !== wineId)
        : [...prevSelectedWines, wineId];
      setWineQuantities((prevQuantities) => ({
        ...prevQuantities,
        [wineId]: prevQuantities[wineId] || 1,
      }));
      localStorage.setItem('selectedWines', JSON.stringify(updatedSelectedWines));
      const progress = updatedSelectedWines.length > 0 ? 3 : step;
      setStep(progress);
      return updatedSelectedWines;
    });
  };

  const handleQuantityChange = (wineId, quantity) => {
    setWineQuantities((prevQuantities) => ({
      ...prevQuantities,
      [wineId]: quantity,
    }));
  };

  const handleIncrement = (wineId) => {
    setWineQuantities((prevQuantities) => ({
      ...prevQuantities,
      [wineId]: (prevQuantities[wineId] || 1) + 1,
    }));
  };

  const handleDecrement = (wineId) => {
    setWineQuantities((prevQuantities) => ({
      ...prevQuantities,
      [wineId]: Math.max((prevQuantities[wineId] || 1) - 1, 1),
    }));
  };

  const translateTaste = (taste) => {
    switch (taste) {
      case 'Dry':
        return 'მშრალი';
      case 'Semi Sweet':
        return 'ნახევრად ტკბილი';
      case 'Sweet':
        return 'ტკბილი';
      default:
        return '';
    }
  };

  const translateCategory = (category) => {
    switch (category) {
      case 'Red':
        return 'წითელი';
      case 'White':
        return 'თეთრი';
      default:
        return '';
    }
  };

  const handleBuyNow = () => {
    setBuyStep(true);
    setStep(7); // Directly go to step 7
  };

  const handleGift = () => {
    setGiftStep(true);
    setStep(4); // Start with step 4 for the gift process
  };

  const handleGiftDetailsChange = (field, value) => {
    setGiftDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handlePurchase = async () => {
    if (!user) {
      setErrors({ auth: true });
      return;
    }

    try {
      const userId = user.uid;
      const winesSoldCollection = collection(firestore, 'WinesSold');
      const wines = selectedWines.map((wineId) => ({
        wineId,
        quantity: wineQuantities[wineId] || 1,
      }));

      await addDoc(winesSoldCollection, {
        userId,
        wines,
        createdAt: serverTimestamp(),
      });

      setPurchaseSuccess('Purchase successful! Thank you for your purchase.');
      handleReset();
    } catch (error) {
      console.error('Error processing purchase:', error);
      setPurchaseSuccess('An error occurred during purchase. Please try again.');
    }
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPurchaseSuccess('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  
  return (
    <>
      <div className='wines-header-select'></div>
      <div className='find-wine' style={{ paddingTop: '0px', textAlign: 'center', paddingBottom: '100px' }} onContextMenu={(e) => handleContextMenu(e, null)}>
        <h1>მოძებნე შენი ღვინო</h1>
        <button type="button" onClick={handleBack} className="back-button">←</button>
        <form onSubmit={handleSubmit}>
          {!buyStep && !giftStep && (
            <>
              {step === 1 && (
                <div>
                  <label>აარჩიე გემო?</label>
                  <select
                    value={taste}
                    onChange={(e) => setTaste(e.target.value)}
                    className={errors.taste ? 'error' : ''}
                  >
                    <option value="">არჩევა</option>
                    <option value="Dry">მშრალი</option>
                    <option value="Semi Sweet">ნახევრად ტკბილი</option>
                    <option value="Sweet">ტკბილი</option>
                  </select>
                  <div><button type="submit">შემდეგი</button></div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label>აარჩიე კატეგორია?</label>
                  <select
                    value={wineType}
                    onChange={(e) => setWineType(e.target.value)}
                    className={errors.wineType ? 'error' : ''}
                  >
                    <option value="">არჩევა</option>
                    <option value="Red">წითელი</option>
                    <option value="White">თეთრი</option>
                  </select>
                  <div>
                    <div><button type="submit">შემდეგი</button></div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2>არჩეული კატეგორიები</h2>
                  <p>გემო: {translateTaste(taste)}</p>
                  <p>ღვინის კატეგორია: {translateCategory(wineType)}</p>
                  {fetchedWines.length > 0 ? (
                    <ul>
                      {fetchedWines.map((wine) => (
                        <li key={wine.id}>
                          <input
                            type="checkbox"
                            checked={selectedWines.includes(wine.id)}
                            onChange={() => handleCheckboxChange(wine.id)}
                            className={errors.selectedWines ? 'error' : ''}
                          />
                          {wine.title} - {translateTaste(wine.Taste)} - {translateCategory(wine.Category)} - {wine.price} ლარი
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>არ მოიძებნა ღვინო</p>
                  )}
                  <div>
                    {selectedWines.length > 0 && (
                      <div className='buy-buy-buy'>
                        <button type="button" onClick={handleBuyNow}>შეიძინე ახლავე</button>
                        <button type="button" onClick={handleGift}>აჩუქე მეგობარს</button>
                      </div>
                    )}
                    <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
                  </div>
                </div>
              )}
            </>
          )}
          {(buyStep || giftStep) && step >= 4 && (
            <div>
              {giftStep && step === 4 && (
                <div className='gift'>
                  <label>მიმღების სრული სახელი:</label>
                  <input
                    type="text"
                    id="fullName"
                    value={giftDetails.fullName}
                    onChange={(e) => handleGiftDetailsChange('fullName', e.target.value)}
                    className={errors.fullName ? 'error' : ''}
                  />
                  <button type="button" onClick={handleSubmit}>შემდეგი</button>
                </div>
              )}
              {giftStep && step === 5 && (
                <div className='gift'>
                  <label>მისამართი:</label>
                  <input
                    type="text"
                    value={giftDetails.address}
                    onChange={(e) => handleGiftDetailsChange('address', e.target.value)}
                    className={errors.address ? 'error' : ''}
                  />
                  <button type="button" onClick={handleSubmit}>შემდეგი</button>
                </div>
              )}
              {giftStep && step === 6 && (
                <div className='gift'>
                  <label>მობილურის ნომერი:</label>
                  <input
                    type="number"
                    value={giftDetails.mobileNumber}
                    onChange={(e) => handleGiftDetailsChange('mobileNumber', e.target.value)}
                    className={errors.mobileNumber ? 'error' : ''}
                  />
                  <button type="button" onClick={handleSubmit}>შემდეგი</button>
                </div>
              )}
              {step === 7 && (
                <div>
                  <h2>შეიძინეთ ღვინო</h2>
                  <ul>
                    {fetchedWines
                      .filter((wine) => selectedWines.includes(wine.id))
                      .map((wine) => (
                        <div key={wine.id} className='buy-cont-c'>
                          <img src={wine.imageUrls[0]} alt={wine.title} style={{ height: '100px' }} />
                          <p>{wine.title} - {translateTaste(wine.Taste)} - {translateCategory(wine.Category)} - {wine.price} ლარი</p>
                          <p>რაოდენობა: </p>
                          <div className='quantity-buy-now'>
                            <button onClick={() => handleDecrement(wine.id)} style={{ width: '50px' }}>-</button>
                            <input
                              type="number"
                              value={wineQuantities[wine.id] || 1}
                              onChange={(e) => handleQuantityChange(wine.id, parseInt(e.target.value))}
                              className='input-changenubmer-checkout-m'
                            />
                            <button onClick={() => handleIncrement(wine.id)} style={{ width: '50px' }}>+</button>
                          </div>
                        </div>
                      ))}
                  </ul>
                  {user ? (
                    <>
                      <div>
                        <button type="button" onClick={handlePurchase}>შეძენა</button>
                      </div>
                    </>
                  ) : (
                    <p>გთხოვთ გაიაროთ ავტორიზაცია, რომ შეძლოთ არჩეული ღვინოების შეძენა.</p>
                  )}
                  <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
                </div>
              )}
            </div>
          )}
        </form>
        {contextMenu.visible && (
          <ContextMenu
            position={contextMenu.position}
            wineId={contextMenu.wineId}
            onClose={handleCloseContextMenu}
            onPurchase={handlePurchase}
            onGiftSubmit={handleSubmit}
          />
        )}
      </div>
      {purchaseSuccess && (
        <div className='items-are-bought'>
          <div className='bought-pop-up' ref={popupRef}>
            <p>{purchaseSuccess}</p>
            <span role="img" aria-label="check mark">✅</span>
            <Link to="/my-wines" className="my-wines-link-m">
              <p>შეძენილი ღვინოების ნახვა</p>
            </Link>
          </div>
          <button className="close-button-buy" onClick={() => setPurchaseSuccess('')}>X</button>
        </div>
      )}
    </>
  );
};

  export default WineSelector;
