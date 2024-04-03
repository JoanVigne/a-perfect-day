import React from "react";

interface Props {
  show: any;
  setShow: any;
}
const iconStyles = {
  marginLeft: "10px",
};

const OpenIcon: React.FC<Props> = ({ show, setShow }) => {
  return (
    <img
      onClick={() => setShow(!show)}
      style={iconStyles}
      className={show ? "icon" : "icon rotate"}
      src="/icon/arrow-down.png"
      alt="show"
    />
  );
};

export default OpenIcon;
