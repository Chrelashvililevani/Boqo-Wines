import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { firestore } from './firebase';
import { collection, getDocs, query, orderBy, limit } from '@firebase/firestore';
import './style.css';

const Tours = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsCollection = collection(firestore, 'News');
        const querySnapshot = await getDocs(query(newsCollection, orderBy('timestamp', 'desc'), limit(5)));
        const newsData = [];

        querySnapshot.forEach((doc) => {
          const news = { id: doc.id, ...doc.data() };
          newsData.push(news);
        });

        setNewsList(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();

  }, []);

  return (
    <div className='news-body'>
      <div className='news-header'></div>
      <div className="news-container">
        {newsList.map((news) => (
          <Link key={news.id} to={`/news/${news.id}`} className="news-item" style={{
            backgroundImage: news.imageUrls && news.imageUrls.length > 0 ? `url(${news.imageUrls[0]})` : 'none', // Check if imageUrl array exists and contains at least one URL
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}>
            <h1>{news.title}</h1>
            <p className='news-text'>{news.description.length > 100 ? `${news.description.substring(0, 50)}...` : news.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tours;
