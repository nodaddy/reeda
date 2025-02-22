import { generateRandomColourForString } from "@/app/utility";
import {
  defaultBorderColor,
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { loadingGif } from "@/configs/variables";
import { useAppContext } from "@/context/AppContext";
import { Empty, Progress, Typography } from "antd";
import {
  BookIcon,
  BookOpen,
  Bookmark,
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
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ContinueReadingCard = ({ book }) => {
  const [showPanel, setShowPanel] = useState(false);

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
        borderRadius: "11px",
        flex: "0 0 auto",
        padding: "20px 30px 50px 30px",
        margin: "60px auto 20px auto",
        color: priTextColor,
        backgroundColor: "white",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        borderTop: "4px solid " + bookmarkColour,
      }}
    >
      <Bookmark
        size={28}
        color={bookmarkColour}
        fill={bookmarkColour}
        style={{
          position: "absolute",
          top: "-5px",
          right: "24px",
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
          width: "86px",
          position: "absolute",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
          top: "71px",
          left: "29px",
          borderRadius: "5px",
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
            border: "1px solid " + defaultBorderColor,
            color: bookmarkColour,
            padding: "3px 9px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {" "}
          Recap
        </Link>
      </div>

      <Link
        href={`/updateBook/${book?.id}`}
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bookmarkColour,
          padding: "8px 18px",
          bottom: "-16px",
          right: "14%",
          borderRadius: "999px",
          opacity: showPanel ? 1 : 0,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* <BookIcon
          size={21}
          color={"white"}
          style={{
            paddingRight: "12px",
            borderRight: "1px solid " + "silver",
          }}
        /> */}
        <NotebookPen
          size={20}
          color={"white"}
          style={{
            margin: "0px 7px",
          }}
        />
      </Link>
    </div>
  );
};

export default ContinueReadingCard;
