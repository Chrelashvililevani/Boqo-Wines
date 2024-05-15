
import React from 'react';
import { doc, setDoc } from '@firebase/firestore';
import { firestore } from './firebase';

function AddToCart({ wineId }) {
    const addToCart = async () => {
        try {
            const userId = 'user-id'; // Replace with actual user ID
            const quantity = 1; // Modify quantity as needed

            const cartItem = {
                userId: userId,
                wineId: wineId,
                quantity: quantity
            };

            await setDoc(doc(firestore, 'wines-sold', `${userId}_${wineId}`), cartItem);
            
            console.log('Item added to cart successfully!');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    return (
        <button className='add-to-cart' onClick={addToCart}>კალათაში დამატება</button>
    );
}

export default AddToCart;
