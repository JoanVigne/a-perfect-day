import React from "react";
import "./icon.css";
interface Props {
  nameImg: string;
  onClick: () => void;
}

const Icon = ({ nameImg, onClick }: Props) => {
  return (
    <img
      src={`/icon/${nameImg}.png`}
      alt={nameImg}
      className={nameImg + " icon"}
      onClick={onClick}
    />
  );
};

export default Icon;
