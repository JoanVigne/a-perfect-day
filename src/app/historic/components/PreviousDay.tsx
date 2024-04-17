"use client";
import TemporaryMessage from "../../../components/ui/TemporaryMessage";
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
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const handleClick = (value: Date) => {
    const selectedDate = formatDate(value);
    const todayDate = formatDate(new Date());
    if (selectedDate === todayDate) {
      setMessage("Its today date");
      return;
    }
    if (selectedDate > todayDate) {
      setMessage("cannot change the futur !");
      return;
    }
    window.location.href = `/historic/${selectedDate}`;
  };
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={({ date }) =>
          `${data[formatDate(date)] ? "has-data" : ""} ${
            formatDate(date) === todayDate ? "today" : ""
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
