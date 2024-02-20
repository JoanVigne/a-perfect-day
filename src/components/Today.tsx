import React, { useEffect, useState } from "react";
import "./today.css";

interface TodayProps {
  list: ListItem;
}
interface ListItem {
  id: string;
  count: number;
  name: string;
  unit: string;
  description: string;
  details: string;
  // Ajoutez d'autres propriétés au besoin
}
const Today: React.FC<TodayProps> = ({ list }) => {
  return (
    <div className="today-list">
      <h2>today's list</h2>
      <ul>
        {Object.values(list).map((item) => (
          <li key={item.id} className="item">
            <div className="title-delete">
              {" "}
              <h3>{item.name}</h3> <span>x</span>
            </div>

            <p>
              <strong>Description:</strong> {item.description}
            </p>
            <p>
              <strong>Details:</strong> {item.details}
            </p>
            <p>
              <strong>Count:</strong> {item.count} {item.unit}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Today;
