'use client'

import { storage } from "@/app/utility";
import { getProfile } from "@/firebase/services/profileService";
import { createContext, useState, useContext, useEffect } from "react";

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Create Provider Component
export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState(null);
  const [nightModeOn, setNightModeOn] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [summaryOrFullText, setSummaryOrFullText] = useState("summary");
  const [showingSummaryOrFullText, setShowingSummaryOrFullText] = useState(null);
  const [selectedSessionNumberOfPages, setSelectedSessionNumberOfPages] = useState(1);




  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    if(!profile && storage.getItem('user')){
        getProfile(JSON.parse(storage.getItem('user')).email).then(res => {
            setProfile(res);
        });
    }
  }, [profile]);

  return (
    <AppContext.Provider value={{ profile, setProfile, isPremium, setIsPremium, nightModeOn, setNightModeOn,
    currentBook,
    setCurrentBook,
    summaryOrFullText, setSummaryOrFullText,
    selectedSessionNumberOfPages, setSelectedSessionNumberOfPages,
    showingSummaryOrFullText, setShowingSummaryOrFullText,
    books, setBooks
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 3️⃣ Custom Hook for Using Context
export const useAppContext = () => {
  return useContext(AppContext);
};
