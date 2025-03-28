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
import {
  BookOpen,
  BookPlus,
  Info,
  MoveRight,
  Sparkle,
  Sparkles,
  Wand,
  Wand2,
} from "lucide-react";
import { Empty, FloatButton, Popconfirm } from "antd";
import WishlistSection from "@/components/WishlistSection";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  const { profile, setProfile, books, setIsPremium } = useAppContext();

  useEffect(() => {
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
    if (profile) {
      setLoading(false);
      return;
    }
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
          maxHeight: "100vh",
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
        <br />
        {/* Premium Genres Explorer Card */}
        {!loading && books?.length > -1 && false && (
          <div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "linear-gradient(135deg,rgb(0, 0, 0) 0%, gray 100%)",
              borderRadius: "16px",
              padding: "14px 18px",
              marginLeft: "24px",
              marginRight: "24px",
              marginBottom: "20px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() =>
              (window.location.href = "/scan/" + bookTitleForAdHocAISession)
            }
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
                <Sparkle size={17} color="white" />
              </div>

              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  margin: 0,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                AI Scans &nbsp;&nbsp;
                <MoveRight size={19} />
              </h3>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "silver",
                borderRadius: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "10px",
              }}
            >
              Scan pages, get a summary in seconds with a text integrated
              dictionary
            </p>
          </div>
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
              padding: "10px 10px 10px 43px",
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
          <WishlistSection />
          {books?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "20px",
                color: "#666",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              <Sparkles size={16} />
              <span>
                Tip: Click the + button to add your first book to your bookshelf
                and start tracking
              </span>
            </motion.div>
          )}
          <br />
          <br />
          <br />

          {/* Premium Genres Explorer Card */}
          {/* {!loading && books?.length > -1 && (
            <div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                borderRadius: "16px",
                padding: "16px 20px",
                marginRight: "24px",
                marginBottom: "0px",
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
                <BookPlus size={120} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
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
                  <BookPlus size={24} color="white" />
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
            </div>
          )} */}
        </div>
      </motion.div>
    )
  );
};

export default Home;
