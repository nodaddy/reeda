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
import GenreExplorer from "@/components/GenreExplorer";

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

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          minHeight: "100vh",
          overflowY: "scroll",
        }}
      >
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
              margin: "25px 0px 30px 48px",
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
          <br />
          <br />

          {/* Premium Genres Explorer Card */}
          {!loading && books?.length > -1 && (
            <div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                borderRadius: "16px",
                padding: "24px",
                marginRight: "24px",
                marginBottom: "32px",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/genres")}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  opacity: 0.1,
                }}
              >
                <Sparkles size={120} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "10px",
                    marginRight: "16px",
                  }}
                >
                  <Sparkle size={24} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: 0,
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Explore Collections
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span>Explore Now</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "8px" }}
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          )}

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
      </motion.div>
    )
  );
};

export default Home;
