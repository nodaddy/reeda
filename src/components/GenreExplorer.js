"use client";

import { useState, useEffect } from "react";
import { searchBySubject, formatSearchResults } from "../googleBooks";
import { useRouter } from "next/navigation";
import styles from "../app/page.module.css";
import Loading from "./Loading";
import BookCard from "./BookCard";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { Button, message, Tooltip, Badge, Card } from "antd";
import {
  BookOpen,
  BookPlus,
  ChevronLeft,
  ChevronRight,
  Star,
  Bookmark,
  Library,
  Search,
  Award,
  Clock,
  BookText,
  FilmIcon,
  HeartHandshake,
  Skull,
  Landmark,
  Brain,
  Briefcase,
  UtensilsCrossed,
  Plane,
  PenTool,
  Baby,
  Sparkles,
  MoveLeft,
  ChevronDown,
} from "lucide-react";
import { createbook, getBooks } from "@/firebase/services/bookService";
import { useAppContext } from "@/context/AppContext";
import { getCurrentTimestampInMilliseconds, storage } from "@/app/utility";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { addCoinsPerNewBookAdded } from "@/configs/variables";
import Link from "next/link";
import { motion } from "framer-motion";

// Premium book genres with icons instead of emojis
const premiumGenres = [
  {
    name: "Fiction",
    icon: <BookText size={20} />,
    color: "#4361ee",
    gradient: "linear-gradient(120deg, #4361ee, #3a0ca3)",
    description: "Imaginative stories that aren't real or factual",
  },
  {
    name: "Mystery",
    icon: <Search size={20} />,
    color: "#7209b7",
    gradient: "linear-gradient(120deg, #7209b7, #560bad)",
    description: "Stories involving a puzzle or crime to be solved",
  },
  {
    name: "Science Fiction",
    icon: <FilmIcon size={20} />,
    color: "#4cc9f0",
    gradient: "linear-gradient(120deg, #4cc9f0, #4895ef)",
    description: "Futuristic stories often involving technology and space",
  },
  {
    name: "Fantasy",
    icon: <Sparkles size={20} />,
    color: "#7678ed",
    gradient: "linear-gradient(120deg, #7678ed, #3a0ca3)",
    description: "Stories with magic, mythical creatures, and imaginary worlds",
  },
  {
    name: "Romance",
    icon: <HeartHandshake size={20} />,
    color: "#f72585",
    gradient: "linear-gradient(120deg, #f72585, #b5179e)",
    description: "Stories centered around love relationships",
  },
  {
    name: "Thriller",
    icon: <Clock size={20} />,
    color: "#22223b",
    gradient: "linear-gradient(120deg, #22223b, #4a4e69)",
    description: "Suspenseful stories designed to excite and entertain",
  },
  {
    name: "Horror",
    icon: <Skull size={20} />,
    color: "#2b2d42",
    gradient: "linear-gradient(120deg, #2b2d42, #14213d)",
    description: "Stories designed to frighten and unsettle the reader",
  },
  {
    name: "Biography",
    icon: <BookOpen size={20} />,
    color: "#2a9d8f",
    gradient: "linear-gradient(120deg, #2a9d8f, #264653)",
    description: "True accounts of a person's life",
  },
  {
    name: "History",
    icon: <Landmark size={20} />,
    color: "#e76f51",
    gradient: "linear-gradient(120deg, #e76f51, #f4a261)",
    description: "Books about past events and human civilization",
  },
  {
    name: "Self-Help",
    icon: <Brain size={20} />,
    color: "#52b788",
    gradient: "linear-gradient(120deg, #52b788, #40916c)",
    description: "Books focused on personal improvement",
  },
  {
    name: "Business",
    icon: <Briefcase size={20} />,
    color: "#0077b6",
    gradient: "linear-gradient(120deg, #0077b6, #023e8a)",
    description: "Books about commerce, management, and entrepreneurship",
  },
  {
    name: "Cooking",
    icon: <UtensilsCrossed size={20} />,
    color: "#fb8500",
    gradient: "linear-gradient(120deg, #fb8500, #ffb703)",
    description: "Books with recipes and culinary techniques",
  },
  {
    name: "Travel",
    icon: <Plane size={20} />,
    color: "#0096c7",
    gradient: "linear-gradient(120deg, #0096c7, #48cae4)",
    description: "Books about places and travel experiences",
  },
  {
    name: "Poetry",
    icon: <PenTool size={20} />,
    color: "#8338ec",
    gradient: "linear-gradient(120deg, #8338ec, #c77dff)",
    description: "Literary works that use aesthetic qualities of language",
  },
  {
    name: "Children",
    icon: <Baby size={20} />,
    color: "#ffbd00",
    gradient: "linear-gradient(120deg, #ffbd00, #ffd60a)",
    description: "Books written for young readers",
  },
  {
    name: "Young Adult",
    icon: <Award size={20} />,
    color: "#ef476f",
    gradient: "linear-gradient(120deg, #ef476f, #f15bb5)",
    description: "Books aimed at teenagers and young adults",
  },
];

// Premium Genre Card Component with enhanced mobile styling
const PremiumGenreCard = ({ genre, onSelect }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(genre.name)}
      style={{
        position: "relative",
        borderRadius: "16px",
        background: genre.gradient,
        width: "100%",
        height: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          opacity: 0.2,
        }}
      >
        {genre.icon}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-15px",
          left: "-15px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />

      {/* Genre name only */}
      <h3
        style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "700",
          margin: 0,
          textAlign: "center",
          padding: "0 16px",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          zIndex: 1,
        }}
      >
        {genre.name}
      </h3>
    </motion.div>
  );
};

/**
 * Mobile-first GenreExplorer component with premium styling
 */
const GenreExplorer = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedGenreDetails, setSelectedGenreDetails] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [addingToBookshelf, setAddingToBookshelf] = useState({});
  const [expandedBook, setExpandedBook] = useState(null);
  const router = useRouter();
  const {
    profile,
    setProfile,
    books: userBooks,
    setBooks: setUserBooks,
  } = useAppContext();

  useEffect(() => {
    if (selectedGenre) {
      fetchBooksByGenre(selectedGenre);
      const genreDetails = premiumGenres.find((g) => g.name === selectedGenre);
      setSelectedGenreDetails(genreDetails);
    }
  }, [selectedGenre]);

  const fetchBooksByGenre = async (genre) => {
    setLoading(true);
    setBooks([]); // Reset books when loading a new genre
    setError(null); // Reset error state
    try {
      const results = await searchBySubject(genre, { maxResults: 24 });
      if (results && typeof results === "object") {
        const formattedResults = formatSearchResults(results);
        setBooks(formattedResults.books || []);
        logGAEvent("view_genre", { genre });
      } else {
        console.error(
          "Invalid response format from Google Books API:",
          results
        );
        setBooks([]);
        setError(
          "We couldn't load books for this genre. Please try another one."
        );
      }
    } catch (error) {
      console.error("Error fetching books by genre:", error);
      setBooks([]);
      setError("There was an error loading books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    logGAEvent("select_genre", { genre });
  };

  const handleBookClick = (bookId) => {
    router.push(`/book/${bookId}`);
    logGAEvent("select_book_from_genre", { genre: selectedGenre, bookId });
  };

  const handleAddToBookshelf = async (book) => {
    setAddingToBookshelf((prev) => ({ ...prev, [book.id]: true }));

    try {
      // Check if book already exists in user's bookshelf
      const existingBooks = await getBooks();
      const bookExists = existingBooks.find(
        (b) =>
          b.title === book.title && b.author === (book.authors[0] || "Unknown")
      );

      if (bookExists) {
        messageApi.warning("This book is already in your bookshelf");
      } else {
        // Format book for adding to bookshelf
        const newBook = {
          title: book.title,
          author: book.authors[0] || "Unknown",
          cover: book.thumbnail || "",
          description: book.description || "",
          inWishlist: false,
          inProgress: false,
          totalPages: book.pageCount || 500,
          userId: JSON.parse(storage.getItem("user")).email,
          createdAt: getCurrentTimestampInMilliseconds(),
        };

        // Add book to bookshelf
        await createbook(newBook);

        // Add coins to user profile
        if (profile?.userId) {
          await updateProfile(profile.userId, {
            ...profile,
            coins: (profile?.coins || 0) + addCoinsPerNewBookAdded,
          });

          // Update profile in context
          const updatedProfile = await getProfile(
            JSON.parse(storage.getItem("user")).email
          );
          setProfile(updatedProfile);
        }

        // Refresh books list
        const updatedBooks = await getBooks();
        setUserBooks(updatedBooks);

        messageApi.success("Book added to your bookshelf!");
        logGAEvent("add_book_to_bookshelf", {
          genre: selectedGenre,
          bookId: book.id,
          bookTitle: book.title,
        });
      }
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
      messageApi.error("Failed to add book to bookshelf. Please try again.");
    } finally {
      setAddingToBookshelf((prev) => ({ ...prev, [book.id]: false }));
    }
  };

  // New function to handle book description expansion
  const handleExpandDescription = (book, e) => {
    e.stopPropagation();
    setExpandedBook(expandedBook === book.id ? null : book.id);
  };

  const renderGenreHeader = () => {
    if (!selectedGenreDetails) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: "24px 16px 28px",
          background: selectedGenreDetails.gradient,
          borderRadius: "0 0 24px 24px",
          marginBottom: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(4px)",
            borderRadius: "12px",
            padding: "4px 10px",
            fontSize: "10px",
            fontWeight: "600",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Premium
        </div> */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "16px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {selectedGenreDetails.icon}
          </div>
          <div>
            <h1
              style={{
                margin: "0",
                fontSize: "22px",
                fontWeight: "700",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {selectedGenreDetails.name}
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "13px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {selectedGenreDetails.description}
            </p>
          </div>
        </div>
        <Button
          type="text"
          icon={<ChevronLeft size={16} />}
          onClick={() => setSelectedGenre(null)}
          style={{
            color: "white",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
            padding: "6px 14px",
            height: "auto",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Back to Genres
        </Button>
      </motion.div>
    );
  };

  return (
    <div
      style={{
        padding: "0 0 24px 0",
        maxWidth: "100%",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      {contextHolder}

      {!selectedGenre ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ padding: "0 16px" }}
        >
          <div style={{ margin: "24px 20px", position: "relative" }}>
            {/* Back button at the top */}
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MoveLeft
                onClick={() => {
                  history.back();
                }}
              />
              <h2
                style={{
                  fontWeight: "500",
                  margin: "0",
                  fontFamily: "Poppins",
                }}
              >
                Genres
              </h2>
            </div>
          </div>
          <br />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Changed to 2 columns
              gap: "16px",
              padding: "0 0 24px 0",
            }}
          >
            {premiumGenres.map((genre) => (
              <div key={genre.name}>
                <PremiumGenreCard genre={genre} onSelect={handleGenreClick} />
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {renderGenreHeader()}

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                padding: "0 16px",
              }}
            >
              <Loading
                messages={[
                  `Finding ${selectedGenre} books...`,
                  "Exploring exclusive literary treasures...",
                  "Discovering reads...",
                  "Curating books just for you...",
                ]}
              />
            </div>
          ) : (
            <div style={{ padding: "0 16px" }}>
              {error && (
                <div
                  style={{
                    padding: "16px",
                    background: "#fff1f0",
                    border: "1px solid #ffccc7",
                    borderRadius: "12px",
                    color: "#cf1322",
                    marginBottom: "20px",
                    boxShadow: "0 2px 8px rgba(207, 19, 34, 0.1)",
                    fontSize: "14px",
                    margin: "0 16px",
                  }}
                >
                  {error}
                </div>
              )}

              {!error && books.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "16px",
                      paddingBottom: "24px",
                    }}
                  >
                    {books.map((book) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          position: "relative",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                          background: "white",
                          display: "flex",
                          flexDirection: "column",
                          height: expandedBook === book.id ? "auto" : "160px",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            height: "160px",
                          }}
                        >
                          <div
                            onClick={() => handleBookClick(book.id)}
                            style={{
                              width: "35%",
                              position: "relative",
                              boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url(${
                                  book.thumbnail || "/book-placeholder.png"
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "contrast(1.05) brightness(1.02)",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              padding: "14px",
                              width: "65%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                            onClick={() => handleBookClick(book.id)}
                          >
                            <div>
                              <h3
                                style={{
                                  margin: "0 0 6px 0",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  lineHeight: "1.3",
                                  color: "#333",
                                }}
                              >
                                {book.title}
                              </h3>
                              <p
                                style={{
                                  margin: "0 0 8px 0",
                                  fontSize: "13px",
                                  color: "#666",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontWeight: "500",
                                }}
                              >
                                {book.authors?.join(", ") || "Unknown"}
                              </p>

                              {/* Description preview */}
                              {book.description && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "4px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) =>
                                    handleExpandDescription(book, e)
                                  }
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#4361ee",
                                      fontWeight: "500",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {expandedBook === book.id
                                      ? "Hide description"
                                      : "Read description"}
                                    <ChevronDown
                                      size={14}
                                      style={{
                                        marginLeft: "4px",
                                        transform:
                                          expandedBook === book.id
                                            ? "rotate(180deg)"
                                            : "rotate(0)",
                                        transition: "transform 0.2s ease",
                                      }}
                                    />
                                  </span>
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "8px",
                              }}
                            >
                              {book.averageRating ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#f6ffed",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#389e0d",
                                    boxShadow:
                                      "0 2px 4px rgba(56, 158, 13, 0.1)",
                                  }}
                                >
                                  <Star
                                    size={12}
                                    style={{ marginRight: "4px" }}
                                  />
                                  {book.averageRating}
                                </div>
                              ) : (
                                <div></div>
                              )}

                              <Button
                                type="primary"
                                shape="circle"
                                icon={<BookPlus size={16} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToBookshelf(book);
                                }}
                                loading={addingToBookshelf[book.id]}
                                style={{
                                  background:
                                    selectedGenreDetails?.gradient ||
                                    "linear-gradient(to right, #4361ee, #f72585)",
                                  border: "none",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  width: "38px",
                                  height: "38px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Expandable description section */}
                        {expandedBook === book.id && book.description && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              padding: "0 16px 16px 16px",
                              borderTop: "1px solid #f0f0f0",
                              marginTop: "8px",
                            }}
                          >
                            <h4
                              style={{
                                fontSize: "14px",
                                margin: "16px 0 8px 0",
                                color: "#333",
                                fontWeight: "600",
                              }}
                            >
                              Description
                            </h4>
                            <p
                              style={{
                                fontSize: "13px",
                                lineHeight: "1.5",
                                color: "#666",
                                margin: 0,
                                maxHeight: "200px",
                                overflow: "auto",
                              }}
                            >
                              {book.description || "No description available."}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {!error && books.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    textAlign: "center",
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    margin: "0 16px",
                  }}
                >
                  <Library
                    size={40}
                    style={{
                      color: "#d9d9d9",
                      marginBottom: "12px",
                      opacity: 0.8,
                    }}
                  />
                  <p
                    style={{
                      color: "#8c8c8c",
                      fontSize: "15px",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    No premium books found for this genre. Try another one!
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GenreExplorer;
