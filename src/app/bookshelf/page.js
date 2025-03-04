"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Card, Input, Select, Tooltip } from "antd";
import { priColor, secColor } from "@/configs/cssValues";
import { Bookmark, CheckCircle, MoveLeft, Search, Star } from "lucide-react";
import { generateRandomColourForString } from "../utility";
import Link from "next/link";
import { motion } from "framer-motion";

const Bookshelf = () => {
  const { books } = useAppContext();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("title");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredBooks = books
    ?.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((book) => {
      if (filter === "completed") return book.completedReading;
      if (filter === "inProgress") return book.inProgress;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "rating")
        return (b.review?.rating || 0) - (a.review?.rating || 0);
      if (sortOption === "createdAt") return b.createdAt - a.createdAt;
      return 0;
    });

  // Book item animation variants
  const bookVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    hover: {
      y: -8,
      boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Star rating component
  const VerticalStarRating = ({ rating = 0 }) => {
    const starSize = 12;
    const stars = [];

    for (let i = 5; i >= 1; i--) {
      stars.push(
        <div key={i} style={{ marginBottom: "4px" }}>
          <Star
            size={starSize}
            fill={i <= rating ? "#FFD700" : "white"}
            color={i <= rating ? "#FFD700" : "#aaa"}
            strokeWidth={1}
            style={{
              filter:
                i <= rating
                  ? "drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))"
                  : "none",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          position: "absolute",
          right: "-1px",
          top: "52%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "20px",
          zIndex: 5,
        }}
      >
        {stars}
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "10px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          width: "100%",
          top: "0px",
          left: "0px",
          zIndex: 10,
          padding: "15px 20px",
          background: isScrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MoveLeft
          color={isScrolled ? priColor : "white"}
          onClick={() => router.back()}
          style={{ cursor: "pointer", transition: "color 0.3s ease" }}
        />
        {isScrolled && (
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              margin: 0,
              marginLeft: "15px",
              fontWeight: 500,
              color: priColor,
            }}
          >
            My Bookshelf
          </motion.h4>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          width: "100vw",
          top: "0px",
          height: "297px",
          left: "0px",
          borderRadius: "0px 0px 0px 90px",
          background: `linear-gradient(135deg, ${priColor}, ${priColor}dd)`,
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "30px 0px 10px 20px",
          }}
        >
          {/* Back button is now in the fixed header */}
          <div style={{ width: "24px", height: "24px" }}></div>
        </div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "500",
            paddingLeft: "20px",
            marginBottom: "20px",
            color: "white",
            zIndex: "999",
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          My Bookshelf
        </h2>

        {/* Search & Filter Section */}
        <div
          style={{
            padding: "0px 20px",
            display: "flex",
            flexWrap: "nowrap",
            gap: "15px",
            alignItems: "center",
            zIndex: "999",
          }}
        >
          <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            style={{
              width: "150px",
              borderRadius: "8px",
            }}
            dropdownStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Select.Option value="all">All Books</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="inProgress">In Progress</Select.Option>
          </Select>

          <Select
            value={sortOption}
            onChange={(value) => setSortOption(value)}
            style={{
              width: "170px",
              borderRadius: "8px",
            }}
            dropdownStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Select.Option value="title">Order by Title</Select.Option>
            <Select.Option value="rating">Order by Rating</Select.Option>
            <Select.Option value="createdAt">By Date Added</Select.Option>
          </Select>
        </div>

        <div
          style={{
            display: "grid",
            margin: "40px 10px",
            gridTemplateColumns: "repeat(4, 1fr)", // Exactly 4 books per row
            justifyContent: "center",
          }}
        >
          {filteredBooks
            ?.filter((item) => !item.inWishlist)
            .map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={bookVariants}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative", // For positioning the rating stars
                }}
              >
                {/* Star Rating */}
                <VerticalStarRating rating={item.review?.rating || 0} />

                {/* Front Side */}
                <Link href={`/book/${item.id}`} style={{ display: "block" }}>
                  <Card
                    style={{
                      backfaceVisibility: "hidden",
                      margin: "0px auto 20px auto",
                      width: "fit-content",
                      border: "0px",
                      boxShadow: "none",
                      background: "transparent",
                    }}
                    bodyStyle={{
                      padding: "0px",
                      width: "fit-content",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "17.6vw",
                        maxWidth: "160px",
                      }}
                    >
                      {item.inProgress && (
                        <Bookmark
                          size={25}
                          color={"white"}
                          fill={priColor}
                          style={{
                            position: "absolute",
                            top: "-2px",
                            right: "7px",
                            zIndex: "99",
                            filter:
                              "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))",
                          }}
                        />
                      )}
                      {item.completedReading && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            borderRadius: "10px",
                            zIndex: "98",
                          }}
                        ></div>
                      )}
                      {/* {item.completedReading && (
                          <CheckCircle
                            size={38}
                            fill={"green"}
                            color={"white"}
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "50%",
                              transform: "translate(50%, -50%)",
                              zIndex: "99",
                              filter:
                                "drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.4))",
                            }}
                          />
                        )} */}
                      <img
                        src={item.cover}
                        style={{
                          width: "17vw",
                          maxWidth: "160px",
                          height: "26vw",
                          maxHeight: "240px",
                          border: "1px solid #e0e0e0",
                          objectFit: "cover",
                          flex: "0 0 auto",
                          borderRadius: "5px",
                          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.25)",
                          transition: "all 0.3s ease-in-out",
                        }}
                      />

                      {/* Book spine effect */}
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          height: "100%",
                          width: "8px",
                          background:
                            "linear-gradient(to right, rgba(0,0,0,0.4), transparent)",
                          borderTopLeftRadius: "10px",
                          borderBottomLeftRadius: "10px",
                        }}
                      ></div>

                      {/* Bottom title label for quick identification */}
                      {item.title && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                            width: "100%",
                            padding: "30px 8px 8px 8px",
                            background:
                              "linear-gradient(to top, black, rgba(0,0,0,0) 100%)",
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            {item.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
