"use client";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import React, { useEffect, useState } from "react";

const Page = () => {
  const slug = window.location.pathname.split("/").pop();
  console.log("slug", slug);
  const [thisChall, setThisChall] = useState<any>(null);

  useEffect(() => {
    getThisChall();
  }, []);

  const getThisChall = () => {
    const customchall = getItemFromLocalStorage("customChall");
    console.log("customChall", customchall);

    Object.values(customchall).map((chall: any) => {
      console.log(chall);
      if (chall.id === slug) {
        setThisChall(chall);
      }
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setThisChall({ ...thisChall, [key]: value });
  };

  function handleDeleteInput(key: string) {
    const { [key]: deleted, ...newChall } = thisChall;
    setThisChall(newChall);
    console.log("newChall", newChall);
  }

  return (
    <div>
      <h1>Page</h1>
      {thisChall && (
        <div className="challenge">
          <div>
            <h2>{thisChall.name}</h2>
            <p>{thisChall.description}</p>
          </div>
          <div className="additional-properties">
            {Object.entries(thisChall).map(([key, value]) => {
              if (key === "id") {
                return null;
              }
              return (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                  <button onClick={() => handleDeleteInput(key)}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
