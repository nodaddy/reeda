"use client";

import React from "react";
import Image from "next/image";
import styles from "../app/page.module.css";

/**
 * BookCard component for displaying a book in the genres page
 * @param {Object} props - Component props
 * @param {Object} props.book - Book object with title, authors, thumbnail, etc.
 * @param {Function} props.onClick - Function to call when book is clicked
 */
const BookCard = ({ book, onClick }) => {
  // Generate a gradient based on the book title for books without thumbnails
  const generateGradient = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue1 = hash % 360;
    const hue2 = (hash * 13) % 360;

    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 40%))`;
  };

  return (
    <div className={styles.bookCard} onClick={() => onClick(book.id)}>
      <div className={styles.bookCover}>
        {book.thumbnail ? (
          <Image
            src={book.thumbnail.replace("http:", "https:")}
            alt={book.title}
            width={128}
            height={192}
            className={styles.coverImage}
          />
        ) : (
          <div
            className={styles.noCover}
            style={{ background: generateGradient(book.title) }}
          >
            <span>{book.title.substring(0, 1).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        {book.authors && book.authors.length > 0 ? (
          <p className={styles.bookAuthor}>{book.authors.join(", ")}</p>
        ) : (
          <p className={styles.bookAuthor}>Unknown Author</p>
        )}
        {book.averageRating && (
          <div className={styles.bookRating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={styles.star}
                style={{
                  color:
                    i < Math.round(book.averageRating) ? "#faad14" : "#d9d9d9",
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
