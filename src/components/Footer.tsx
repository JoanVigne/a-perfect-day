import Link from "next/link";
import React from "react";
import "./footer.css";
import { getAuth, signOut } from "firebase/auth";
import { useAuthContext } from "@/context/AuthContext";

interface UserData {
  email: string;
  uid: string;
}
const Footer = () => {
  const { user } = useAuthContext() as { user: UserData };
  function logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("LOGGED OUT");

        localStorage.clear();
      })
      .catch((error) => {
        // An error happened.
        console.error("this error occured :", error);
      });
  }

  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link href="/">home</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href="/historic">historic</Link>
              </li>
              <li>
                {" "}
                <button onClick={logOut}>Sign out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="signin">sign in </Link>
              </li>
              <li>
                <Link href="signup">sign up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
