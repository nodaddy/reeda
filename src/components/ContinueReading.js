import { generateRandomColourForString } from "@/app/utility";
import {
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { useAppContext } from "@/context/AppContext";
import { Progress, Typography } from "antd";
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
    }, 500);
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

  return !book || book.length === 0 ? (
    <div
      style={{
        // boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
        display: "flex",
        height: "110px",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        color: priTextColor,
        fontFamily: "'Inter', sans-serif",
        marginTop: "-11px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "110px",
        }}
      >
        <img
          src={
            "https://media4.giphy.com/media/sAEbELl0mw5jO/giphy.webp?cid=ecf05e47bswal530vglqxeorok1dn92e2iqjzbodm1ccymxv&ep=v1_gifs_search&rid=giphy.webp&ct=g"
          }
          style={{
            width: "110px",
          }}
        />
      </div>
      <span
        style={{
          color: secTextColor,
        }}
      >
        <strong>No books in progress!</strong> <br />
        <i>Pick a book from your bookshelf :)</i>
      </span>
    </div>
  ) : (
    <div
      style={{
        width: "210px",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.17)",
        borderRadius: "14px 14px 14px 80px",
        flex: "0 0 auto",
        padding: "20px 30px 50px 30px",
        margin: "0px auto 20px auto",
        color: priTextColor,
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        borderTop: "4px solid " + bookmarkColour,
      }}
    >
      <Bookmark
        color={bookmarkColour}
        fill={bookmarkColour}
        style={{
          position: "absolute",
          top: "-5px",
          right: "20px",
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
          width: "78px",
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
          paddingLeft: "44%",
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
            <File size={16} /> {book.pagesRead}
          </span>{" "}
          / {book.totalPages} pages
          {/* <Edit2 color={bookmarkColour} size={11} /> */}
        </span>
        <br />
        {/* <span
          style={{ color: secTextColor, display: "flex", alignItems: "center" }}
        >
          From: {new Date(book.startedReadingOn).toLocaleDateString()}
        </span> */}
        <span
          style={{
            marginTop: "7px",
            display: "inline-block",
            color: bookmarkColour,
          }}
        >
          <Zap size={16} /> Recap
        </span>
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
