import { Merriweather} from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/Navbar";
import BottomNav from "@/components/Menu";
import { AppProvider } from "@/context/AppContext";

const font = Merriweather({
  subsets: ["latin"],
  weight: ['400']
})

export const metadata = {
  title: "Reeda",
  description: "All things reading",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="preload" href="/_next/static/css/style.css" as="style" />
      </head>
       <link rel="manifest" href="/manifest.json" />
      <body className={`${font.className}`}>
        <AppProvider>
          <Navbar />
          <div style={{marginTop: '68px'}}>
          {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
