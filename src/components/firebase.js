import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "@firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth first
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Enable IndexedDB Persistence
enableIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Failed to enable persistence: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.error('Failed to enable persistence: Browser does not support it');
  }
});

// Initialize Storage
const storage = getStorage(app);

// Export firestore, storage, and auth
export { firestore, storage, auth };
