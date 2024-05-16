import React, { useState } from 'react';

const WineSelector = () => {
  // State variables to store user selections
  const [taste, setTaste] = useState('');
  const [wineType, setWineType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 20, max: 250 });
  const [selectedWines, setSelectedWines] = useState([]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to fetch wines based on user selections and update selectedWines state
    // You can implement this logic using an API call or a local data source
    // For demonstration purposes, let's assume we have a function fetchWines() that returns the list of wines
    const wines = fetchWines(taste, wineType, priceRange);
    setSelectedWines(wines);
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
