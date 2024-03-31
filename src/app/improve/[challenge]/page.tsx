"use client";
import { getItemFromLocalStorage } from "@/app/utils/localstorage";
import OpenIcon from "@/components/OpenIcon";
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
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      {thisChall && (
        <div className="challenge">
          <div>
            <h1> {thisChall.name}</h1>

            <h3>
              Value you are gonna improve :
              <select name="" id="">
                <option value="">{thisChall.selectedImprovement}</option>
                {Object.entries(thisChall).map(([key, value]) => {
                  if (
                    key === "id" ||
                    key === "name" ||
                    key === thisChall.selectedImprovement ||
                    key === "selectedImprovement"
                  ) {
                    return null;
                  }
                  return (
                    <>
                      <option value="">
                        {key}: {String(value)}
                      </option>
                    </>
                  );
                })}
              </select>
            </h3>
          </div>

          <h3>
            Modify this challenge
            <OpenIcon show={showForm} setShow={setShowForm} />
          </h3>

          <div className={showForm ? "cont-form active" : "cont-form hidden"}>
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
                    {key !== "name" && (
                      <button onClick={() => handleDeleteInput(key)}>
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
