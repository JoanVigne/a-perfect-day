"use client";
import React, { useState } from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const router = useRouter();

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const { result, error } = await signUp(email, password, nickname);
    if (error) {
      return console.log(error);
    }
    console.log(result);
    return router.push("/");
  };
  return (
    <div>
      <div className="container-form">
        <h2>Sign up</h2>
        <form onSubmit={handleForm}>
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
            />
          </label>
          <label htmlFor="nickname">
            <p>Nickname</p>
            <input
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              name="nickname"
              id="nickname"
              required
            />
          </label>
          <button type="submit" className="add">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
