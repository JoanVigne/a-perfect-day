import React, { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";
import { getItemFromLocalStorage } from "@/utils/localstorage";
import Icon from "./ui/Icon";

interface UserInfo {
  nickname: string;
  lists: { [key: string]: object };
  todayList: { [key: string]: object };
}

const Header = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const users = getItemFromLocalStorage("users");
    if (!users) {
      console.log("No user in local storage");
    } else {
      setUserInfo(users);
    }
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [dateToday, setDateToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const month = date.getMonth();
    const monthName = months[month];
    const day = date.getDate();
    setDateToday(` ${monthName} ${day} `);
  }, []);
  return (
    <header>
      <Icon nameImg="back" onClick={() => window.history.back()} />
      <p>{dateToday && dateToday}</p>
      <h2>{userInfo?.nickname}</h2>
      <Link href={"/options"}>
        <Icon nameImg="options" onClick={() => null} />
      </Link>
    </header>
  );
};

export default Header;
