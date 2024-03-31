"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Footer from "@/components/Footer";
import OpenIcon from "@/components/OpenIcon";
import React, { useEffect, useState } from "react";
import ModifyChallForm from "./components/ModifyChallForm";

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [thisChall, setThisChall] = useState<any>(null);

  useEffect(() => {
    const pathslug = window.location.pathname.split("/").pop();
    if (pathslug) {
      setSlug(pathslug);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      getThisChall();
    }
  }, [slug]);

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

  const inputChange = (key: string, value: string) => {
    setThisChall({ ...thisChall, [key]: value });
  };

  function deleteInput(key: string) {
    const { [key]: deleted, ...newChall } = thisChall;
    setThisChall(newChall);
    console.log("newChall", newChall);
  }
  function submitModify(e: any) {
    e.preventDefault();
    console.log("SUBMIT MODIFY", e);
  }

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
                    <option value="" key={key}>
                      {key}: {String(value)}
                    </option>
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
            <ModifyChallForm
              thisChall={thisChall}
              inputChange={inputChange}
              deleteInput={deleteInput}
              submitModify={submitModify}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Page;
