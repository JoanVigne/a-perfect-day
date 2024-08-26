"use client";
import React, { useState } from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [secretPassword, setSecretPassword] = useState<string>("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validateSecretPassword = (secretPassword: string) => {
    return secretPassword === process.env.SECRET_PASSWORD;
  };
  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      console.error("Invalid email address");
      return;
    }
    if (!validateSecretPassword(secretPassword)) {
      console.error("Invalid secret password");
      return;
    }
    const { result, error } = await signUp(email, password, nickname);
    if (error) {
      return console.log(error);
    }
    console.log(result);
    return router.push("/");
  };
  return (
    <div className="container-form">
      <form onSubmit={handleForm}>
        <h3>Sign up</h3>
        <label htmlFor="email">
          Email
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
          Password
          <input
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            name="password"
            id="password"
          />
        </label>

        <label htmlFor="nickname">
          Nickname
          <input
            onChange={(e) => setNickname(e.target.value)}
            type="text"
            name="nickname"
            id="nickname"
            required
          />
        </label>
        <label htmlFor="secretPassword">
          Secret password [ask an other user]
          <input
            onChange={(e) => setSecretPassword(e.target.value)}
            required
            type="text"
            name="secretPassword"
            id="secretPassword"
          />
        </label>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export default Signup;
