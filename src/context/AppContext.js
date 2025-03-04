"use client";

import { storage } from "@/app/utility";
import { priColor } from "@/configs/cssValues";
import { bookSessionStorageKey } from "@/configs/variables";
import { getProfile } from "@/firebase/services/profileService";
import { doc } from "firebase/firestore";
import { createContext, useState, useContext, useEffect } from "react";

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Create Provider Component
export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState(null);

  const [currentSessionBook, setCurrentSessionBook] = useState(
    JSON.parse(storage.getItem(bookSessionStorageKey))
  );

  const [nightModeOn, setNightModeOn] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const [summaryOrFullText, setSummaryOrFullText] = useState("summary");
  const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false);
  const [wishlistBooks, setWishlistBooks] = useState([]);

  const [showingSummaryOrFullText, setShowingSummaryOrFullText] =
    useState(null);
  const [selectedSessionNumberOfPages, setSelectedSessionNumberOfPages] =
    useState(1);
  const [slideIn, setSlideIn] = useState(false);
  const [slideInContent, setSlideInContent] = useState(null);

  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    if (!profile && storage.getItem("user")) {
      getProfile(JSON.parse(storage.getItem("user")).email).then((res) => {
        setProfile(res);
      });
    }
  }, [profile]);

  useEffect(() => {
    if (currentSessionBook && books && books[0].id !== currentSessionBook.id) {
      // bring the book to the front
      const index = books.findIndex(
        (book) => book.id === currentSessionBook.id
      );
      if (index !== -1) {
        const updatedBooks = [...books];
        updatedBooks.splice(index, 1);
        updatedBooks.unshift(currentSessionBook);
        setBooks(updatedBooks);
      }

      // and horizontally scroll the elemetn to the leftmost position in a smooth way
      document
        .getElementById("continue-reading-div")
        .scroll({ left: 0, behavior: "smooth" });
    }
  }, [currentSessionBook, books]);

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        isPremium,
        setIsPremium,
        nightModeOn,
        setNightModeOn,
        currentBook,
        setCurrentBook,
        summaryOrFullText,
        setSummaryOrFullText,
        selectedSessionNumberOfPages,
        setSelectedSessionNumberOfPages,
        showingSummaryOrFullText,
        setShowingSummaryOrFullText,
        books,
        setBooks,
        slideIn,
        setSlideIn,
        slideInContent,
        setSlideInContent,
        isAddBookModalVisible,
        setIsAddBookModalVisible,
        wishlistBooks,
        setWishlistBooks,
        currentSessionBook,
        setCurrentSessionBook,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 3️⃣ Custom Hook for Using Context
export const useAppContext = () => {
  return useContext(AppContext);
};
