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

  async function setDailyAlarm() {
    if ("alarms" in navigator) {
        const alarmTime = new Date();
        alarmTime.setHours(22, 0, 0, 0); // Set to 9:00 PM
        await navigator.alarms.set("dailyReminder", {
            when: alarmTime.getTime(),
            periodInMinutes: 1440, // Repeat every 24 hours
        });
        console.log("Daily alarm set!");
    } else {
        console.log("Alarms API not supported.");
    }
}

setDailyAlarm();

  return (
    <html lang="en">
      <head>
      <link rel="preload" href="/_next/static/css/style.css" as="style" />
      </head>
       <link rel="manifest" href="/manifest.json" />
       <link rel="icon" href="/favicon.ico" />
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
