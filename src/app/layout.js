'use client'
import { Merriweather} from "next/font/google";
// import "antd/dist/reset.css"; // Use reset.css for Ant Design v5+

import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";
import { useEffect, useState } from "react";

const font = Merriweather({
  subsets: ["latin"],
  weight: ['400']
})

export default function RootLayout({ children }) {

  const [inClient, setInClient] = useState(false);

  useEffect(() => {
    setInClient(true);
  }, []);


  return (
    <html lang="en">
      <head>
      <title>Reeda</title>
      <meta name="description" content="The Reading Assistant" />
      <meta name="google" content="notranslate" />
      <link rel="preload" href="/_next/static/css/style.css" as="style" />
      </head>
       <link rel="manifest" href="/manifest.json" />
       <link rel="icon" href="/favicon.ico" />
      <body className={`${font.className}`}>
        {inClient && <AppProvider>
          <Navbar />
          <div style={{marginTop: '68px'}}>
          {children}
          </div>
        </AppProvider>}
      </body>
    </html>
  );
}
