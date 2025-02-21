"use client";
import { priColor, secColor } from "@/configs/cssValues";
import { Button, Collapse, Card } from "antd";
import Title from "antd/es/typography/Title";
import { MoveLeft, NotebookPen, PlayCircle, Edit, Tag } from "lucide-react";
import { useState } from "react";

const Book = () => {
  const book = {
    id: 1,
    title: "The Alchemist of the Century",
    author: "Paulo Coelho",
    description:
      "A book about the power of the alchemist. It explores the journey of self-discovery, dreams, and transformation. An inspiring tale that captivates readers with its deep philosophical insights.",
    pagesRead: 30,
    inProgress: true,
    totalPages: 300,
    cover:
      "http://books.google.com/books/content?id=2WHZDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  };

  // Mock notes
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Alchemy is about transformation",
      content:
        "The book emphasizes that transformation is not just about turning metal into gold but about personal growth.",
      date: "Feb 20, 2025",
      expanded: false,
    },
    {
      id: 2,
      title: "Follow your personal legend",
      content:
        "Your 'Personal Legend' is what you've always wanted to accomplish, and the universe conspires to help you achieve it.",
      date: "Feb 18, 2025",
      expanded: false,
    },
  ]);

  // Toggle note expansion
  const toggleExpand = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, expanded: !note.expanded } : note
      )
    );
  };

  return (
    <>
      {/* Book Header */}
      <div
        style={{
          height: "230px",
          backgroundColor: priColor,
          padding: "30px 40px",
          position: "relative",
          color: "white",
          borderRadius: "0px 0px 80px 0px",
        }}
      >
        <MoveLeft color={"white"} />
        <br />
        <br />
        <Title
          level={2}
          style={{
            color: "white",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {book.title}
        </Title>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "30px",
          }}
        >
          <img
            src={book.cover}
            style={{ height: "160px", borderRadius: "5px" }}
          />
          {book.inProgress ? (
            <span>
              <sub>{"Reading"} </sub>
              <span
                style={{
                  fontSize: "25px",
                  marginLeft: "5px",
                }}
              >
                {book.pagesRead}
              </span>{" "}
              <sub>/ {book.totalPages}</sub>
            </span>
          ) : (
            <span>
              by <i>{book.author}</i>
            </span>
          )}

          {/* Floating Button */}
          <span
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: secColor,
              padding: "11px 23px",
              bottom: "-21px",
              right: "14%",
              borderRadius: "999px",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <PlayCircle
              size={27}
              color={"white"}
              style={{
                paddingRight: "13px",
                borderRight: "1px solid " + priColor,
              }}
            />
            <NotebookPen
              size={25}
              color={"white"}
              style={{
                marginLeft: "13px",
              }}
            />
          </span>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />

      {/* Expandable Description Section */}
      <div style={{ padding: "15px" }}>
        <Collapse
          accordion
          bordered={false}
          expandIconPosition="right"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
          items={[
            {
              key: "1",
              label: (
                <b style={{ fontSize: "16px", fontWeight: "400" }}>
                  Book Description
                </b>
              ),
              children: (
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  {book.description}
                </p>
              ),
            },
          ]}
        />
      </div>

      {/* Notes Section */}
      <div style={{ padding: "15px", marginTop: "0px" }}>
        <Title
          level={5}
          style={{
            marginBottom: "13px",
            display: "flex",
            padding: "10px 15px",
            borderRadius: "7px",
            backgroundColor: "bisque",
            fontWeight: "300",
            margin: "0px 0px 8px",
            alignItems: "center",
          }}
        >
          <Tag fill="silver" color="grey" size={20} /> &nbsp;&nbsp;Your Reading
          Sessions - Notes
        </Title>
        {notes.map((note) => (
          <Card
            key={note.id}
            style={{
              marginBottom: "14px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
            }}
            hoverable
            bodyStyle={{ padding: "15px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <small style={{ color: "#888" }}>{note.date}</small>
                <br />
                <b style={{ fontSize: "16px" }}>{note.title}</b>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    marginTop: "5px",
                    marginBottom: "3px",
                    display: "-webkit-box",
                    WebkitLineClamp: note.expanded ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {note.content}
                </p>

                {note.content.split(" ").length > 15 && !note.expanded && (
                  <Button
                    type="link"
                    style={{ padding: 0, fontSize: "14px", paddingTop: "0" }}
                    onClick={() => toggleExpand(note.id)}
                  >
                    Read More
                  </Button>
                )}
                {note.expanded && (
                  <Button
                    type="link"
                    style={{ padding: 0, fontSize: "14px", marginLeft: "5px" }}
                    onClick={() => toggleExpand(note.id)}
                  >
                    Show Less
                  </Button>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Edit
                  size={20}
                  color={secColor}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Book;
