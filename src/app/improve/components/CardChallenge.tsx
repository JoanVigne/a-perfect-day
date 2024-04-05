"use client";
import { set } from "firebase/database";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  const [perfOfThisChall, setPerfOfThisChall] = useState<any | null>(null);
  const [lastPerf, setLastPerf] = useState<any | null>(null);
  useEffect(() => {
    if (challenge.perf) {
      setPerfOfThisChall(challenge.perf);
    }
    if (perfOfThisChall) {
      setLastPerf(findLast());
      console.log(findLast());
      console.log("find biggest :", findBiggest());
    }
  }, [challenge.perf, perfOfThisChall]);

  function findLast() {
    // find the last in date of the perf
    let last = "0000-01-01";
    let lastDate = "";
    const today = new Date().toISOString().slice(0, 10);
    for (const date of Object.keys(perfOfThisChall)) {
      if (date > last && date <= today) {
        last = date;
        lastDate = date;
      }
    }
    return perfOfThisChall[lastDate];
  }
  // A REFAIRE QUAND ON AURA DES DATAS
  function findBiggest() {
    let biggest = 0;

    Object.values(perfOfThisChall).forEach((perf: any) => {
      if (Object.values(perfOfThisChall).length <= 1) {
        console.log("il n'y a qu'une date");
        console.log("perf", perf);
        return perf;
      }
      console.log(perf);
    });
  }
  function findLowest() {
    let lowest = 0;
    Object.values(perfOfThisChall).forEach((perf: any) => {
      if (Object.values(perfOfThisChall).length <= 1) {
        console.log("il n'y a qu'une date");
        console.log("perf", perf);
        return perf;
      }
      console.log(perf);
    });
  }
  return (
    <li className="challenge">
      <div className="infos">
        {Object.entries(challenge)
          .sort((a, b) => (a[0] === "name" ? -1 : b[0] === "name" ? 1 : 0))
          .map(([key, value]) => {
            if (key === "name") {
              return <h3 key={key}>{value}</h3>;
            }
            if (key === "id" || key === "selectedImprovement" || key === "perf")
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
      <Link href={`/improve/${challenge.id}`} className="input-chosen">
        {challenge.selectedImprovement &&
        challenge.selectedImprovement.length > 0 ? (
          <ul>
            {challenge.selectedImprovement.map(
              (improvement: any, index: number) => (
                <li key={index}>
                  {Object.entries(challenge).map(([key, value]) => {
                    if (key === improvement) {
                      return (
                        <div key={key}>
                          {lastPerf && (
                            <>
                              <h4>{key}</h4>
                              {lastPerf[key]}
                            </>
                          )}
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
      </Link>
    </li>
  );
};

export default CardChallenge;
