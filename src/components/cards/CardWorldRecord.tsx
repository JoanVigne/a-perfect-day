import React from "react";
import "./cardWorldRecord.css";
const CardWorldRecord = () => {
  return (
    <div>
      <div className="task-stat-container">
        <div className="hero task-stat-card">
          <h3>Ron Hill </h3>
          <img src="/photos/ron-hill.jpg" alt="photo of Ron Hill " />
          <p>categorie : Sport</p>
          <p>ran for 19,032 consecutive days.</p>
          <p>stats</p>
        </div>
        <div className="hero task-stat-card">
          <h3>Angus Barbieri</h3>
          <img src="/photos/Angus-Barbieri.jpg" alt="photo of Angus Barbieri" />
          <p>categorie : Health</p>
          <p>Didn't eat for 382 days</p>
          <p>stats</p>
        </div>
        {/*    <div className="hero task-stat-card">
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
        </div> */}
      </div>
    </div>
  );
};

export default CardWorldRecord;
