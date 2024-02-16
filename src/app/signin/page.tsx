"use client";
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [erreur, setErreur] = useState<boolean>(false);
  const [messageErreur, setMessageErreur] = useState<string>("");

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const { result, error } = await signIn(email, password);
    if (error instanceof Error) {
      setErreur(true);
      setMessageErreur(error.message);
      return console.log(error);
    }
    console.log(result);
    setErreur(false);
    setMessageErreur("");
    return router.push("/");
  };
  /* function logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("LOGGED OUT");
        sessionStorage.clear();
      })
      .catch((error) => {
        // An error happened.
        console.error("this error occured :", error);
      });
  } */
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h1 className="mt-60 mb-30">Sign in</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <button type="submit">Sign in</button>
        </form>
      </div>

      {erreur && messageErreur}
    </div>
  );
}

export default Page;
