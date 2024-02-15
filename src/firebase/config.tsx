import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore } from "firebase/firestore";
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
// Initialize Firebase
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

async function fetchDataDB(collectionName: string) {
  const colRef = collection(db, collectionName);
  try {
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    console.log("Fetched", collectionName);
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching data from firestore:", error);
  }
}

async function fetchDataFromDBToLocalStorage(collectionName: string) {
  // verification session storage
  const dansLeLocalStorage = localStorage.getItem(collectionName);
  if (dansLeLocalStorage) {
    return JSON.parse(dansLeLocalStorage);
  }
  const colRef = collection(db, collectionName);
  try {
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    localStorage.setItem(collectionName, JSON.stringify(data));
    console.log("Fetched :", collectionName);
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
  }
}

export { fetchDataFromDBToLocalStorage, fetchDataDB };
