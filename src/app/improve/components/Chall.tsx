"use client";
import TemporaryMessage from "@/components/TemporaryMessage";
import React, { useState } from "react";

interface Props {
  chall: Chall;
  updateCustomChall: any;
}
interface Chall {
  id: string;
  name: string;
  description: string;
  details: string;
  count: any;
  unit: any;
}
const Chall: React.FC<Props> = ({ chall, updateCustomChall }) => {
  const [toggleDetails, settoggleDetails] = useState("hidden");
  const [messageAdded, setMessageAdded] = useState("");
  function openDetails() {
    if (toggleDetails === "hidden") {
      settoggleDetails("active");
    } else {
      settoggleDetails("hidden");
    }
  }
  return (
    <li className="task" key={chall.id}>
      <div className="title-inputs">
        <h4>
          {chall.name}{" "}
          <button onClick={openDetails} className="details">
            ?
          </button>
          <TemporaryMessage message={messageAdded} type="message-small" />
        </h4>
        <img
          src="/add.png"
          alt="add"
          className="add-button"
          onClick={() => {
            updateCustomChall(chall), setMessageAdded("added !");
          }}
        />
      </div>
      <div className={toggleDetails}>
        <h4> {chall.description}</h4>
        <p> {chall.details}</p>
        <span className="remove">
          <img src="/red-bin.png" alt="remove" />
        </span>
      </div>
    </li>
  );
};

export default Chall;
