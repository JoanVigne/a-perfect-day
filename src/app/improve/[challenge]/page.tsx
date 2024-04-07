"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import FormModifyChall from "./components/FormModifyChall";
import FormImproved from "./components/FormImproved";
import CalendarChall from "./components/CalendarChall";
import ShowPerfs from "./components/ShowPerfs";

const Page = () => {
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
    Object.values(customchall).map((chall: any) => {
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

  return (
    <div>
      {thisChall && (
        <div className="">
          <h1> {thisChall.name}</h1>

          <div className="container">
            <h2>I improved !</h2>
            <FormImproved thisChall={thisChall} />
          </div>
          <div className="container">
            <ShowPerfs thisChall={thisChall} />
          </div>
          <div className="container">
            <CalendarChall thisChall={thisChall} />
          </div>
          <div className="container">
            <div>
              <FormModifyChall
                thisChall={thisChall}
                inputChange={inputChange}
                deleteInput={deleteInput}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Page;
