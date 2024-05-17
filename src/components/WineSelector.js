import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from './firebase'; // Adjust the path as necessary

const WineSelector = () => {
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [step, setStep] = useState(1);
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

        setSelectedWines(wines);
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
        setSelectedWines(wines);
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
    setSelectedWines([]);
  };


  return (
    <div className='find-wine' style={{ paddingTop: '150px', textAlign: 'center', paddingBottom: '100px' }}>
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
            <p>გემო: {taste}</p>
            <p>ღვინის კატეგორია: {wineType}</p>
            {selectedWines.length > 0 ? (
              <ul>
                {selectedWines.map((wine) => (
                  <li key={wine.id}>
                    {wine.title} - {wine.Taste} - {wine.Category} - {wine.price} ლარი
                  </li>
                ))}
              </ul>
            ) : (
              <p>არ მოიძებნა ღვინო</p>
            )}
            <button type="button" onClick={handleReset}>დაიწყე თავიდან</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default WineSelector;
