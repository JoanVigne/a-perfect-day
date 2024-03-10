"use client";
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";

function Signin() {
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
    setErreur(false);
    setMessageErreur("");
    return router.push("/");
  };

  return (
    <div>
      <div className="container-form">
        <h2>Sign in</h2>
        <form onSubmit={handleForm}>
          <label htmlFor="newEmail">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="newEmail"
              id="newEmail"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="newPassword">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="newPassword"
              id="newPassword"
            />
          </label>
          <button type="submit" className="add">
            Sign in
          </button>
        </form>
      </div>

      {erreur && messageErreur}
    </div>
  );
}

export default Signin;
