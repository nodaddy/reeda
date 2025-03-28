import { storage } from "@/app/utility";
import {
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { Card, Button, Modal, Tooltip, Spin, Popover } from "antd";
import { time } from "framer-motion";
import {
  Flame,
  HelpCircle,
  Bookmark,
  List,
  X,
  MessageCircleCodeIcon,
  BookMarked,
  Coins,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { logGAEvent } from "@/firebase/googleAnalytics";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { logo } from "@/assets";
import Image from "next/image";
import { getAuth } from "firebase/auth";

const StreakCard = ({ streak, isActive }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  const [menuOpen, setMenuOpen] = useState(null);

  const { setProfile, isPremium, profile } = useAppContext();

  const router = useRouter();

  const currentHour = new Date().getHours();
  let greeting = "";
  let Icon = Sun;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Morning!";
    Icon = Sun; // Display sun icon for morning
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Afternoon!";
    Icon = Sun; // Display sun icon for afternoon
  } else {
    greeting = "Evening!";
    Icon = Moon; // Display moon icon for evening/night
  }

  const handleRevive = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (streak) {
      setLoading(false);

      const updateCountdown = () => {
        const now = Date.now();
        const nextReset = streak.lastPageScanTimestamp + 48 * 60 * 60 * 1000;
        const diff = nextReset - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ hours, minutes });
        } else {
          setTimeLeft({ hours: 0, minutes: 0 });
        }
      };

      const interval = setInterval(updateCountdown, 60000);
      updateCountdown();

      return () => clearInterval(interval);
    }
  }, [streak]);

  return (
    <>
      {/* Sliding Menu */}
      <div
        style={{
          position: "fixed",
          top: "0",
          right: menuOpen ? "0" : "-300px",
          width: "280px",
          height: "100vh",
          backgroundColor: "white",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          transition: "right 0.3s ease-in-out",
          padding: "0px",
          zIndex: "1000000",
        }}
      >
        <X
          size={24}
          color="#555555"
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "14px",
            top: "17px",
          }}
          onClick={() => setMenuOpen(false)}
        />

        <h4
          style={{
            padding: "0px 20px",
            fontSize: "19px",
            color: "#333",
            fontWeight: "500",
          }}
        >
          Menu
        </h4>
        <ul style={{ listStyle: "none", padding: "20px", margin: "20px 0" }}>
          <li style={{ borderBottom: "1px solid #ddd", padding: "18px 0px" }}>
            <Link
              onClick={() => setMenuOpen(false)}
              href="/"
              style={{ color: "#333", textDecoration: "none" }}
            >
              Home
            </Link>
          </li>
          <li style={{ borderBottom: "1px solid #ddd", padding: "18px 0px" }}>
            <Link
              onClick={() => setMenuOpen(false)}
              href="/profile"
              style={{ color: "#333", textDecoration: "none" }}
            >
              My Profile
            </Link>
          </li>
          {/* {!isPremium && (
            <li style={{ borderBottom: "1px solid #ddd", padding: "18px 0px" }}>
              <Link
                onClick={() => {
                  setMenuOpen(false);
                  logGAEvent("click_upgrade_to_premium_navbar");
                }}
                href="/premium"
                style={{ color: "#333", textDecoration: "none" }}
              >
                Upgrade to premium
              </Link>
            </li>
          )} */}
          <li style={{ borderBottom: "1px solid #ddd", padding: "18px 0px" }}>
            <Link
              onClick={() => setMenuOpen(false)}
              href="https://wa.me/918126153920"
              style={{ color: "#333", textDecoration: "none" }}
            >
              Contact us &nbsp;
              <MessageCircleCodeIcon />
            </Link>
          </li>
          <li style={{ padding: "18px 0px" }}>
            <span
              onClick={() => {
                storage.removeItem("user");
                setProfile(null);
                router.push("/");
              }}
              style={{ color: "#e63946", textDecoration: "none" }}
            >
              Logout
            </span>
          </li>
        </ul>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: "999999",
          }}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <Card
        bodyStyle={{
          padding: "18px 24px",
          width: "100vw",
        }}
        style={{
          width: "100%",
          margin: "auto",
          border: "0px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "12px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "18px",
                  color: isPremium ? "#1a1a1a" : priTextColor,
                  display: "flex",
                  alignItems: "flex-start",
                  fontWeight: "500",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <span>
                  <div
                    style={{
                      marginTop: "0px",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={logo}
                      width={40}
                      height={40}
                      style={{
                        borderRadius: "7px",
                        backgroundColor: "black",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                      }}
                      alt="logo"
                    />
                    {isPremium && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            background:
                              "linear-gradient(135deg, #FFD700, #FFA500)",
                            padding: "4px",
                            borderRadius: "50%",
                            boxShadow: "0 2px 8px rgba(255, 165, 0, 0.4)",
                          }}
                        >
                          <Crown size={12} color="#ffffff" />
                        </div>
                      </>
                    )}
                  </div>
                </span>
                <div
                  style={{
                    marginLeft: "12px",
                    display: "flex",
                    gap: "0px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "17px",
                      color: "#666",
                      fontFamily: "cursive",
                      fontStyle: "italic",
                    }}
                  >
                    {greeting}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "gray",
                    }}
                  >
                    {getAuth().currentUser?.displayName.split(" ")[0] ||
                      "Reader"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Premium Coins Display */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "18px",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                padding: "6px 16px",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(255, 165, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Coins size={18} color="#ffffff" style={{ marginRight: "6px" }} />
              <span
                style={{
                  fontWeight: "600",
                  color: "#ffffff",
                  fontSize: "15px",
                  textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {profile?.coins || 0}
              </span>
            </div> */}

            <List
              color={"#333"}
              size={26}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                marginRight: "-3px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default StreakCard;
