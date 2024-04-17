import TemporaryMessage from "@/components/ui/TemporaryMessage";
import React, { useState } from "react";
import Calendar from "react-calendar";
import FormModifyPreviousDays from "./FormModifyPreviousDays";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
  thisChall: { [shortDate: string]: any };
}

/* CALENDAR + FORM CHANGE PAST DAYS */
const CalendarChall: React.FC<Props> = ({ thisChall }) => {
  // calendar :
  const [value, onChange] = useState<Value>(new Date());

  const [message, setMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date();
  const todayDate = makeDateForReactCalendarFormat(today);

  const dayClick = (value: Date) => {
    const thisDayDate = makeDateForReactCalendarFormat(value);
    const date = new Date(
      Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
    ).toISOString();

    const todayDate = new Date().toISOString().split("T")[0];
    if (thisDayDate === todayDate) {
      setMessage("You can change today perfs in the previous section.");
      return;
    }
    if (thisDayDate > todayDate) {
      setMessage("cannot change the futur !");
      return;
    }
    setModal(true);
    // here i would like a friendly date format
    setSelectedDate(date);
  };

  return (
    <div>
      {modal && (
        <FormModifyPreviousDays thisChall={thisChall} thisDay={selectedDate} />
      )}
      <Calendar
        value={value}
        onChange={onChange}
        onClickDay={dayClick}
        tileClassName={({ date }) =>
          `${
            thisChall.perf &&
            thisChall.perf[makeDateForReactCalendarFormat(date)] &&
            Object.keys(thisChall.perf[makeDateForReactCalendarFormat(date)])
              .length > 0
              ? "has-data"
              : ""
          } ${
            makeDateForReactCalendarFormat(date) === todayDate ? "today" : ""
          }`
        }
      />
      <TemporaryMessage message={message} type="message-info" timeInMS={4000} />
    </div>
  );
};

export default CalendarChall;
function makeDateForReactCalendarFormat(date: any) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  const thisDate = `${year}-${formattedMonth}-${formattedDay}`;
  return thisDate;
}
