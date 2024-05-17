import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from './firebase'; // Adjust the path as necessary

const WineSelector = () => {
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [step, setStep] = useState(1);
  const [fetchedWines, setFetchedWines] = useState([]);
  const [selectedWines, setSelectedWines] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('wineSelectorState'));
    if (savedState) {
      setTaste(savedState.taste);
      setWineType(savedState.wineType);
      setStep(savedState.step);
      setSubmitted(savedState.submitted);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { taste, wineType, step, submitted };
    localStorage.setItem('wineSelectorState', JSON.stringify(stateToSave));
  }, [taste, wineType, step, submitted]);

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
        where('Category', '==', wineType),
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
  };

  const handleCheckboxChange = (wineId) => {
    setSelectedWines((prevSelectedWines) =>
      prevSelectedWines.includes(wineId)
        ? prevSelectedWines.filter((id) => id !== wineId)
        : [...prevSelectedWines, wineId]
    );
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

  return (
    <>
      <div className='wines-header-select'></div>
      <div className='find-wine' style={{ paddingTop: '0px', textAlign: 'center', paddingBottom: '100px' }}>
        <h1>მოძებნე შენი ღვინო</h1>
        <form onSubmit={handleSubmit}>
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
                  <button type="button">შეიძინე ახლავე</button>
                  <button type="button">აჩუქე მეგობარს</button>
                </div>
              )}
              <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default WineSelector;
