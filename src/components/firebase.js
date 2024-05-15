import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import { getAuth } from "firebase/auth"; // Import getAuth from the auth package


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY_238476539827496583275,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_238476539827496583275,
  databaseURL: process.env.REACT_APP_DATABASE_URL_238476539827496583275,
  projectId: process.env.REACT_APP_PROJECT_ID_238476539827496583275,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_238476539827496583275,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_238476539827496583275,
  appId: process.env.REACT_APP_APP_ID_238476539827496583275,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID_238476539827496583275
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize auth object

export { firestore, storage, auth }; // Export firestore, storage, and auth
