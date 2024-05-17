import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import the authentication state listener
import { firestore, auth } from './firebase'; // Adjust the path as necessary

const WineSelector = () => {
  const [user, setUser] = useState(null); // State to store the logged-in user
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [step, setStep] = useState(1);
  const [fetchedWines, setFetchedWines] = useState([]);
  const [selectedWines, setSelectedWines] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [buyStep, setBuyStep] = useState(false);
  const [wineQuantities, setWineQuantities] = useState({});

  // Listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('wineSelectorState'));
    const savedSelectedWines = JSON.parse(localStorage.getItem('selectedWines'));

    if (savedSelectedWines) {
      setSelectedWines(savedSelectedWines);
    }

    if (savedState) {
      setTaste(savedState.taste);
      setWineType(savedState.wineType);
      setStep(savedState.step);
      setSubmitted(savedState.submitted);
      setBuyStep(savedState.buyStep);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { taste, wineType, step, submitted, buyStep };
    localStorage.setItem('wineSelectorState', JSON.stringify(stateToSave));
  }, [taste, wineType, step, submitted, buyStep]);

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
    if (step < 3) {
      setStep((prevStep) => prevStep + 1);
    } else {
      setSubmitted(true);
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
    setWineQuantities({});
    setSelectedWines([])
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
      // Save selected wines to local storage
      localStorage.setItem('selectedWines', JSON.stringify(updatedSelectedWines));
      // Update progress based on the number of selected wines
      const progress = updatedSelectedWines.length > 0 ? 3 : step;
      setStep(progress); // Update the progress
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
  };

  const handlePurchase = async () => {
    if (!user) {
      alert('Please log in to buy selected wines.');
      return;
    }
    

    try {
      const userId = user.uid; // Use the logged-in user's ID
      const winesSoldCollection = collection(firestore, 'wines-sold');

      await Promise.all(
        selectedWines.map(async (wineId) => {
          const quantity = wineQuantities[wineId] || 1;
          await addDoc(winesSoldCollection, {
            userId,
            wineId,
            quantity,
            timeBought: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'sold',
            additionalPrice: '0'
          });
        })
      );

      // Reset after purchase
      handleReset();
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error purchasing wines:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  

  return (
    <>
      <div className='wines-header-select'></div>
      <div className='find-wine' style={{ paddingTop: '0px', textAlign: 'center', paddingBottom: '100px' }}>
        <h1>მოძებნე შენი ღვინო</h1>
        <form onSubmit={handleSubmit}>
          {!buyStep && (
            <>
              {step === 1 && (
                <div>
                  <label>აარჩიე გემო?</label>
                  <select value={taste} onChange={(e) => setTaste(e.target.value)}>
                    <option value="">არჩევა</option>
                    <option value="Dry">მშრალი</option>
                    <option value="Semi Sweet">ნახევრად ტკბილი</option>
                    <option value="Sweet">ტკბილი</option>
                  </select>
                  <button type="submit">შემდეგი</button>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label>აარჩიე კატეგორია?</label>
                  <select value={wineType} onChange={(e) => setWineType(e.target.value)}>
                    <option value="">არჩევა</option>
                    <option value="Red">წითელი</option>
                    <option value="White">თეთრი</option>
                  </select>
                  <button type="submit">შემდეგი</button>
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
                          />
                          {wine.title} - {translateTaste(wine.Taste)} - {translateCategory(wine.Category)} - {wine.price} ლარი
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>არ მოიძებნა ღვინო</p>
                  )}
                  {selectedWines.length > 0 && (
                    <div>
                      <button type="button" onClick={handleBuyNow}>შეიძინე ახლავე</button>
                      <button type="button">აჩუქე მეგობარს</button>
                    </div>
                  )}
                  <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
                </div>
              )}
            </>
          )}
          {buyStep && (
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
                      <button onClick={() => handleDecrement(wine.id)} style={{width: '50px'}}>-</button>
                      <input
                        type="number"
                        value={wineQuantities[wine.id] || 1}
                        onChange={(e) => handleQuantityChange(wine.id, parseInt(e.target.value))}
                        className='input-changenubmer-checkout-m'
                      />
                      <button onClick={() => handleIncrement(wine.id)} style={{width: '50px'}}>+</button>
                    </div>
                  </div>
                ))}
            </ul>
            {user ? (
              <>
                <button type="button" onClick={handlePurchase}>შეძენა</button>
                <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
              </>
            ) : (
              <p>გთხოვთ გაიაროთ ავტორიზაცია, რომ შეძლოთ არჩეული ღვნიოების შეძენა.</p>
            )}
          </div>
        )}
      </form>
    </div>
  </>
);
};

export default WineSelector;

