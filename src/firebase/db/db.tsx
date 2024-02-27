import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { db } from "../config";

// fonction reutilisable pour voir certaines collections :
const checkDB = async (dbName: string, userId: string) => {
  const ref = doc(db, dbName, userId);
  const snapShot = await getDoc(ref);
  return { ref, snapShot };
};
async function fetchOnlyThisIdToLocalStorage(
  collectionName: string,
  thisID: string
) {
  const inLocalStorage = localStorage.getItem(collectionName);
  if (inLocalStorage) {
    return JSON.parse(inLocalStorage);
  }
  const colRef = collection(db, collectionName);
  try {
    const docRef = doc(colRef, thisID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      localStorage.setItem(collectionName, JSON.stringify(data));
      return data;
    } else {
      console.log("Nothing found with ID:", thisID);
      return null;
    }
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

export {
  checkDB,
  fetchOnlyThisIdToLocalStorage,
  fetchDataFromDBToLocalStorage,
  db,
};
