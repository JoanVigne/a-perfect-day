import React, { useEffect, useState } from "react";
import "./today.css";

interface TodayProps {
  list: any; // Remplacez "any" par le type approprié de votre liste
}
const Today: React.FC<TodayProps> = ({ list }) => {
  return (
    <>
      <ul>today's list</ul>
      <ul>{list && console.log(list)}</ul>
    </>
  );
};

export default Today;
