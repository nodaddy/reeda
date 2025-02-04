import { Merriweather} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import BottomNav from "@/components/Menu";

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
      </head>
       <link rel="manifest" href="/manifest.json" />
      <body className={`${font.className}`}>
        <Navbar />
        <div style={{marginTop: '68px'}}>
        {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
