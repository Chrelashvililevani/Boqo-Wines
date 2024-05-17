import React, { useState, useEffect } from 'react';
import { firestore, auth } from './firebase';
import 'firebase/auth';
import 'firebase/firestore'; // or any other Firebase services you need
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const RegisterUser = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        nickname: '',
        email: '',
        phone: '',
        password: '',
        day: '',
        month: '',
        year: ''
    });
    const [user, setUser] = useState(null); // State to store user data
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const [isRegistering, setIsRegistering] = useState(true); // State to toggle between registration and authentication forms



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClose = () => {
        console.log("Close button clicked");
        onClose(); // Call onClose function
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, surname, nickname, email, phone, password, day, month, year } = formData;

        // Parse the birthdate into a Date object, adjusting the day by adding 1
        const birthDate = new Date(year, month - 1, parseInt(day) + 1);

        // Format the birthdate as YYYY-MM-DD
        const formattedBirthDate = birthDate.toISOString().split('T')[0];

        // Calculate age
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 18) {
            alert("You must be 18 years or older to register.");
            return;
        }

        try {
            // Register user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            await setDoc(doc(firestore, "users", user.uid), {
                name: name,
                surname: surname,
                nickname: nickname,
                email: email,
                phone: phone,
                birthDate: formattedBirthDate, // Store formatted birthdate
            });

            alert('Registration successful!');
            onClose(); // Close the registration window

        } catch (error) {
            console.error("Error registering user:", error);
            alert(`Registration failed: ${error.message}`);
        }
    };

    const handleAuthentication = async (e) => {
        e.preventDefault();
    
        const { email, password } = formData;
    
        try {
            // Sign in user with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Set authentication persistence to 'local'
            await auth.setPersistence(browserLocalPersistence);
    
            // If authentication is successful, you can optionally perform further actions
            console.log("User successfully authenticated");
    
            // Clear form data
            setFormData({
                ...formData,
                email: '',
                password: ''
            });
    
            // Close the authentication window or perform any other action
            onClose(); // Close the authentication window
        } catch (error) {
            console.error("Error authenticating user:", error);
            alert(`Authentication failed: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Update user state to null
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Function to generate an array of numbers within a range
    const generateRange = (start, end) => {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    useEffect(() => {
        // Disable scrolling on the body element when the registration window is open
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'hidden'; // Add this line to prevent horizontal scrolling

        // Check if the user is already authenticated
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user); // Update user state
            if (user) {
                // Fetch additional user details if user is authenticated
                const fetchUserDetails = async () => {
                    const userDetailsDoc = await getDoc(doc(firestore, 'users', user.uid));
                    setUserDetails(userDetailsDoc.data());
                };
                fetchUserDetails();
            }
        });

        return () => {
            // Re-enable scrolling on the body element when the registration window is closed
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden'; // Add this line to re-enable horizontal scrolling
            
            // Unsubscribe from the listener when component unmounts
            unsubscribe();
        };
    }, []);
    const toggleForm = () => {
        setIsRegistering(prevState => !prevState); // Toggle between registration and authentication forms
    };

    
    return (
        <>
            <div className='registerUser-content'>
                <button className="close-button-black" onClick={handleClose}>X</button> {/* Close button */}
                <div className='reg-cont-div'>
                    <div className='resolution-reg-au'><img src='https://firebasestorage.googleapis.com/v0/b/boqo-wines.appspot.com/o/images%2Faboutus-b.jpg?alt=media&token=dae74ef0-70da-4d67-8e6b-217133cffd1e' className='image-reg'></img></div>
                {user ? ( // Render user info if user is logged in
                    <div className='user-info'>
                        <p>სახელი: {userDetails && userDetails.name}</p> {/* Display user's name */}
                        <p>გვარი: {userDetails && userDetails.surname}</p> {/* Display user's surname */}
                        <p>ელექტრონული ფოსტა: {user.email}</p> {/* Display user's email */}
                        <p>მეტსახელი: {userDetails && userDetails.nickname}</p> {/* Display user's nickname */}
                        <p>მობილურის ნომერი: {userDetails && userDetails.phone}</p> {/* Display user's phone */}
                        <p>დაბადების თარიღი: {userDetails && userDetails.birthDate}</p> {/* Display user's birthdate */}
                        <button onClick={handleLogout} type="submit">Logout</button> {/* Logout button */}
                        {/* You can display more user information if needed */}
                    </div>
                ) : (
                    <>
                {isRegistering ? ( // Render registration form if isRegistering is true
                <div className='authentication'>
                    <h2>ავტორიზაცია</h2>
                    <form onSubmit={handleAuthentication}>
                        {/* Authentication form inputs */}
                        <label htmlFor="email">ელ. ფოსტა:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/><br/>

                        <label htmlFor="password">პაროლი:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/><br/>
                        <button type="submit">ავტორიზაცია</button>
                        <p onClick={toggleForm} style={{ cursor: 'pointer'}}>არ გაქვს ექაუნთი?</p>
                    </form>
                </div>
                ) : (
                <div className='registration'>
                    <h2>მომხმარებლის რეგისტრაცია</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">სახელი:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/><br/>

                        <label htmlFor="surname">გვარი:</label>
                        <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required/><br/>

                        <label htmlFor="nickname">მეტსახელი:</label>
                        <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} required/><br/>

                        <label htmlFor="email">ელ. ფოსტა:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/><br/>

                        <label htmlFor="phone">მობილურის ნომერი:</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required/><br/>

                        <label htmlFor="password">პაროლი:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/><br/>

                        <label htmlFor="day">დაბადების თარიღი:</label>
                        <div className='day-month-year'>
                            <select id="day" name="day" value={formData.day} onChange={handleChange} required>
                                <option value="">დღე</option>
                                {generateRange(1, 31).map(day => <option key={day} value={day}>{day}</option>)}
                            </select><br/>

                            <select id="month" name="month" value={formData.month} onChange={handleChange} required>
                                <option value="">თვე</option>
                                {generateRange(1, 12).map(month => <option key={month} value={month}>{month}</option>)}
                            </select><br/>

                            <select id="year" name="year" value={formData.year} onChange={handleChange} required>
                                <option value="">წელი</option>
                                {generateRange(1980, new Date().getFullYear()).map(year => <option key={year} value={year}>{year}</option>)}
                            </select><br/>
                        </div>

                        <button type="submit">რეგისტრაცია</button>
                        <p onClick={toggleForm} style={{ cursor: 'pointer' }}>გააქვს ექაუნთი?</p>
                    </form>
                </div>
                )}

                </>
                )}
                </div>
            </div>
        </>
    );
};

export default RegisterUser;
