import React from "react";
import "./icon.css";

interface Props {
  show: any;
  setShow: any;
}
const iconStyles = {
  marginLeft: "-15px",
  marginRight: "5px",
};

const IconOpen: React.FC<Props> = ({ show, setShow }) => {
  return (
    <img
      onClick={() => setShow(!show)}
      style={iconStyles}
      className={show ? "icon rotate-down" : "icon rotate-right"}
      src="/icon/arrow-down.png"
      alt="show"
    />
  );
};

export default IconOpen;
