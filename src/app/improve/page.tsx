import Footer from "@/components/Footer";
import React from "react";

const page = () => {
  return (
    <div>
      <h1>IMPROVE</h1>
      <div className="container">
        <p>here the list of the stuff you wanna improve</p>
        <ul>
          <li className="task">une task</li>
        </ul>
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
