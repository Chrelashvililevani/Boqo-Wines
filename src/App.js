import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import AboutUs from './components/AboutUs';
import Wines from './components/Wines';
import Vineyards from './components/Vineyards';
import Tours from './components/Tours';
import Contact from './components/Contact';
import ViewNews from './components/ViewNews'


function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/wines" element={<Wines />} />
          <Route path="/vineyards" element={<Vineyards />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Tours" exact component={Tours} />
          <Route path="/news/:id" component={ViewNews} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
