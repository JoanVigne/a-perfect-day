import React, { useState, useEffect } from "react";

export default function TemporaryMessage({
  message,
  type,
}: {
  message: string | null;
  type: string | "";
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

  return showMessage && <small className={type}>{message}</small>;
}
