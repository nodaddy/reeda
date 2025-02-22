"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { searchByTitle } from "@/googleBooks";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { storage } from "@/app/utility";
import { isUserPremium } from "@/payments/playstoreBilling";
import { streakMaintenanceIntervalInSeconds } from "@/configs/variables";
import StreakCard from "@/components/StreakCard";
import BookList from "@/components/BookList";
import ContinueReadingCard from "@/components/ContinueReading";
import NextBooksToRead from "@/components/NextBooksToRead";
import BottomNav from "@/components/Menu";
import { motion } from "framer-motion";
import { priColor, secTextColor } from "@/configs/cssValues";
import { BookOpen } from "lucide-react";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  const { profile, setProfile, books, setIsPremium } = useAppContext();

  useEffect(() => {
    searchByTitle("harry potter").then((res) => console.log(res));

    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) =>
          console.log("Service Worker registered:", registration)
        )
        .catch((err) =>
          console.log("Service Worker registration failed:", err)
        );
    }
  }, []);

  useEffect(() => {
    if (profile?.streak?.lastPageScanTimestamp) {
      const now = Date.now();
      const lastPageScanTimestamp = profile.streak.lastPageScanTimestamp;
      const difference = Math.ceil((now - lastPageScanTimestamp) / 1000);

      if (difference > 84600) {
        const updateData = {
          ...profile,
          streak: {
            ...profile.streak,
            days:
              profile.streak.days > profile.streak.longestStreak
                ? 0
                : profile.streak.days,
          },
        };
        updateProfile(JSON.parse(storage.getItem("user")).email, updateData);
      }

      setLastPageScanDifference(difference);
    }
  }, [profile]);

  useEffect(() => {
    isUserPremium()
      .then((result) => setIsPremium(result))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userId = JSON.parse(storage.getItem("user")).email;
        if (userId) {
          const profileData = await getProfile(userId);
          setProfile(profileData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ overflow: "scroll" }}
      >
        <StreakCard
          isPremium={false}
          streak={profile?.streak}
          isActive={
            lastPageScanDifference < streakMaintenanceIntervalInSeconds * 2
          }
        />
        <br />
        {
          // <span
          //   style={{
          //     fontWeight: "500",
          //     margin: "0px",
          //     fontSize: "16px",
          //     marginLeft: "42px",
          //     padding: "5px 0px",
          //     display: "flex",
          //     alignItems: "center",
          //     color: secTextColor,
          //     borderRadius: "6px",
          //     fontFamily: "'Inter', sans-serif",
          //   }}
          // >
          //   {" "}
          //   <BookOpen size={17} />
          //   &nbsp; Continue reading
          // </span>
        }
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            padding: "10px 40px",
            overflowX: "scroll",
          }}
        >
          {books?.filter((book) => book.inProgress).length === 0 && (
            <ContinueReadingCard />
          )}
          {books
            ?.filter((book) => book.inProgress)
            .map((book) => (
              <ContinueReadingCard key={book.id} book={book} />
            ))}
        </div>

        <div style={{ padding: "25px" }}>
          <BookList />
          <br />

          {/* {books && books.length > 0 && <NextBooksToRead />} */}
          <BottomNav />
        </div>
      </motion.div>
    )
  );
};

export default Home;
