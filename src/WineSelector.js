import React, { useState } from 'react';

const WineSelector = () => {
  // State variables to store user selections
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 20, max: 250 });
  const [selectedWines, setSelectedWines] = useState([]);

  useEffect(() => {
    const fetchWines = async (taste, wineType, priceRange) => {
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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wines = await fetchWines(taste, wineType, priceRange);
      setSelectedWines(wines);
    } catch (error) {
      console.error('Error fetching wines:', error);
    }
  };
  const handleBuyClick = (wineId) => {
    // Implement your logic for handling the buy button click
    console.log('Buy button clicked for wine with ID:', wineId);
  };

  return (
    <div>
      <h1>Find Your Wine</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Which taste do you prefer?</label>
          <select value={taste} onChange={(e) => setTaste(e.target.value)}>
            <option value="">Select Taste</option>
            <option value="Dry">Dry</option>
            <option value="Semi Sweet">Semi Sweet</option>
            <option value="Sweet">Sweet</option>
          </select>
        </div>
        <div>
          <label>Which type of wine do you prefer?</label>
          <select value={wineType} onChange={(e) => setWineType(e.target.value)}>
            <option value="">Select Wine Type</option>
            <option value="Red">Red</option>
            <option value="White">White</option>
          </select>
        </div>
        <div>
          <label>Price Range (USD)</label>
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
            min="20"
            max="250"
            step="10"
          />
          -
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            min="20"
            max="250"
            step="10"
          />
        </div>
        <button type="submit">Find Wines</button>
      </form>
      <div>
        <h2>Available Wines</h2>
        <ul>
          {selectedWines.map((wine, index) => (
            <li key={index}>
              {wine.name} - ${wine.price} - Bottles: {wine.quantity}
              <button onClick={() => handleBuyClick(wine.id)}>Buy</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WineSelector;
