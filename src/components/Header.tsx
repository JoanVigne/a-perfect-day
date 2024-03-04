import React, { useEffect, useState } from "react";
import "./header.css";
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
      {nickname && nickname}
      <img src="./options.png" alt="options" className="options-logo" />{" "}
    </header>
  );
};

export default Header;
