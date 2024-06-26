"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./cardChallenge.css";

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
interface Perf {
  [key: string]: any;
}

const CardChallenge: React.FC<Props> = ({ challenge }) => {
  const [perfOfThisChall, setPerfOfThisChall] = useState<any | null>(null);
  const [lastPerf, setLastPerf] = useState<any | null>(null);
  useEffect(() => {
    if (challenge.perf) {
      setPerfOfThisChall(challenge.perf);
    }
    if (perfOfThisChall) {
      setLastPerf(sortByDate(perfOfThisChall)[0]);
    }
  }, [challenge.perf, perfOfThisChall]);

  function sortByDate(performances: Perf | null) {
    if (!performances) return [];
    return Object.entries(performances)
      .filter(([_, day]) => day.date)
      .map(([date, day]) => ({ date, day }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(({ day }) => day);
  }

  return (
    <Link href={`/improve/${challenge.id}`}>
      <li className="challenge">
        <div className="infos">
          {Object.entries(challenge)
            .sort((a, b) => (a[0] === "name" ? -1 : b[0] === "name" ? 1 : 0))
            .map(([key, value]) => {
              if (key === "name") {
                return <h3 key={key}>{value}</h3>;
              }
              if (
                key === "id" ||
                key === "selectedImprovement" ||
                key === "perf"
              )
                return null;
              if (challenge.selectedImprovement.includes(key)) {
                return null;
              } else {
                return (
                  <p key={key}>
                    {key}: {value}
                  </p>
                );
              }
            })}
        </div>
        <div className="input-chosen">
          {challenge.selectedImprovement &&
          challenge.selectedImprovement.length > 0 ? (
            <ul>
              <h4>Last time :</h4>
              {challenge.selectedImprovement.map(
                (improvement: any, index: number) => (
                  <li key={index}>
                    {Object.entries(challenge).map(([key, value]) => {
                      if (key === improvement) {
                        return (
                          <div key={key}>
                            {key}: {lastPerf && lastPerf[improvement]}.
                          </div>
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
        </div>
      </li>
    </Link>
  );
};

export default CardChallenge;
