import React from "react";
import "./button.css";

interface Props {
  className?: string;
  type?: "button" | "submit" | "reset";
  value: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<Props> = ({ className, value, onClick, type }) => {
  return (
    <button className={className} onClick={onClick} type={type}>
      {value}
    </button>
  );
};

export default Button;
