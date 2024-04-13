"use client";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import { useEffect, useState } from "react";

const page = () => {
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
    const customchall = getItemFromLocalStorage("workouts");
    Object.values(customchall).map((chall: any) => {
      if (chall.id === slug) {
        setThisChall(chall);
      }
    });
  };
  return <div></div>;
};

export default page;
