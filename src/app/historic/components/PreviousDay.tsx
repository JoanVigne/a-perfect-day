"use client";
import Link from "next/link";

import React from "react";

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
  return (
    <ul className="">
      {data &&
        Object.keys(data).map((d: string) => {
          return (
            <li key={d}>
              <Link href={`/historic/${d}`}>{d}</Link>
            </li>
          );
        })}
    </ul>
  );
};

export default PreviousDay;
