import TemporaryMessage from "@/components/TemporaryMessage";
import React, { useState } from "react";

interface Challenge {
  id: string;
  name: string;
  description: string;
  details: string;
  [key: string]: any;
}

interface Props {
  challenge: Challenge;
  remove: boolean;
  removeConfirmation: any;
  handleAddChall: any;
}

const ChallengeDisplay: React.FC<Props> = ({
  challenge,
  remove,
  removeConfirmation,
  handleAddChall,
}) => {
  const [messageAdded, setMessageAdded] = useState("");
  const [toggleDetails, settoggleDetails] = useState("hidden");

  function openDetails() {
    if (toggleDetails === "hidden") {
      settoggleDetails("active");
    } else {
      settoggleDetails("hidden");
    }
  }

  return (
    <li className="challenge">
      <div className="title-inputs">
        <h4>
          {challenge.name}{" "}
          <button onClick={openDetails} className="details">
            ?
          </button>
          <TemporaryMessage message={messageAdded} type="message-small" />
        </h4>
        <img
          src="/add.png"
          alt="add"
          className="add-button"
          onClick={() => {
            handleAddChall(challenge), setMessageAdded("added !");
          }}
        />
      </div>
      <div className={toggleDetails}>
        <h4>{challenge.description}</h4>
        <p>{challenge.details}</p>
        <div className="additional-properties">
          {Object.entries(challenge).map(([key, value]) => {
            if (
              key !== "id" &&
              key !== "name" &&
              key !== "description" &&
              key !== "details"
            ) {
              return (
                <p key={key}>
                  {key}: {value}
                </p>
              );
            } else {
              return null;
            }
          })}
        </div>
        {remove && (
          <span className="remove">
            <img src="/red-bin.png" alt="remove" onClick={removeConfirmation} />
          </span>
        )}
      </div>
    </li>
  );
};

export default ChallengeDisplay;
