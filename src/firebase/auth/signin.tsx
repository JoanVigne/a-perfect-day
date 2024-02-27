import { firebaseApp } from "../config";
import { signInWithEmailAndPassword, Auth, getAuth } from "firebase/auth";

const auth: Auth = getAuth(firebaseApp);

interface SignInResult {
  result: any;
  error: any;
}

export default async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  let result: any = null,
    error: any = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    error = e;
  }

  return { result, error };
}
