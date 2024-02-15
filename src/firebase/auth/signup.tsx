import firebase_app from "../config";
import { createUserWithEmailAndPassword, Auth, getAuth } from "firebase/auth";

const auth: Auth = getAuth(firebase_app);

interface SignUpResult {
  result: any; // Remplacez 'any' par le type approprié si vous savez quel est le type de résultat renvoyé par votre méthode createUserWithEmailAndPassword.
  error: any; // Remplacez 'any' par le type approprié si vous savez quel est le type d'erreur renvoyé par votre méthode createUserWithEmailAndPassword.
}

export default async function signUp(
  email: string,
  password: string
): Promise<SignUpResult> {
  let result: any = null,
    error: any = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    error = e;
  }

  return { result, error };
}
