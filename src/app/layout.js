'use client'
import { Merriweather } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientLayout from "./ClientLayout";

const font = Merriweather({
  subsets: ["latin"],
  weight: ['400']
});

export default function RootLayout({ children }) {
  return (
    <AppProvider>
      <ClientLayout font={font}>{children}</ClientLayout>
    </AppProvider>
  );
}