"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    window.dispatchEvent(new Event("cookie-consent-granted"));
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      right: 20,
      background: "#111",
      color: "#fff",
      padding: "16px",
      borderRadius: "12px",
      zIndex: 9999,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px"
    }}>
      <span style={{ fontSize: "14px" }}>
        We use cookies to improve your experience.
      </span>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={reject} style={{
          background: "transparent",
          border: "1px solid #555",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "8px"
        }}>
          Reject
        </button>

        <button onClick={accept} style={{
          background: "#e11d48",
          border: "none",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "8px"
        }}>
          Accept
        </button>
      </div>
    </div>
  );
}