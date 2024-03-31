import React, { useState, useEffect } from "react";

export default function TemporaryMessage({
  message,
  type,
}: {
  message: string | null;
  type: string | ""; // "message-small" ou "message-error"
}) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);

      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    showMessage && (
      <span className={"temporary-message " + type}>{message}</span>
    )
  );
}
