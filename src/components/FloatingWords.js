"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { secTextColor } from "@/configs/cssValues";
import { BookHeart, MoveRight } from "lucide-react";
import { shuffleArray } from "@/app/utility";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const FloatingWords = () => {
  const [wordList, setWordList] = useState([]);
  const [availableHeight, setAvailableHeight] = useState(0);
  const containerRef = useRef(null);
  const { books, profile } = useAppContext();

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setAvailableHeight(window.innerHeight - rect.top);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [books]);

  const [baseWords, setBaseWords] = useState(profile?.readingInterests);

  useEffect(() => {
    if (availableHeight === 0) return;

    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1200;

    // Create segments to ensure better horizontal distribution
    const segments = baseWords.length;
    const segmentWidth = screenWidth / segments;

    const generatedWords = baseWords.map((word, index) => ({
      id: `word-${index}`,
      text: word,
      top: getRandom(50, availableHeight * 0.8 - 30) + "px",
      // Start position spaced out across segments
      startX: screenWidth + index * segmentWidth,
      // Longer duration for smoother movement
      duration: getRandom(15, 20),
      // Staggered delays based on position
      delay: index * 2,
      size: getRandom(10, 28) + "px",
    }));

    setWordList((prev) => [
      ...prev.filter((w) => w.inWishlist),
      ...generatedWords,
    ]);
  }, [books, availableHeight]);

  useEffect(() => {
    if (books && availableHeight !== 0 && books?.length > 0) {
      const screenWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;
      const segments = books.filter((word) => word.inWishlist).length;
      const segmentWidth = screenWidth / segments;

      const bookWords = books
        .filter((word) => word.inWishlist)
        .map((word, index) => ({
          id: `book-${index}`,
          ...word,
          top: getRandom(50, availableHeight * 0.8 - 30) + "px",
          startX: screenWidth + index * segmentWidth,
          duration: getRandom(15, 20),
          delay: index * 2 + 4, // Offset from text words
        }));

      setWordList((prev) => [
        ...prev.filter((w) => !w.inWishlist),
        ...bookWords,
      ]);
    }
  }, [books, availableHeight]);

  return (
    books && (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100vw",
          marginLeft: "-24px",
          height: availableHeight ? `${availableHeight}px` : "auto",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontWeight: "400",
            fontSize: "20px",
            padding: "5px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: secTextColor,
            borderRadius: "6px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <BookHeart />
            &nbsp;Interests & Wishlist &nbsp;&nbsp;
          </span>
          <MoveRight />
        </span>

        {shuffleArray(wordList).map((word) => {
          const randim = getRandom(30, 55);
          return (
            <motion.div
              key={word.id}
              initial={{ x: word.startX }}
              animate={{ x: -200 }} // End further left to ensure smooth exit
              transition={{
                duration: word.duration,
                delay: word.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                top: word.top,
                fontSize: word.size,
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              {Object.keys(word).includes("inWishlist") ? (
                <Link href={`/book/${word.id}`}>
                  <Image
                    width={randim}
                    height={randim}
                    src={word.cover}
                    alt={word.title}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                      filter: "grayscale(100%)",
                    }}
                  />
                </Link>
              ) : (
                <span
                  style={{
                    color: secTextColor,
                    transformOrigin: "100% 100%",
                  }}
                >
                  {word.text}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    )
  );
};

export default FloatingWords;
