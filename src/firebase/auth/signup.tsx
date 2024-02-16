import { doc, getFirestore, setDoc } from "firebase/firestore";
import firebase_app from "../config";
import { createUserWithEmailAndPassword, Auth, getAuth } from "firebase/auth";

const auth: Auth = getAuth(firebase_app);
const db = getFirestore();

interface SignUpResult {
  result: any;
  error: any;
}

export default async function signUp(
  email: string,
  password: string,
  nickname: string
): Promise<SignUpResult> {
  let result: any = null,
    error: any = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    if (result && result.user) {
      const userId = result.user.uid;
      const userRef = doc(db, "users", userId);
      const userData = {
        nickname: nickname,
        "tasks-custom": [],
        "tasks-list": {
          common: [],
          custom: [],
        },
        "tasks-today": {
          date: new Date().toISOString(),
          tasks: [],
        },
      };

      await setDoc(userRef, userData);
    }
  } catch (e: any) {
    error = e;
  }

  return { result, error };
}
