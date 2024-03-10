import React, { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";
interface HeaderProps {
  nickname?: string; // Annoter le type de la propriété nickname
}
const Header: React.FC<HeaderProps> = ({ nickname }) => {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const [dateToday, setDateToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const monthName = months[month];
    const day = date.getDate();
    setDateToday(`${day} ${monthName} `);
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
