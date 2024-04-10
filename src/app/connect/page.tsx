import React from "react";
import Signin from "@/app/connect/Signin";
import Signup from "@/app/connect/Signup";

const page = () => {
  return (
    <div>
      <h1>Welcome !</h1>
      <h2>Connection</h2>
      <div className="container">
        <Signin />
      </div>

      <div className="container">
        <Signup />
      </div>
    </div>
  );
};

export default page;
