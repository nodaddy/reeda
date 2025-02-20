import {
  bookmarkColour,
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { useAppContext } from "@/context/AppContext";
import { Progress, Typography } from "antd";
import {
  Bookmark,
  Clock,
  Clock1,
  Clock2,
  Edit,
  Edit2,
  Edit3,
  Hourglass,
  NotebookPen,
  Play,
  PlayCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const ContinueReadingCard = () => {
  const { bookmarkColour } = useAppContext();
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowPanel(true);
    }, 500);
  }, []);

  const book = {
    title: "Harry Potter",
    pagesRead: 4,
    totalPages: 44,
    startedReadingOn: Date.now(),
    cover:
      "http://books.google.com/books/content?id=E5V4zfHYaw0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  };
  return (
    <div
      style={{
        width: "210px",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
        borderRadius: "14px 14px 14px 56px",
        padding: "20px 30px 50px 30px",
        margin: "24px auto",
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
          position: "absolute",
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
          fontWeight: "200",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-37px",
            right: "9px",
          }}
        >
          at page no.&nbsp;
          <span
            style={{
              color: bookmarkColour,
              fontWeight: "500",
              fontSize: "25px",
            }}
          >
            {book.pagesRead}
          </span>{" "}
          / {book.totalPages} <Edit2 color={bookmarkColour} size={11} />
        </span>
        <span style={{ color: secTextColor }}>
          Started: {new Date(book.startedReadingOn).toLocaleDateString("en-US")}
        </span>
        <br />
        <span
          style={{ marginTop: "7px", display: "inline-block", color: priColor }}
        >
          <Zap size={16} /> Recap
        </span>
      </div>

      <span
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: priColor,
          padding: "11px 18px",
          bottom: "-17px",
          right: "14%",
          borderRadius: "999px",
          opacity: showPanel ? 1 : 0,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <PlayCircle
          size={20}
          color={"white"}
          style={{
            paddingRight: "13px",
            borderRight: "1px solid " + secColor,
          }}
        />
        <NotebookPen
          size={18}
          color={"white"}
          style={{
            marginLeft: "13px",
          }}
        />
      </span>
    </div>
  );
};

export default ContinueReadingCard;
