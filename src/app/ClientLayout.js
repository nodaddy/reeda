// app/ClientLayout.js
"use client";
import { useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import SlideIn from "@/components/SlideIn";
import ReadingInterests from "@/components/ReadingInterests";
import { storage } from "./utility";
import { bookSessionStorageKey } from "@/configs/variables";
import SessionTimer from "@/components/SessionTimer";

export default function ClientLayout({ children, font }) {
  const [inClient, setInClient] = useState(false);
  const { profile } = useAppContext();

  useEffect(() => {
    setInClient(true);
  }, []);

  // Modern geometric background style with gradient effect
  const modernBackground = {
    position: "relative",
    backgroundColor: "#ffffff",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f0f4f8 100%)",
  };

  // Subtle geometric pattern overlay with more pronounced fading mask
  const geometricPattern = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(0, 112, 243, 0.015) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(77, 155, 255, 0.015) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
      linear-gradient(45deg, rgba(0, 112, 243, 0.008) 25%, transparent 25%, transparent 50%, rgba(0, 112, 243, 0.008) 50%, rgba(0, 112, 243, 0.008) 75%, transparent 75%, transparent)
    `,
    backgroundSize: "100% 100%, 100% 100%, 100% 100%, 80px 80px",
    backgroundAttachment: "fixed",
    opacity: 0.9,
    zIndex: 0,
    pointerEvents: "none",
    maskImage:
      "radial-gradient(ellipse at 50% 50%, black 25%, rgba(0,0,0,0.2) 45%, transparent 70%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at 50% 50%, black 25%, rgba(0,0,0,0.2) 45%, transparent 70%)",
  };

  // Modern grid overlay with subtle gradient mask
  const gridOverlay = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0, 112, 243, 0.015) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 112, 243, 0.015) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    backgroundAttachment: "fixed",
    opacity: 0.3,
    zIndex: 0,
    pointerEvents: "none",
    maskImage:
      "radial-gradient(ellipse at 50% 50%, black 15%, rgba(0,0,0,0.15) 35%, transparent 60%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at 50% 50%, black 15%, rgba(0,0,0,0.15) 35%, transparent 60%)",
  };

  // Content container to ensure content is above background elements
  const contentContainer = {
    position: "relative",
    zIndex: 1,
  };

  if (!inClient) return null;

  return (
    <html lang="en">
      <head>
        <title>Reeda</title>
        <meta name="description" content="The Reading Assistant" />
        <meta name="google" content="notranslate" />
        <link rel="preload" href="/_next/static/css/style.css" as="style" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ overflowY: "scroll" }} className={`${font.className}`}>
        {/* <Navbar /> */}

        {/* {profile && !profile?.onboarded ? (
          <ReadingInterests />
        ) : (
          <div style={modernBackground}> 
            <div style={contentContainer}>{children}</div>
          </div>
        )} */}

        <SlideIn />
      </body>
    </html>
  );
}
