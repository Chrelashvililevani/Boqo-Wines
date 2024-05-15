import React, { useState } from 'react';
import './style.css';

const AddNewsForm = ({ onAddNews }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl || !title || !description) {
      alert('Please fill in all fields');
      return;
    }
    onAddNews({ imageUrl, title, description });
    setImageUrl('');
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUrl">Image URL:</label>
      <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label htmlFor="description">Description:</label>
      <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

      <button type="submit">Add News</button>
    </form>
  );
};

export default AddNewsForm;
