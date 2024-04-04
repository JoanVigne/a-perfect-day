import React, { useState, useEffect } from "react";
import "./TemporaryMessage.css";

export default function TemporaryMessage({
  message,
  type,
  timeInMS, // 5000
}: {
  message: string | null;
  type: string | ""; // message-error // message-success // message-info // message-warning
  timeInMS: number;
}) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);

      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, timeInMS);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <span
      className={`temporary-message ${type} ${
        showMessage ? "visible" : "invisible"
      }`}
    >
      {message}
    </span>
  );
}
