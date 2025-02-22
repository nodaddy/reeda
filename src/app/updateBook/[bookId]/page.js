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
  CheckCircle,
  BookCheck,
  CircleStop,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useRouter } from "next/navigation";
import { generateRandomColourForString } from "@/app/utility";
import PagePicker from "@/components/PagePicker";
import { createNote } from "@/firebase/services/notesService";
import { createStudySession } from "@/firebase/services/studySessionService";
import FinalReviewModal from "@/components/FinalReviewModal";

const { TextArea } = Input;

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const history = useRouter();

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

  return (
    !loading && (
      <motion.div
        initial={{ opacity: 0 }} // Start off-screen (right)
        animate={{ opacity: 1 }} // Slide in
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
              }}
            />
            <span>
              by <i>{book?.author}</i>
            </span>

            {/* Floating Button */}
            {!book?.completedReading && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "16%",
                  borderRadius: "999px",
                }}
              >
                <PagePicker
                  totalPages={book?.totalPages}
                  currentPage={book?.pagesRead}
                  onPageSelect={async (pageNumber) => {
                    await updateBookById(
                      {
                        pagesRead: pageNumber,
                      },
                      book.id
                    );
                    setBook({
                      ...book,
                      pagesRead: pageNumber,
                    });
                    messageApi.success(
                      `Yay! On page ${pageNumber}. Good Job!!`
                    );
                  }}
                />
              </span>
            )}
            <span
              onClick={async () => {
                await updateBookById(
                  {
                    pagesRead: 0,
                    inProgress: true,
                  },
                  book.id
                );
                setBook({
                  ...book,
                  pagesRead: 0,
                  inProgress: true,
                });
              }}
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
              <span>
                p.
                <span
                  style={{
                    fontSize: "27px",
                    marginLeft: "5px",
                    fontWeight: "bold",
                    background: `linear-gradient(90deg, ${priColor}, white, ${priColor})`,
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    animation: "shine 1s infinite linear",
                  }}
                >
                  {book?.pagesRead}
                </span>
                <style>
                  {`
  @keyframes shine {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 50% 50%; }
  }
`}
                </style>{" "}
                <sub>/ {book?.totalPages}</sub>
              </span>
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
        <br />
        {/* Note / Session Toggle */}
        <div style={{ padding: "20px", marginTop: "-30px" }}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "10px",
              border: "0px",
            }}
          >
            {/* Toggle Buttons */}
            <Radio.Group
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              buttonStyle="solid"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Radio.Button
                value="note"
                style={{
                  borderRadius: "999px 0px 0px 999px",
                  backgroundColor: mode === "note" ? priColor : "transparent",
                  color: mode === "note" ? "white" : "black",
                }}
              >
                <NotebookPen size={14} style={{ marginRight: "8px" }} />
                <span>Note</span>
              </Radio.Button>
              <Radio.Button
                value="session"
                style={{
                  borderRadius: "0px 999px 999px 0px",
                  backgroundColor:
                    mode === "session" ? priColor : "transparent",
                  color: mode === "session" ? "white" : "black",
                }}
              >
                <Play size={14} style={{ marginRight: "8px" }} />
                Log a Session
              </Radio.Button>
            </Radio.Group>

            {/* Quick Note Mode */}
            {mode === "note" && (
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: secTextColor,
                  }}
                >
                  Title (optional)
                </span>
                <Input
                  placeholder="Note Title"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: secTextColor,
                  }}
                >
                  Description
                </span>
                <TextArea
                  required
                  rows={4}
                  placeholder="Write your note..."
                  value={note.description}
                  onChange={(e) =>
                    setNote({ ...note, description: e.target.value })
                  }
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <div align="right">
                  <Button
                    type="primary"
                    disabled={savingData || !note.description}
                    style={{
                      padding: "10px 0px",
                      backgroundColor: "white",
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

            {/* Reading Session Mode */}
            {mode === "session" && (
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: secTextColor,
                  }}
                >
                  Coverage
                </span>
                <Input
                  placeholder="type e.g. Page 23 to 74 or Chapter 3"
                  value={session.pagesCovered}
                  onChange={(e) =>
                    setSession({ ...session, pagesCovered: e.target.value })
                  }
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: secTextColor,
                  }}
                >
                  Summary
                </span>

                <TextArea
                  rows={4}
                  placeholder="What did you read about in the session?"
                  value={session.summary}
                  onChange={(e) =>
                    setSession({ ...session, summary: e.target.value })
                  }
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />

                {/* Duration Input */}
                <div style={{ marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      color: secTextColor,
                    }}
                  >
                    <Timer color={secTextColor} /> Duration (minutes)
                  </span>
                  <InputNumber
                    min={1}
                    max={800}
                    size="small"
                    value={session.duration}
                    onChange={(value) =>
                      setSession({ ...session, duration: value })
                    }
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      borderRadius: "8px",
                      border: "0px solid #ccc",
                      padding: "10px",
                      fontSize: "16px",
                      boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.07)",
                    }}
                  />
                </div>

                <div align="right">
                  <Button
                    type="primary"
                    disabled={
                      savingData ||
                      !session.summary ||
                      !session.duration ||
                      !session.pagesCovered
                    }
                    style={{
                      padding: "10px 0px",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 0px transparent",
                      border: "0px",
                      color: priColor,
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      handleAddStudySession();
                    }}
                  >
                    {savingData ? "Saving..." : "Log Session"}
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
