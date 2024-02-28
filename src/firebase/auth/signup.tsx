import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../config";
import { createUserWithEmailAndPassword, Auth, getAuth } from "firebase/auth";

const auth: Auth = getAuth(firebaseApp);
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

      const userData = {
        nickname: nickname,
        lists: {},
        todayList: {},
      };
      // les await se font un par un,
      // plus tard peut etre en parallele avec await Promise.all([setDoc(),setDoc(),])
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, userData);
      const historicRef = doc(db, "historic", userId);
      await setDoc(historicRef, {});
      const customRef = doc(db, "custom", userId);
      await setDoc(customRef, {});
    }
  } catch (e: any) {
    error = e;
  }

  return { result, error };
}
