"use client";
import TemporaryMessage from "../../../components/TemporaryMessage";
import Link from "next/link";

import React, { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
interface Task {
  id: string;
  name: string;
  description: string;
  details: string;
  unit: string | boolean;
  count: string | number;
}

interface DayData {
  date: string;
  [activityId: string]: Task | any;
}

interface Props {
  date: string;
  data: { [shortDate: string]: DayData };
}

const PreviousDay: React.FC<Props> = ({ date, data }) => {
  // calendar :
  const [value, onChange] = useState<Value>(new Date());
  //
  const [message, setMessage] = useState<string | null>(null);
  const handleClick = (value: Date) => {
    const selectedDate = value.toISOString().split("T")[0];
    const todayDate = new Date().toISOString().split("T")[0];

    if (selectedDate === todayDate) {
      setMessage("Its today date");
      return;
    }
    if (selectedDate > todayDate) {
      setMessage("cannot change the futur !");
      return;
    }

    const formattedDate = value.toISOString().split("T")[0];
    window.location.href = `/historic/${formattedDate}`;
  };
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={({ date }) =>
          `${data[date.toISOString().split("T")[0]] ? "has-data" : ""} ${
            date.toISOString().split("T")[0] === todayDate ? "today" : ""
          }`
        }
        onClickDay={(value) => handleClick(value)}
      />
      <TemporaryMessage
        message={message}
        type="message-error"
        timeInMS={3000}
      />
    </div>
  );
};

export default PreviousDay;
