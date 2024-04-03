"use client";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import ContainerChallenges from "./components/ContainerChallenges";
import Link from "next/link";
import Header from "@/components/Header";

interface UserData {
  email: string;
  uid: string;
}

const page = () => {
  const { user } = useAuthContext() as { user: UserData };
  const [message, setMessage] = useState("");

  return (
    <div>
      <Header />
      <h1>IMPROVE</h1>
      <div className="container">
        <h2>My Challenges</h2>
        <ContainerChallenges userId={user?.uid} />
      </div>

      <div className="container">
        <p>LIENS VERS charts of progression of stuff improvement</p>
      </div>

      <div className="container">
        <h2>MY Exemples</h2>
        <div className="task-stat-container">
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
        </div>
      </div>
      <div className="container">
        <h2>World class heros</h2>
        <div className="task-stat-container">
          <div className="hero task-stat-card">
            <h3>Ron Hill </h3>
            <img src="" alt="photo" />
            <p>categorie : Sport</p>
            <p>ran for 19,032 consecutive days.</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>autre </h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
          <div className="hero task-stat-card">
            <h3>nom</h3>
            <img src="" alt="photo" />
            <p>exploit</p>
            <p>stats</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
