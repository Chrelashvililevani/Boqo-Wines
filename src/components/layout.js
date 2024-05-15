    import React, { useEffect, useState } from 'react';
    import { collection, query, where, getDocs, onSnapshot } from '@firebase/firestore';
    import { firestore, auth } from './firebase';
    import { Link } from 'react-router-dom';

    const Layout = () => {
    const [soldItems, setSoldItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isBoxVisible, setIsBoxVisible] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
        setUser(user);
        if (user) {
            fetchSoldItems(user.uid);
            const unsubscribeSoldItems = onSnapshot(
            query(collection(firestore, 'wines-sold'), where('userId', '==', user.uid), where('status', '==', 'sold')),
            snapshot => {
                const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                }));
                setSoldItems(items);
            },
            error => {
                console.error('Error fetching sold items:', error);
                setError(error.message);
                setIsLoading(false);
            }
            );
            return () => unsubscribeSoldItems();
        }
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchSoldItems = async (userId) => {
        try {
        setIsLoading(true);
        const soldItemsQuery = query(
            collection(firestore, 'wines-sold'),
            where('userId', '==', userId),
            where('status', '==', 'sold')
        );
        const querySnapshot = await getDocs(soldItemsQuery);
        const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setSoldItems(items);
        setIsLoading(false);
        } catch (error) {
        console.error('Error fetching sold items:', error);
        setError(error.message);
        setIsLoading(false);
        }
    };

    const toggleBoxVisibility = () => {
        setIsBoxVisible(!isBoxVisible);
    };

    // Check if there are sold items
    const hasSoldItems = !isLoading && soldItems.length > 0;

    // Calculate total quantity of bottles
    const totalQuantity = soldItems.reduce((total, item) => total + item.quantity, 0);

    // Log a message when the component is rendered
    console.log("Layout component rendered. Has sold items:", hasSoldItems);

    return (
        <>
        {user && (
            <div className="sold-items-container">
            {/* Conditional rendering of div box */}
            <div className={`sold-items-wrapper ${isBoxVisible ? '' : 'slide-left'}`}>
                {hasSoldItems && (
                <div className="sold-items-box">
                    <Link to="/my-wines" className="my-wines-link">
                    <div>
                    ჩემი ღვინოები: {totalQuantity} ბოთლი
                    </div>
                    </Link>
                    <div>
                    <button className="arrow-right-m" onClick={toggleBoxVisibility}>
                        {isBoxVisible ? '◀' : '▶'}
                    </button>
                    </div>
                </div>
                )}
            </div>
            </div>
        )}
        {error && <p>Error: {error}</p>}
        </>
    );
    };

    export default Layout;
