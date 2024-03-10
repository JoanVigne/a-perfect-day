import Link from "next/link";
import React from "react";
import "./footer.css";
import { getAuth, signOut } from "firebase/auth";
import { useAuthContext } from "@/context/AuthContext";
import { sendToUsers } from "@/firebase/db/users";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import { useRouter } from "next/navigation";

interface UserData {
  email: string;
  uid: string;
}

interface UserInfo {
  nickname: string;
  lists: { [key: string]: object };
  todayList: { [key: string]: object };
}
const Footer: React.FC<{ userInfo?: UserInfo }> = ({ userInfo }) => {
  const { user } = useAuthContext() as { user: UserData };
  const router = useRouter();
  function logOut() {
    if (!userInfo) {
      return;
    }
    let updatedUser;
    const TL = getItemFromLocalStorage("todayList");
    updatedUser = {
      ...(userInfo || "{}"),
      todayList: TL,
    };

    sendToUsers(updatedUser, user.uid);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("LOGGED OUT");
        /*  localStorage.clear(); */
        return router.push("/connect");
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
              {/*   <li>
                <button onClick={logOut}>Sign out</button>
              </li> */}
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
