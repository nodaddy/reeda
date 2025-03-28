import React from "react";
import { Button, message } from "antd";
import { Plus, BookPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { priColor, priTextColor, secTextColor } from "@/configs/cssValues";
import { useAppContext } from "@/context/AppContext";
import { updateBookById } from "@/firebase/services/bookService";

const WishlistSection = () => {
  const { books, setBooks } = useAppContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [addingToBookshelf, setAddingToBookshelf] = React.useState({});

  const wishlistBooks = books?.filter((book) => book.inWishlist) || [];

  const handleAddToBookshelf = async (book) => {
    setAddingToBookshelf((prev) => ({ ...prev, [book.id]: true }));
    try {
      await updateBookById({ inWishlist: false }, book.id);
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, inWishlist: false } : b
      );
      setBooks(updatedBooks);
      messageApi.success("Book added to bookshelf!");
    } catch (error) {
      messageApi.error("Failed to add book to bookshelf");
    } finally {
      setAddingToBookshelf((prev) => ({ ...prev, [book.id]: false }));
    }
  };

  if (wishlistBooks.length === 0) return null;

  return (
    <div style={{ marginTop: "30px", padding: "0 10px" }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <span
          style={{
            fontWeight: "400",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            color: secTextColor,
            borderRadius: "6px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <BookPlus size={20} style={{ marginRight: "8px" }} />
          Wishlist
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          gap: "15px",
          margin: "auto",
          overflowX: "scroll",
          borderRadius: "10px",
          padding: "13px 10px 13px 1px",
          zIndex: "1",
        }}
      >
        {wishlistBooks.map((book) => (
          <motion.div
            key={book.id}
            style={{ flex: "0 0 auto" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ position: "relative" }}>
              <Link href={`/book/${book.id}`}>
                <div
                  style={{
                    width: "17vw",
                    height: "26vw",
                    borderRadius: "7px",
                    border: "1px solid #e0e0e0",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                    }}
                  />
                </div>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSection;
