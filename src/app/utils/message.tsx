import React, { useState, useEffect } from "react";

export default function TemporaryMessage({
  message,
}: {
  message: string | null;
}) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);

      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return showMessage && <small className="message-small">{message}</small>;
}

// Exemple d'utilisation :
