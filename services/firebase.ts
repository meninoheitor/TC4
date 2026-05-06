// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyChmBnZ8Bbk5dlAZgQ0xdyYNurqYUo_bcQ",
    authDomain: "tech-challenge-fase-03-eedb4.firebaseapp.com",
    projectId: "tech-challenge-fase-03-eedb4",
    storageBucket: "tech-challenge-fase-03-eedb4.firebasestorage.app",
    messagingSenderId: "199027648248",
    appId: "1:199027648248:web:9ca59575d1a23c3b2f7d0d",
    measurementId: "G-DPN95EYYLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);