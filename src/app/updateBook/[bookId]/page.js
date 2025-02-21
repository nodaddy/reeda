"use client";
import { secColor } from "@/configs/cssValues";
import {
  getBookById,
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
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { useRouter } from "next/navigation";
import {
  generateRandomColourForString,
  getCurrentTimestampInMilliseconds,
} from "@/app/utility";
import PagePicker from "@/components/PagePicker";

const { TextArea } = Input;

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(false);
  const history = useRouter();

  const [mode, setMode] = useState("note");
  const [note, setNote] = useState({ title: "", content: "" });
  const [session, setSession] = useState({ lastPage: "", summary: "" });

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
    !loading && (
      <motion.div
        initial={{ opacity: 0 }} // Start off-screen (right)
        animate={{ opacity: 1 }} // Slide in
        exit={{ x: "100%", opacity: 0 }} // Animate out when component unmounts
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
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
            <MoreVertical color={"white"} />
          </div>

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
                  await updateBookByUserIdAndTitle(
                    {
                      pagesRead: pageNumber,
                    },
                    book.title
                  );
                  setBook({
                    ...book,
                    pagesRead: pageNumber,
                  });
                }}
              />
            </span>
            <span
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey",
                padding: "6px 23px 11px 23px",
                bottom: "-21px",
                right: "16%",
                borderRadius: "999px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {book?.startedReadingOn ? null : ( // /> //   }} //     borderRight: "1px solid " + priColor, //     paddingRight: "13px", //   style={{ //   color={"white"} //   size={27} // <Timer
                <Popconfirm
                  title="Want to start reading this book?"
                  onConfirm={async () => {
                    await updateBookByUserIdAndTitle(
                      {
                        inProgress: true,
                        startedReadingOn: getCurrentTimestampInMilliseconds(),
                      },
                      book.title
                    );

                    history.push("/");
                  }}
                  icon={<></>}
                  okText="Yes"
                  cancelText="No"
                >
                  <PlayCircle
                    size={27}
                    color={"white"}
                    style={{
                      paddingRight: "13px",
                      borderRight: "1px solid " + priColor,
                    }}
                  />
                </Popconfirm>
              )}
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
                <TextArea
                  rows={4}
                  placeholder="Write your note..."
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
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
                    style={{
                      padding: "10px 0px",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 0px transparent",
                      color: priColor,
                      fontSize: "16px",
                    }}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            )}

            {/* Reading Session Mode */}
            {mode === "session" && (
              <div>
                <Input
                  type="number"
                  placeholder="Pages read e.g. 23 to 74"
                  value={session.lastPage}
                  onChange={(e) =>
                    setSession({ ...session, lastPage: e.target.value })
                  }
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <TextArea
                  rows={4}
                  placeholder="Session summary, what did you read about in the session?"
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
                <div align="right">
                  <Button
                    type="primary"
                    style={{
                      padding: "10px 0px",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 0px transparent",
                      color: priColor,
                      fontSize: "16px",
                    }}
                  >
                    Log Session
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    )
  );
};

export default Book;
