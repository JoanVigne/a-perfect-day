import React, { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";
interface HeaderProps {
  nickname?: string; // Annoter le type de la propriété nickname
}
const Header: React.FC<HeaderProps> = ({ nickname }) => {
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
    const month = date.getMonth() + 1;
    const monthName = months[month];
    const day = date.getDate();
    setDateToday(` ${monthName} ${day} `);
  }, []);
  return (
    <header>
      <p>{dateToday && dateToday}</p>
      {nickname ? nickname : ""}
      <Link href={"/options"}>
        <img src="./options.png" alt="options" className="options-logo" />
      </Link>
    </header>
  );
};

export default Header;
