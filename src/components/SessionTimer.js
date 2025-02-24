import React, { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { bookSessionStorageKey } from "@/configs/variables";

export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
const SessionTimer = ({ onStopSession }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Get session start time from localStorage
    const sessionData = JSON.parse(localStorage.getItem(bookSessionStorageKey));
    const startTime = sessionData?.timestamp || Date.now();

    // Update timer every second
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStopSession = () => {
    localStorage.removeItem(bookSessionStorageKey);
    if (onStopSession) onStopSession();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "black",

          borderRadius: "20px",
          padding: "30px",
          height: "100vh",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "100vw",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            border: "4px solid #007AFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Clock
            size={60}
            color="#007AFF"
            style={{
              animation: "pulse 2s infinite",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1a1a1a",
            fontFamily: "monospace",
          }}
        >
          {formatTime(elapsedTime)}
        </div>

        <button
          onClick={handleStopSession}
          style={{
            backgroundColor: "#FF3B30",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s ease",
            ":hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <X size={20} />
          Stop Session
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default SessionTimer;
