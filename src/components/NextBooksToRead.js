import { priTextColor } from "@/configs/cssValues";

import { Plus } from "lucide-react";

import { bookIconCircleCss } from "./WishList";
import { Popover } from "antd";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { updateBookByUserIdAndTitle } from "@/firebase/services/bookService";

const NextBooksToRead = () => {
  const { books } = useAppContext();
  const [openPopToSelectBook, setOpenPopToSelectBook] = useState(false);
  return (
    <>
      <div
        style={{
          // marginTop: '13px',
          margin: "auto",
          marginTop: "5px",
          borderRadius: "10px",
          padding: "20px 0px",
          zIndex: "1",
        }}
      >
        <span
          style={{
            fontWeight: "400",
            margin: "0px",
            fontSize: "18px",
            padding: "5px 0px",
            color: priTextColor,
            borderRadius: "6px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {" "}
          Next books to read
        </span>
        <br />
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "15px",
          }}
        >
          <Popover
            placement="topRight"
            open={openPopToSelectBook}
            content={
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Select a book</span>
                  <span onClick={() => setOpenPopToSelectBook(false)}>
                    close
                  </span>
                </div>
                <br />
                <div
                  style={{
                    maxHeight: "20vh",
                    overflowY: "scroll",
                  }}
                >
                  {books?.map((book) => {
                    return (
                      <div
                        style={{
                          display: "grid",
                          // grid repeat
                          gridTemplateColumns: "repeat(5, 1fr)",
                          gap: "5px",
                        }}
                      >
                        <img
                          onClick={async () => {
                            await updateBookByUserIdAndTitle(
                              {
                                nextToRead: Date.now(),
                              },
                              book.title
                            );
                            setOpenPopToSelectBook(false);
                          }}
                          src={book.cover}
                          style={{
                            width: "60px",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            }
          >
            <span
              onClick={() => setOpenPopToSelectBook(true)}
              style={{
                ...bookIconCircleCss,
                border: "1px dashed #ccc",
              }}
            >
              <Plus />
            </span>
          </Popover>

          {books
            ?.filter((book) => book.nextToRead)
            .map((book) => (
              <span
                style={{
                  ...bookIconCircleCss,
                  border: "1px solid #ccc",
                  background: `url(${book.cover})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default NextBooksToRead;
