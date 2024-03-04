import React from "react";
import Signin from "@/components/Signin";
import Signup from "@/components/Signup";

const page = () => {
  return (
    <div>
      <h1>Connection</h1>
      <Signin />

      <Signup />
    </div>
  );
};

export default page;
