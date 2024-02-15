import firebase_app from "../config";
import { signInWithEmailAndPassword, Auth, getAuth } from "firebase/auth";

const auth: Auth = getAuth(firebase_app);

interface SignInResult {
  result: any; // Remplacez 'any' par le type approprié si vous savez quel est le type de résultat renvoyé par votre méthode signInWithEmailAndPassword.
  error: any; // Remplacez 'any' par le type approprié si vous savez quel est le type d'erreur renvoyé par votre méthode signInWithEmailAndPassword.
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
