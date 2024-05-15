import React, { useState } from 'react';
import AddNewsForm from './AddNewsForm';

const AdminPage = () => {
  const [news, setNews] = useState([]);

  const handleAddNews = (newNews) => {
    setNews([...news, newNews]);
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <AddNewsForm onAddNews={handleAddNews} />
      {/* Display existing news or other components */}
    </div>
  );
};

export default AdminPage;
