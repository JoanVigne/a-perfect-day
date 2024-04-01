import OpenIcon from "@/components/OpenIcon";
import TemporaryMessage from "@/components/TemporaryMessage";
import Link from "next/link";
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
}

const CardChallenge: React.FC<Props> = ({
  challenge,
  remove,
  removeConfirmation,
}) => {
  const [messageAdded, setMessageAdded] = useState("");
  const [toggleDetails, settoggleDetails] = useState("hidden");

  return (
    <li className="challenge">
      <div className="infos">
        {Object.entries(challenge).map(([key, value]) => {
          if (key === "name") {
            return <h4 key={key}>{value}</h4>;
          }
          return (
            <p key={key}>
              {key}: {value}
            </p>
          );
        })}
      </div>
      <div className="improvement-container">
        <Link href={`/improve/${challenge.id}`}>
          <div className="improvement">
            {challenge.selectedImprovement &&
              `${challenge.selectedImprovement}: 
            ${challenge[challenge.selectedImprovement]}
            `}
          </div>
        </Link>
      </div>
    </li>
  );
};

export default CardChallenge;
