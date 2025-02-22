"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Card, Input, Select } from "antd";
import { priColor } from "@/configs/cssValues";
import { Bookmark, CheckCircle, MoveLeft } from "lucide-react";
import { generateRandomColourForString } from "../utility";
import Link from "next/link";

const Bookshelf = () => {
  const { books } = useAppContext();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("title");

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

  return (
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "10px" }}>
      <div
        style={{
          position: "absolute",
          width: "100vw",
          top: "0px",
          height: "297px",
          left: "0px",
          borderRadius: "0px 0px 0px 90px",
          backgroundColor: priColor,
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
          <MoveLeft
            color={"white"}
            onClick={() => {
              router.back();
            }}
          />
        </div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "400",
            paddingLeft: "20px",
            marginBottom: "20px",
            color: "white",
            zIndex: "999",
            fontFamily: "'Inter', sans-serif",
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
          {/* <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "70%" }}
          /> */}
          <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            style={{ width: "150px" }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="inProgress">In Progress</Select.Option>
          </Select>
          <Select
            value={sortOption}
            onChange={(value) => setSortOption(value)}
            style={{ width: "-webkit-fill-available" }}
          >
            <Select.Option value="title">Order by Title</Select.Option>
            <Select.Option value="rating">Order by Rating</Select.Option>
            <Select.Option value="createdAt">
              Order by Date (Added on)
            </Select.Option>
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
          {filteredBooks?.map((item) => (
            <div
              style={{
                flex: "0 0 auto",
              }}
            >
              {/* Front Side */}
              <Link href={`/book/${item.id}`}>
                <Card
                  style={{
                    backfaceVisibility: "hidden",
                    margin: "0px auto 20px auto",
                    width: "fit-content",

                    border: "0px",
                  }}
                  bodyStyle={{
                    padding: "0px",
                    width: "fit-content",
                  }}
                >
                  {item.inProgress && (
                    <Bookmark
                      size={25}
                      color={"white"}
                      fill={"orange"}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "7px",
                        zIndex: "99",
                      }}
                    />
                  )}
                  {item.completedReading && (
                    <CheckCircle
                      size={30}
                      fill={"green"}
                      color={"white"}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "50%",
                        transform: "translate(50%, -50%)",
                        zIndex: "99",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "relative",
                      width: "19vw",
                    }}
                  >
                    <img
                      src={item.cover}
                      style={{
                        opacity: item.completedReading ? "0.5" : "1",
                        width: "19vw",
                        height: "30vw",
                        objectFit: "cover",
                        flex: "0 0 auto",
                        borderRadius: "7px", // Optional: Slight rounding for a premium look
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
                        transition:
                          "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Smooth hover effect
                      }}
                    />
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
