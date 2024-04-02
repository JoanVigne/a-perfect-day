import Link from "next/link";
import React, { useState } from "react";

interface Challenge {
  id: string;
  name: string;
  selectedImprovement: any;
  [key: string]: any;
}

interface Props {
  challenge: Challenge;
  remove: boolean;
  removeConfirmation: any;
}

const CardChallenge: React.FC<Props> = ({ challenge }) => {
  return (
    <li className="challenge">
      <div className="infos">
        {Object.entries(challenge).map(([key, value]) => {
          if (key === "name") {
            return <h3 key={key}>{value}</h3>;
          }
          if (key === "id" || key === "selectedImprovement") return null;
          else {
            return (
              <p key={key}>
                {key}: {value}
              </p>
            );
          }
        })}
      </div>
      <Link href={`/improve/${challenge.id}`} className="improvement">
        {challenge.selectedImprovement &&
        challenge.selectedImprovement.length > 0 ? (
          <ul>
            {challenge.selectedImprovement.map(
              (improvement: any, index: number) => (
                <li key={index}>
                  {Object.entries(challenge).map(([key, value]) => {
                    if (key === improvement) {
                      return (
                        <h3 key={key}>
                          {value} {key}
                        </h3>
                      );
                    } else {
                      return null;
                    }
                  })}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>Modify your challenge and select the value you wanna improve</p>
        )}
      </Link>
    </li>
  );
};

export default CardChallenge;
