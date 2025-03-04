"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { Bookmark, Instagram, Twitter, Facebook, Dot } from "lucide-react";
import { storage } from "./utility";
import { useAppContext } from "@/context/AppContext";
import { logo } from "@/assets";
import Image from "next/image";

const Home = () => {
  const router = useRouter();
  const userInStorage = storage.getItem("user");
  const { profile, setProfile } = useAppContext();

  useEffect(() => {
    if (storage.getItem("user")) {
      router.push("/home");
    }
  }, []);

  return (
    !userInStorage && (
      <div className="landing-container">
        <div className="abstract-background"></div>
        <main className="content">
          <div className="logo-section">
            <h1 align="left">
              <Image width={180} src={logo} />
            </h1>
          </div>

          <div
            className="hero-section"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <AnimatedSlogan />

            <br />
            <br />
            <br />
            <SignInWithGoogle router={router} />
            <br />
            <br />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </main>

        {/* <footer className="footer">
          <span>Reeda</span>
          <div className="social-icons">
            <Instagram size={20} />
            <Twitter size={20} />
            <Facebook size={20} />
          </div>
        </footer> */}

        <style jsx>{`
          .landing-container {
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            flex-direction: column;
          }

          .abstract-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%);
            opacity: 0.8;
            z-index: -1;
          }

          .abstract-background::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 20% 80%,
                rgba(255, 255, 255, 0.6) 0%,
                transparent 30%
              );
            z-index: -1;
          }

          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            max-width: 100%;
            margin: 0 auto;
          }

          .logo-section {
            text-align: center;
            margin-bottom: 0rem;
          }

          .logo-section h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin: 0.5rem 0;
            color: #333;
          }

          .tagline {
            font-family: "Inter", sans-serif;
            color: #666;
            margin: 0;
            font-size: 1rem;
          }

          .hero-section {
            text-align: center;
            margin-top: 0rem;
          }

          .hero-section h2 {
            font-size: 1.5rem;
            font-weight: 300;
            color: #333;
            margin-bottom: 2rem;
          }

          .footer {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #666;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
          }

          .social-icons {
            display: flex;
            gap: 1rem;
          }

          @media (max-width: 768px) {
            .content {
              padding: 1.5rem;
            }

            .logo-section h1 {
              font-size: 2rem;
            }

            .hero-section h2 {
              font-size: 1.25rem;
            }
          }
        `}</style>
      </div>
    )
  );
};

export default Home;

const AnimatedSlogan = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Read", "Reeda", "Repeat"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "400",
        overflow: "hidden",
      }}
    >
      {words.map((word, index) => (
        <React.Fragment key={word}>
          <div
            style={{
              position: "absolute",
              animation:
                currentWordIndex === index
                  ? "slideUp 2s ease infinite"
                  : "none",
              opacity: currentWordIndex === index ? 1 : 0,
              transition: "opacity 0.5s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            {word}
          </div>
        </React.Fragment>
      ))}

      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            transform: translateY(0);
            opacity: 1;
          }
          80% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
      `}</style>
    </h2>
  );
};
