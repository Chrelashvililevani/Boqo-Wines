import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from '@firebase/firestore';
import { firestore, auth } from './firebase'; // Import auth from firebase

function AddToCart({ wineId, showMessage, setShowMessage }) { // Pass showMessage and setShowMessage as props
    const [user, setUser] = useState(null); // State to store user data
    const [isAddedToCart, setIsAddedToCart] = useState(false); // State to track if item is already added to cart

    useEffect(() => {
        // Check if the user is already authenticated
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user); // Update user state
        });

        return () => {
            // Unsubscribe from the listener when component unmounts
            unsubscribe();
        };
    }, []);

    const addToCart = async () => {
        try {
            // Check if the user is logged in
            if (!user) {
                setShowMessage(true); // Show the message
                setTimeout(() => setShowMessage(false), 2000); // Hide the message after 5 seconds
                console.log('You need to log in to add items to your cart.');
                // Optionally, you can display a message or redirect the user to the login page
                return;
            }
    
            const userId = user.uid; // Get the user ID
            const quantity = 1; // Modify quantity as needed
    
            const newItemRef = doc(collection(firestore, 'wines-sold'));
            const newItemData = {
                userId: userId,
                wineId: wineId,
                quantity: quantity,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: "checking"
            };
            await setDoc(newItemRef, newItemData);
            console.log('New item added to cart successfully!');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };
                    
    return (
        <>
        <div>
            <button className='add-to-cart' onClick={addToCart}>კალათაში დამატება</button>
        </div>
        </>
    );
}

export default AddToCart;
