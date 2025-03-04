"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { searchByTitle } from "@/googleBooks";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { storage } from "@/app/utility";
import { isUserPremium } from "@/payments/playstoreBilling";
import {
  bookTitleForAdHocAISession,
  streakMaintenanceIntervalInSeconds,
} from "@/configs/variables";
import StreakCard from "@/components/StreakCard";
import BookList from "@/components/BookList";
import ContinueReadingCard from "@/components/ContinueReading";
import NextBooksToRead from "@/components/NextBooksToRead";
import BottomNav from "@/components/Menu";
import { motion } from "framer-motion";
import { priColor, secTextColor } from "@/configs/cssValues";
import { BookOpen, Info, Sparkle, Sparkles, Wand, Wand2 } from "lucide-react";
import { Empty, FloatButton, Popconfirm } from "antd";
import Link from "next/link";
import FloatingWords from "@/components/FloatingWords";

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
      console.log(profile);
      const now = Date.now();
      const lastPageScanTimestamp = profile?.streak.lastPageScanTimestamp;
      const difference = Math.ceil((now - lastPageScanTimestamp) / 1000);

      if (difference > 84600) {
        const updateData = {
          ...profile,
          streak: {
            ...profile?.streak,
            days:
              profile?.streak.days > profile?.streak.longestStreak
                ? 0
                : profile?.streak.days,
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

  // Modern geometric background style with gradient effect
  const modernBackground = {
    position: "relative",
    overflow: "scroll",
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

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={modernBackground}
      >
        {/* Geometric pattern overlay */}
        <div style={geometricPattern}></div>

        {/* Grid overlay */}
        <div style={gridOverlay}></div>

        {/* Content container */}
        <div style={contentContainer}>
          {books?.length >= 0 && (
            <StreakCard
              streak={profile?.streak}
              isActive={
                lastPageScanDifference < streakMaintenanceIntervalInSeconds * 2
              }
            />
          )}

          {books?.filter((book) => book.inProgress).length == 0 ? (
            <div
              style={{
                width: "100%",
                marginBottom: "60px",
              }}
            >
              <br />
              <br />
              <Empty
                style={{
                  color: "black",
                }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ marginTop: "14px" }}>No open books</div>
                }
              />
            </div>
          ) : (
            <>
              <br />
            </>
          )}
          {books?.filter((book) => book.inProgress).length > 0 && (
            <div
              id="continue-reading-div"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                padding: "10px",
                margin: "25px 0px 30px 0px",
                overflowX: "scroll",
              }}
            >
              {books
                ?.filter((book) => book.inProgress)
                .map((book) => (
                  <ContinueReadingCard key={book.id} book={book} />
                ))}
            </div>
          )}

          <div
            style={{
              padding: "0px 0px 0px 24px",
            }}
          >
            <br />

            <BookList />
            <br />

            <FloatingWords />

            {/* {books && books.length > 0 && <NextBooksToRead />} */}
            {/* <BottomNav /> */}
            <Link href={"/scan/" + bookTitleForAdHocAISession}>
              <FloatButton
                shape="square"
                type="primary"
                style={{
                  insetInlineEnd: 40,
                }}
                icon={<>AI</>}
              />
            </Link>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default Home;
