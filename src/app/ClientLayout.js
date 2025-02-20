// app/ClientLayout.js
'use client'
import { useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function ClientLayout({ children, font }) {
  const [inClient, setInClient] = useState(false);
  const { nightModeOn } = useAppContext();

  useEffect(() => {
    setInClient(true);
  }, []);

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
      <body style={{overflowY: 'scroll'}} className={`${font.className}`}>
        {/* <Navbar /> */}
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}