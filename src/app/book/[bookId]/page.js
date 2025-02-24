"use client";
import { priColor, secColor, secTextColor } from "@/configs/cssValues";
import {
  getBookById,
  updateBookById,
  updateBookByUserIdAndTitle,
} from "@/firebase/services/bookService";
import {
  Button,
  Collapse,
  Card,
  Popconfirm,
  Empty,
  Alert,
  message,
  Divider,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  MoveLeft,
  NotebookPen,
  PlayCircle,
  Edit,
  Tag,
  Timer,
  Book as BookIcon,
  Play,
  PlaySquare,
  MoreVertical,
  PlusCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import {
  generateRandomColourForString,
  getCurrentTimestampInMilliseconds,
} from "@/app/utility";
import Link from "next/link";
import { getNotesByBookId } from "@/firebase/services/notesService";
import { getStudySessionsByBookId } from "@/firebase/services/studySessionService";
import { loadingGif } from "@/configs/variables";

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(false);
  const history = useRouter();

  const [notes, setNotes] = useState([]);

  const [studySessions, setStudySessions] = useState([]);

  const [notesOrSessions, setNotesOrSessions] = useState("notes");

  const [messageApi, contextHolder] = message.useMessage();

  const [lastDoc, setLastDoc] = useState(null);
  const fetchNotes = async () => {
    const { notesData, lastVisible } = await getNotesByBookId(bookId, lastDoc);
    setNotes((prevNotes) => [...prevNotes, ...notesData]);
    setLastDoc(lastVisible); // Store last document for next page
  };

  const fetchStudySessions = async () => {
    const studySessions = await getStudySessionsByBookId(bookId);
    setStudySessions(studySessions);
  };

  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!bookId) return; // Prevent fetching if bookId is undefined
    setLoading(true);
    const fetchBook = async () => {
      try {
        const response = await getBookById(bookId);
        setBook(response);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
    fetchNotes();
    fetchStudySessions();
  }, [bookId]);

  useEffect(() => {
    if (reloadCount == 1) {
      if (!bookId) return; // Prevent fetching if bookId is undefined
      setLoading(true);
      const fetchBook = async () => {
        try {
          const response = await getBookById(bookId);
          setBook(response);
        } catch (error) {
          console.error("Error fetching book:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
      fetchNotes();
      fetchStudySessions();
    }
  }, [reloadCount]);

  // Toggle note expansion
  const toggleExpand = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, expanded: !note.expanded } : note
      )
    );
  };

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }} // Start off-screen (right)
        animate={{ opacity: 1 }} // Slide in
        exit={{ x: "100%", opacity: 0 }} // Animate out when component unmounts
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{
          height: "100vh",
          overflow: "auto",
        }}
      >
        {contextHolder}
        {/* Book Header */}
        <div
          style={{
            height: "230px",
            backgroundColor: book?.inWishlist ? "gray" : priColor,
            padding: "30px 40px",
            position: "relative",
            color: "white",
            borderRadius: "0px 0px 90px 0px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MoveLeft
              color={"white"}
              onClick={() => {
                history.back();
              }}
            />
          </div>

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
            {book?.title}
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
              src={book?.cover}
              style={{
                height: "160px",
                borderRadius: "5px",
                boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                filter: book?.inWishlist ? "grayscale(100%)" : "none",
              }}
            />
            <span>
              by <i>{book?.author}</i>
            </span>

            {/* Floating Button */}
            <span
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: secColor,
                padding: "11px 23px",
                bottom: "-21px",
                display:
                  !book?.inWishlist && !book?.inProgress ? "block" : "none",
                right: "16%",
                borderRadius: "999px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {book?.inWishlist || book?.inProgress ? null : ( // /> //   }} //     borderRight: "1px solid " + priColor, //     paddingRight: "13px", //   style={{ //   color={"white"} //   size={27} // <Timer
                <Popconfirm
                  placement="topLeft"
                  title="Want to start reading this book?"
                  onConfirm={async () => {
                    await updateBookByUserIdAndTitle(
                      {
                        inProgress: true,
                        completedReading: false,
                        startedReadingOn: getCurrentTimestampInMilliseconds(),
                        pagesRead: 0,
                      },
                      book.title
                    );

                    history.push("/");
                  }}
                  icon={<></>}
                  okText="Yes"
                  cancelText="No"
                >
                  <PlayCircle size={27} color={"white"} style={{}} />
                </Popconfirm>
              )}
              {/* {book?.inProgress && (
                <Link href={`/updateBook/${book?.id}`}>
                  <NotebookPen
                    size={25}
                    color={"white"}
                    style={{
                      marginLeft: "13px",
                      marginRight: book?.inProgress ? "13px" : "0px",
                    }}
                  />
                </Link>
              )} */}
            </span>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />

        {/* Expandable Description Section */}
        <div
          style={{
            padding: "15px",
            display:
              book?.description && book?.description != "" ? "block" : "none",
          }}
        >
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
                  <p
                    dangerouslySetInnerHTML={{ __html: book?.description }}
                    style={{ fontSize: "14px", lineHeight: "1.6" }}
                  ></p>
                ),
              },
            ]}
          />
        </div>

        {book?.inWishlist && (
          <div align="center">
            <br />
            <Alert
              message="This book is in your wishlist"
              type="info"
              style={{
                border: "0px",
                borderRadius: "0px",
                backgroundColor: "white",
              }}
              showIcon={false}
            />
            <br />
            <Button
              type={"primary"}
              style={{
                borderRadius: "999px",
                padding: "3px 20px",
              }}
              onClick={async () => {
                await updateBookById({ inWishlist: false }, book?.id);
                messageApi.success("Added to bookshelf");
                setTimeout(() => {
                  setReloadCount(1);
                }, 1000);
              }}
            >
              Add to Bookshelf
            </Button>
          </div>
        )}

        {/* Notes Section */}
        <div
          style={{
            padding: "15px",
            marginTop: "0px",
            display: !book?.inWishlist ? "block" : "none",
          }}
        >
          {notes.length == 0 && studySessions.length == 0 ? (
            <div align="center">
              <br />
              <br />
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  notesOrSessions === "notes"
                    ? "No notes found"
                    : "No study sessions found"
                }
              />
            </div>
          ) : null}

          {notesOrSessions === "notes" &&
            notes.map((note) => (
              <>
                <Card
                  key={note.id}
                  style={{
                    marginBottom: "14px",
                    borderRadius: "8px",
                    border: "0px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0)",
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
                      <small style={{ color: "#888" }}>
                        {new Date(note.createdAt).toDateString()}
                      </small>
                      <br />
                      <span style={{ fontSize: "16px" }}>{note.title}</span>
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
                        dangerouslySetInnerHTML={{ __html: note.description }}
                      ></p>

                      {note.description.split(" ").length > 15 &&
                        !note.expanded && (
                          <Button
                            type="link"
                            style={{
                              padding: 0,
                              fontSize: "14px",
                              marginLeft: "-2px",
                            }}
                            onClick={() => toggleExpand(note.id)}
                          >
                            Read More
                          </Button>
                        )}
                      {note.expanded && (
                        <Button
                          type="link"
                          style={{
                            padding: 0,
                            fontSize: "14px",
                            marginLeft: "-2px",
                          }}
                          onClick={() => toggleExpand(note.id)}
                        >
                          Show Less
                        </Button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <MoreVertical size={20} style={{ cursor: "pointer" }} />
                    </div>
                  </div>
                </Card>
                <Divider />
              </>
            ))}
          {notesOrSessions === "notes" && notes.length === 10 && (
            <Button
              onClick={() => {
                fetchNotes();
              }}
              type={"ghost"}
              style={{ width: "100%", marginBottom: "30px" }}
            >
              Load More
            </Button>
          )}

          {notesOrSessions === "sessions"
            ? studySessions.map((session) => (
                <Card
                  key={session.id}
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
                      <small style={{ color: "#888" }}>
                        {new Date(session.createdAt).toDateString()}
                      </small>
                      <br />
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {session.pagesCovered}
                        <br />
                        <span
                          style={{
                            color: secTextColor,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Timer size={18} /> {session.duration}
                        </span>
                      </span>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          marginTop: "5px",
                          marginBottom: "3px",
                          display: "-webkit-box",
                          WebkitLineClamp: session.expanded ? "unset" : 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {session.summary}
                      </p>

                      {session.summary.split(" ").length > 15 &&
                        !session.expanded && (
                          <Button
                            type="link"
                            style={{
                              padding: 0,
                              fontSize: "14px",
                              paddingTop: "0",
                            }}
                            onClick={() => toggleExpand(session.id)}
                          >
                            Read More
                          </Button>
                        )}
                      {session.expanded && (
                        <Button
                          type="link"
                          style={{
                            padding: 0,
                            fontSize: "14px",
                            marginLeft: "5px",
                          }}
                          onClick={() => toggleExpand(session.id)}
                        >
                          Show Less
                        </Button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <MoreVertical size={20} style={{ cursor: "pointer" }} />
                    </div>
                  </div>
                </Card>
              ))
            : null}
        </div>
      </motion.div>
    )
  );
};

export default Book;
