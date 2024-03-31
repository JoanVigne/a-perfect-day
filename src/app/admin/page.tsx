import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const AdminPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome, Admin!</h1>

      <h1>Access denied. You are not an admin.</h1>
    </div>
  );
};

export default AdminPage;
