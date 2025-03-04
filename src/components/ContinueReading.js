import { generateRandomColourForString, storage } from "@/app/utility";
import {
  defaultBorderColor,
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { bookSessionStorageKey, loadingGif } from "@/configs/variables";
import { useAppContext } from "@/context/AppContext";
import { Empty, Popconfirm, Progress, Typography } from "antd";
import {
  BookIcon,
  BookOpen,
  Bookmark,
  CircleStop,
  Clock,
  Clock1,
  Clock2,
  Edit,
  Edit2,
  Edit3,
  File,
  Hourglass,
  NotebookPen,
  Play,
  PlayCircle,
  Plus,
  Timer,
  TimerOff,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ContinueReadingCard = ({ book }) => {
  const [showPanel, setShowPanel] = useState(false);

  const { currentSessionBook, setCurrentSessionBook } = useAppContext();

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Get session start time from localStorage
    const sessionData = JSON.parse(localStorage.getItem(bookSessionStorageKey));
    const startTime = sessionData?.timestamp || Date.now();

    // Update timer every second
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSessionBook]);

  useEffect(() => {
    setTimeout(() => {
      setShowPanel(true);
    }, 300);
  }, []);

  const bookmarkColour = generateRandomColourForString(book?.title);

  // const book = {
  //   title: "Harry Potter",
  //   pagesRead: 4,
  //   totalPages: 44,
  //   startedReadingOn: Date.now(),
  //   cover:
  //     "http://books.google.com/books/content?id=E5V4zfHYaw0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  // };

  return !book || book.length === 0 ? null : (
    <div
      style={{
        width: "210px",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.17)",
        borderRadius: "50px 11px 50px 50px",
        flex: "0 0 auto",
        padding: "20px 30px 37px 30px",
        margin: "0px auto 20px auto",
        color: priTextColor,
        transition: "all 0.3s ease-in-out",
        backgroundColor: "white",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        borderTop: "8px solid " + "white",
      }}
    >
      {(JSON.parse(storage.getItem(bookSessionStorageKey) || null)?.id ==
        book?.id ||
        currentSessionBook?.id == book?.id) && (
        <span
          style={{
            color: "white",
            position: "absolute",
            top: "-22px",
            left: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Active Session
        </span>
      )}

      {(JSON.parse(storage.getItem(bookSessionStorageKey) || null)?.id ==
        book?.id ||
        currentSessionBook?.id == book?.id) && (
        <span
          style={{
            color: "white",
            position: "absolute",
            top: "-22px",
            right: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clock size={17} />
          &nbsp; {formatTime(elapsedTime)}
        </span>
      )}
      <Bookmark
        size={28}
        color={bookmarkColour}
        fill={bookmarkColour}
        style={{
          position: "absolute",
          top: "-11px",
          right: "32px",
        }}
      />
      <Typography.Title
        style={{
          fontWeight: "400",
          color: priTextColor,
          margin: "0px",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        level={4}
      >
        {book.title}
      </Typography.Title>
      {/* <Progress
        style={{
          width: "69px",
          position: "absolute",
          top: "63px",
          left: "29px",
        }}
        percent={(book.pagesRead / book.totalPages) * 100}
        strokeColor={bookmarkColour}
        strokeWidth={5}
        showInfo={false}
      /> */}
      <img
        src={book.cover}
        alt={book.title}
        style={{
          width: "69px",
          height: "69px",
          position: "absolute",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.27)",
          border: "2px solid #e0e0e0",
          // boxShadow: "0px 3px 10px " + bookmarkColour,
          top: "65px",
          left: "29px",
          borderRadius: "50%",
        }}
      />
      <br />
      <div
        style={{
          paddingLeft: "48%",
          color: bookmarkColour,
          fontSize: "14px",
          paddingTop: "2px",
          fontWeight: "300",
        }}
      >
        <span style={{}}>
          <span
            style={{
              color: bookmarkColour,
              fontWeight: "500",
              fontSize: "25px",
            }}
          >
            <i style={{ fontWeight: "300" }}>p.</i> {book.pagesRead}
          </span>{" "}
          {/* / {book.totalPages} pages */}
          {/* <Edit2 color={bookmarkColour} size={11} /> */}
        </span>
        <br />
        {/* <span
          style={{ color: secTextColor, display: "flex", alignItems: "center" }}
        >
          From: {new Date(book.startedReadingOn).toLocaleDateString()}
        </span> */}
        <Link
          href={`/book/${book?.id}`}
          style={{
            marginTop: "10px",
            textDecoration: "none",
            display: "inline-block",

            color: bookmarkColour,
            padding: "4px 0px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {" "}
          Recap
        </Link>
      </div>

      <div
        className="bounce-effect"
        style={{
          position: "absolute",
          alignItems: "center",
          height: "57px",
          width: "47px",
          borderRadius: "50%",
          justifyContent: "center",
          backgroundColor: priColor,
          boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
          display: "flex",
          bottom: "-16px",
          right: "11%",
          borderRadius: "999px",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden", // Important for containing the glare
        }}
      >
        <style>
          {`
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    .bounce-effect {
      animation: bounce 1s ease-in-out ;
    }
  `}
        </style>

        <Link href={`/updateBook/${book?.id}`}>
          <NotebookPen
            size={23}
            color={"white"}
            style={{
              margin: "0px 0px",
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default ContinueReadingCard;
