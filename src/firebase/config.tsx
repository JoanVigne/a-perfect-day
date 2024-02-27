import { getApps, initializeApp } from "firebase/app";
/* import { getAnalytics } from "firebase/analytics"; */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase premiere version :
/* 
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
if (!firebase_app) {
  console.log("Firebase initialized successfully!");
} else {
  console.log("Firebase is already initialized.");
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebase_app;
const analytics = getAnalytics(app); 
// fetch données
const db = getFirestore();
export { app, db };*/

// deuxieme version :
/* let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
if (!firebase_app) {
  console.log("Firebase initialized successfully!");
} else {
  console.log("Firebase is already initialized.");
}
const app = initializeApp(firebaseConfig); // Cette ligne est redondante
export default firebase_app;
const db = getFirestore();
export {}; */

// troisieme version :
const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Récupérer l'instance de Firestore
const db = getFirestore();

export { firebaseApp, db };
// Vérifier si Firebase a déjà été initialisé et mis en cache localement
/* let firebaseCached = localStorage.getItem("firebaseInitialized");
let firebase_app;
if (!firebaseCached) {
  firebase_app = initializeApp(firebaseConfig);
  if (firebase_app) {
    localStorage.setItem("firebaseInitialized", "true");
    console.log("Firebase initialized successfully!");
  } else {
    console.error("Failed to initialize Firebase!");
  }
} else {
  console.log("Firebase is already initialized.");
}
 */
