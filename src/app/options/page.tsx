"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getItemFromLocalStorage } from "../../utils/localstorage";
import { sendToUsers } from "@/firebase/db/users";
import { getAuth, signOut } from "firebase/auth";

interface UserData {
  email: string;
  uid: string;
}

const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const router = useRouter();

  useEffect(() => {
    if (user == null || user?.uid == null || user?.uid == undefined) {
      return router.push("/connect");
    }
  }, []);

  const [messageChangeNickname, setMessageChangeNickname] = useState<
    string | boolean
  >(false);
  const [countChanges, setCountChanges] = useState(0);
  async function changeNickName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (countChanges >= 3) {
      return setMessageChangeNickname(
        "You changed your nickname too many times today, come back later !"
      );
    }
    const target = e.target as typeof e.target & {
      nickname: { value: string };
    };
    const newNickname = target.nickname.value;
    if (newNickname.length <= 0) {
      return setMessageChangeNickname("Longer nickname please");
    }
    const UI = getItemFromLocalStorage("users");
    if (newNickname === UI.nickname) {
      return setMessageChangeNickname("This is already your nickname !");
    }
    setCountChanges(countChanges + 1);

    const updatedUser = {
      ...(UI || "{}"),
      nickname: newNickname,
    };
    const sending = await sendToUsers(updatedUser, user.uid);
    if (!sending) {
      setMessageChangeNickname(sending);
      return;
    }
    localStorage.setItem("users", JSON.stringify(updatedUser));
    setMessageChangeNickname("Nickname updated");
  }
  function logOut() {
    let updatedUser;
    const TL = getItemFromLocalStorage("todayList");
    const UI = getItemFromLocalStorage("users");
    updatedUser = {
      ...(UI || "{}"),
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
    <main>
      <h1 style={{ textAlign: "center" }}>
        Options{" "}
        <button onClick={logOut} className="save">
          Log out
        </button>
      </h1>

      <div className="container">
        <div className="smaller-container">
          <form action="" onSubmit={changeNickName}>
            <label htmlFor="">Change your nickname</label>
            <input type="text" name="nickname" id="nickname" required />
            <input className="add" type="submit" value="Save" />
          </form>
          <p className="message-small">{messageChangeNickname}</p>
        </div>
      </div>
      {/*   <div className="container">
        <h2>Styles</h2>
        <select name="" id="">
          <option value="dark">dark</option>
          <option value="dark">white</option>
          <option value="dark">other</option>
        </select>
      </div> */}
      <Footer />
    </main>
  );
};

export default page;
