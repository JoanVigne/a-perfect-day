import { useState } from "react";
import Calendar from "react-calendar";

interface CalendarComponentProps {
  data: any;
  onDayClick: (value: Date) => void;
  formatDate: (date: Date) => string;
  tileClassName: ({ date }: { date: Date }) => string;
}
/* PAS ENCORE UTILISE MAIS PLUS INTELLIGENT D AVOIR UN CALENDAR UI */
const CalendarComponent: React.FC<CalendarComponentProps> = ({
  data,
  onDayClick,
  formatDate,
  tileClassName,
}) => {
  const [value, onChange] = useState<Date | null | [Date | null, Date | null]>(
    new Date()
  );
  return (
    <Calendar
      onChange={onChange}
      value={value}
      tileClassName={tileClassName}
      onClickDay={onDayClick}
    />
  );
};
