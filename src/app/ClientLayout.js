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
    backgroundColor: "#f8f9fa", // Light clean background
    background:
      "linear-gradient(165deg, rgba(255,255,255,1) 0%, rgba(248,249,250,1) 45%, rgba(248,249,250,1) 55%, rgba(255,255,255,1) 100%)",
  };

  // Subtle geometric pattern overlay with more pronounced fading mask
  const geometricPattern = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(135deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.03) 50%, rgba(0, 0, 0, 0.03) 75%, transparent 75%, transparent),
      linear-gradient(45deg, rgba(0, 0, 0, 0.02) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.02) 50%, rgba(0, 0, 0, 0.02) 75%, transparent 75%, transparent)
    `,
    backgroundSize: "80px 80px, 60px 60px",
    backgroundAttachment: "fixed",
    opacity: 0.55,
    zIndex: 0,
    pointerEvents: "none", // Makes the overlay non-interactive
    maskImage:
      "radial-gradient(ellipse at 60% 40%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at 60% 40%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)",
  };

  // Faint grid overlay with more pronounced non-centered gradient mask
  const gridOverlay = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    backgroundAttachment: "fixed",
    opacity: 0.6,
    zIndex: 0,
    pointerEvents: "none", // Makes the overlay non-interactive
    maskImage:
      "radial-gradient(ellipse at 45% 55%, black 20%, rgba(0,0,0,0.4) 40%, transparent 70%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at 45% 55%, black 20%, rgba(0,0,0,0.4) 40%, transparent 70%)",
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

        {profile && !profile?.onboarded ? (
          <ReadingInterests />
        ) : (
          <div style={modernBackground}>
            {/* Geometric pattern overlay */}
            <div style={geometricPattern}></div>

            {/* Grid overlay */}
            <div style={gridOverlay}></div>

            {/* Content container */}
            <div style={contentContainer}>{children}</div>
          </div>
        )}

        <SlideIn />
      </body>
    </html>
  );
}
