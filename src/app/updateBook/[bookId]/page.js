"use client";
import { priTextColor, secColor, secTextColor } from "@/configs/cssValues";
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
  Input,
  Radio,
  Typography,
  Divider,
  InputNumber,
  message,
  notification,
  Dropdown,
  Menu,
  Tag,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  MoveLeft,
  NotebookPen,
  Book as BookIcon,
  MoreVertical,
  BookCheck,
  CircleStop,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useRouter } from "next/navigation";
import { generateRandomColourForString } from "@/app/utility";
import { createNote } from "@/firebase/services/notesService";
import { createStudySession } from "@/firebase/services/studySessionService";
import FinalReviewModal from "@/components/FinalReviewModal";
import TipTapEditor from "@/components/TipTapEditot";

const { TextArea } = Input;

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const history = useRouter();

  const [editorContentResetFlag, setEditorContentResetFlag] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <div
          onClick={async () => {
            setIsReviewModalOpen(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <BookCheck color={priTextColor} size={16} />
          &nbsp; Mark as completed
        </div>
      </Menu.Item>
      {book?.pagesRead !== book?.totalPages && (
        <Menu.Item key="2">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={async () => {
              await updateBookById(
                {
                  inProgress: false,
                },
                bookId
              );
              setBook({
                ...book,
                inProgress: false,
              });
              messageApi.success("It's okay :)");
              setTimeout(() => {
                history.push("/home");
              }, 1000);
            }}
          >
            <CircleStop size={16} /> &nbsp; Give up{" "}
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  const [mode, setMode] = useState("note");
  const [note, setNote] = useState({ title: "", description: "", tags: [] });
  const [session, setSession] = useState({
    pagesCovered: "",
    summary: "",
    duration: "",
  });

  const priColor = generateRandomColourForString(book?.title);

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
  }, [bookId]);

  const handleAddNote = async () => {
    setSavingData(true);
    await createNote(bookId, note);
    setNote({ title: "", description: "", tags: [] });
    setEditorContentResetFlag(!editorContentResetFlag);
    messageApi.success("Note added successfully!");
    setSavingData(false);
  };

  const handleAddStudySession = async () => {
    setSavingData(true);
    await createStudySession(bookId, session);
    setSession({ pagesCovered: "", summary: "", duration: "" });
    messageApi.success("Study session logged!");
    setSavingData(false);
  };

  // Toggle note expansion
  const toggleExpand = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, expanded: !note.expanded } : note
      )
    );
  };

  const PageProgress = ({ onUpdatePages }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(
      book?.pagesRead?.toString() || "0"
    );
    const [showError, setShowError] = useState(false);
    const inputRef = useRef(null);

    const handleClick = () => {
      setIsEditing(true);
      // Focus will be handled by useEffect
    };

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const validateAndUpdate = (value) => {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= book?.totalPages) {
        onUpdatePages(numValue);
        setIsEditing(false);
        setShowError(false);
      } else {
        setShowError(true);
        // Hide error after 2 seconds
        setTimeout(() => setShowError(false), 2000);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        validateAndUpdate(inputValue);
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setInputValue(book?.pagesRead?.toString() || "0");
      }
    };

    const handleBlur = () => {
      validateAndUpdate(inputValue);
    };

    const handleChange = (e) => {
      // Only allow numbers
      const value = e.target.value.replace(/[^\d]/g, "");
      setInputValue(value);
    };

    return (
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span>p.</span>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{
              fontSize: "25px",
              marginLeft: "5px",
              width: `${Math.max(inputValue.length, 1) * 20 + 16}px`,
              padding: "0 10px",
              border: `2px solid ${priColor}`,
              borderRadius: "6px",
              outline: "none",
              backgroundColor: "white",
            }}
          />
        ) : (
          <span
            onClick={handleClick}
            style={{
              fontSize: "25px",
              marginLeft: "5px",
              fontWeight: "bold",
              background: `linear-gradient(90deg, ${priColor}, white, ${priColor})`,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              color: "transparent",
              animation: "shine 1s infinite linear",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {book?.pagesRead}
          </span>
        )}
        <sub style={{ marginLeft: "3px" }}>/ {book?.totalPages}</sub>

        {showError && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "red",
              fontSize: "12px",
              marginTop: "4px",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              animation: "fadeIn 0.3s",
            }}
          >
            Please enter a valid page number (0-{book?.totalPages})
          </div>
        )}

        <style>
          {`
            @keyframes shine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 50% 50%; }
            }
            
            @keyframes fadeInOut {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            
            span:hover > div {
              opacity: 1;
            }
          `}
        </style>
      </div>
    );
  };

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }} // Start off-screen (right)
        animate={{ opacity: 1 }} // Slide in
        style={{
          height: "100vh",
          overflow: "auto",
        }}
        exit={{ x: "100%", opacity: 0 }} // Animate out when component unmounts
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {contextHolder}
        {/* Book Header */}
        <div
          style={{
            height: "230px",
            backgroundColor: priColor,
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
            <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
              <MoreVertical
                color="white"
                style={{
                  cursor: "pointer",
                  display: book?.inProgress ? "block" : "none",
                }}
              />
            </Dropdown>
          </div>
          <br />
          <i style={{ fontFamily: "'Inter', sans-serif" }}>
            <sub>Update book progress</sub>
          </i>
          <Title
            level={2}
            style={{
              color: "white",
              marginTop: "4px",
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
                borderRadius: "7px",
                border: "3px solid white",
                boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
              }}
            />
            <span>
              by <i>{book?.author}</i>
            </span>
            <span
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey",
                padding: `6px 23px 11px 23px`,
                bottom: "-21px",
                display: book?.inProgress ? "block" : "none",
                right: "16%",
                borderRadius: "999px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <PageProgress
                onUpdatePages={async (pageNumber) => {
                  setBook({
                    ...book,
                    pagesRead: pageNumber,
                  });
                  await updateBookById(
                    {
                      pagesRead: pageNumber,
                    },
                    book.id
                  );
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
                  <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    {book?.description}
                  </p>
                ),
              },
            ]}
          />
        </div>
        {/* Note / Session Toggle */}
        <div style={{ padding: "0px", marginTop: "-30px" }}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "10px",
              backgroundColor: "transparent",
              border: "0px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 3px",
              }}
            >
              <Button
                size="large"
                style={{
                  border: "0px",
                  backgroundColor: "transparent",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0)",
                  padding: "0px",
                  margin: "0px",
                  color: secTextColor,
                }}
              >
                <NotebookPen size={14} style={{ marginRight: "0px" }} />
                <span>Add notes</span>
              </Button>

              <span
                style={{
                  color: secTextColor,
                }}
              >
                {new Date(Date.now()).toDateString()}
              </span>
            </div>
            {/* Quick Note Mode */}
            {mode === "note" && (
              <div>
                <TipTapEditor
                  setContent={(html) => {
                    setNote({
                      ...note,
                      description: html,
                    });
                  }}
                  resetContentFlag={editorContentResetFlag}
                />
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  Choose a tags:&nbsp; &nbsp;
                  <Tag
                    color={
                      note?.tags?.includes("p." + book?.pagesRead)
                        ? priColor
                        : "silver"
                    }
                    onClick={() => {
                      note?.tags?.includes("p." + book?.pagesRead)
                        ? setNote({
                            ...note,
                            tags: note.tags.filter(
                              (tag) => tag !== "p." + book?.pagesRead
                            ),
                          })
                        : setNote({
                            ...note,
                            tags: [...note.tags, "p." + book?.pagesRead],
                          });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    p. {book?.pagesRead}
                  </Tag>
                  <Tag
                    color={
                      note?.tags?.includes("important") ? priColor : "silver"
                    }
                    onClick={() => {
                      note?.tags?.includes("important")
                        ? setNote({
                            ...note,
                            tags: note.tags.filter(
                              (tag) => tag !== "important"
                            ),
                          })
                        : setNote({
                            ...note,
                            tags: note.tags.concat("important"),
                          });
                    }}
                  >
                    ! Important
                  </Tag>
                </div>

                <div align="right">
                  <Button
                    type="primary"
                    disabled={savingData || !note.description}
                    style={{
                      padding: "25px 0px",
                      backgroundColor: "transparent",
                      boxShadow: "0px 0px 0px transparent",
                      color: priColor,
                      border: "0px",
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      handleAddNote();
                    }}
                  >
                    {savingData ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <FinalReviewModal
            isReviewModalOpen={isReviewModalOpen}
            setIsReviewModalOpen={setIsReviewModalOpen}
            bookId={bookId}
            book={book}
            setBook={setBook}
          />
        </div>
      </motion.div>
    )
  );
};

export default Book;
