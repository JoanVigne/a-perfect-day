import React from "react";
import "./icon.css";
interface Props {
  nameImg: string;
  onClick: () => void | null;
}

const Icon = ({ nameImg, onClick }: Props) => {
  return (
    <img
      src={`/icon/${nameImg}.png`}
      alt={nameImg}
      className={"icon " + nameImg}
      onClick={onClick}
    />
  );
};

export default Icon;
