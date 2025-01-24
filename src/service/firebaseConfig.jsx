// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';  

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL00Pa0b5ku81OunZzQSMlgVqm-u1d1YE",
  authDomain: "aitravel-trip.firebaseapp.com",
  projectId: "aitravel-trip",
  storageBucket: "aitravel-trip.firebasestorage.app",
  messagingSenderId: "195115343121",
  appId: "1:195115343121:web:de0d4bf5df6e13a489c0b0",
  measurementId: "G-E4C4NMDP3D",
  databaseURL: "https://aitravel-trip-default-rtdb.firebaseio.com",  // Required for Realtime Database
};

// firebaseService.js

import { doc, getDoc } from 'firebase/firestore';

// Fetch data from Firestore
export const fetchDataFromFirebase = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log('Fetched data from Firebase:', docSnap.data()); // Log data
      return docSnap.data(); // Return user data
    } else {
      console.log('No such document!');
      return null; // If the document does not exist
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // If there was an error during fetch
  }
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Firestore instance
export const rtdb = getDatabase(app);  // Realtime Database instance if you plan to use it
