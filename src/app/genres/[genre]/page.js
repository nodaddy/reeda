"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { searchBySubject, formatSearchResults } from "../../../googleBooks";
import styles from "../../page.module.css";
import Loading from "../../../components/Loading";
import BookCard from "../../../components/BookCard";
import { Button, message, Tooltip, Badge, Divider, Input } from "antd";
import {
  BookOpen,
  BookPlus,
  ChevronLeft,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { createbook, getBooks } from "@/firebase/services/bookService";
import { useAppContext } from "@/context/AppContext";
import { storage } from "@/app/utility";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { addCoinsPerNewBookAdded } from "@/configs/variables";
import { logGAEvent } from "@/firebase/googleAnalytics";
import Link from "next/link";

// Popular book genres with details
const popularGenres = [
  {
    name: "Fiction",
    icon: "📚",
    color: "#4A90E2",
    description: "Imaginative stories that aren't real or factual",
  },
  {
    name: "Mystery",
    icon: "🔍",
    color: "#9B59B6",
    description: "Stories involving a puzzle or crime to be solved",
  },
  {
    name: "Science Fiction",
    icon: "🚀",
    color: "#3498DB",
    description: "Futuristic stories often involving technology and space",
  },
  {
    name: "Fantasy",
    icon: "🧙",
    color: "#8E44AD",
    description: "Stories with magic, mythical creatures, and imaginary worlds",
  },
  {
    name: "Romance",
    icon: "❤️",
    color: "#E74C3C",
    description: "Stories centered around love relationships",
  },
  {
    name: "Thriller",
    icon: "😱",
    color: "#34495E",
    description: "Suspenseful stories designed to excite and entertain",
  },
  {
    name: "Horror",
    icon: "👻",
    color: "#2C3E50",
    description: "Stories designed to frighten and unsettle the reader",
  },
  {
    name: "Biography",
    icon: "👤",
    color: "#16A085",
    description: "True accounts of a person's life",
  },
  {
    name: "History",
    icon: "🏛️",
    color: "#D35400",
    description: "Books about past events and human civilization",
  },
  {
    name: "Self-Help",
    icon: "🧠",
    color: "#27AE60",
    description: "Books focused on personal improvement",
  },
  {
    name: "Business",
    icon: "💼",
    color: "#2980B9",
    description: "Books about commerce, management, and entrepreneurship",
  },
  {
    name: "Cooking",
    icon: "🍳",
    color: "#E67E22",
    description: "Books with recipes and culinary techniques",
  },
  {
    name: "Travel",
    icon: "✈️",
    color: "#1ABC9C",
    description: "Books about places and travel experiences",
  },
  {
    name: "Poetry",
    icon: "🎭",
    color: "#9B59B6",
    description: "Literary works that use aesthetic qualities of language",
  },
  {
    name: "Children",
    icon: "👶",
    color: "#F1C40F",
    description: "Books written for young readers",
  },
  {
    name: "Young Adult",
    icon: "👦",
    color: "#E74C3C",
    description: "Books aimed at teenagers and young adults",
  },
];

export default function GenreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const genreName = decodeURIComponent(params.genre);
  const genreDetails = popularGenres.find(
    (g) => g.name.toLowerCase() === genreName.toLowerCase()
  ) || {
    name: genreName,
    icon: "📚",
    color: "#4A90E2",
    description: `Explore ${genreName} books`,
  };

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance"); // relevance, newest, rating
  const [messageApi, contextHolder] = message.useMessage();
  const [addingToBookshelf, setAddingToBookshelf] = useState({});
  const {
    profile,
    setProfile,
    books: userBooks,
    setBooks: setUserBooks,
  } = useAppContext();

  useEffect(() => {
    fetchBooksByGenre(genreName);
    logGAEvent("view_genre_detail", { genre: genreName });
  }, [genreName]);

  useEffect(() => {
    if (books.length > 0) {
      let sorted = [...books];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        sorted = sorted.filter(
          (book) =>
            book.title.toLowerCase().includes(query) ||
            (book.authors &&
              book.authors.some((author) =>
                author.toLowerCase().includes(query)
              ))
        );
      }

      // Apply sort
      if (sortOrder === "newest") {
        sorted = sorted.sort((a, b) => {
          const dateA = a.publishedDate
            ? new Date(a.publishedDate)
            : new Date(0);
          const dateB = b.publishedDate
            ? new Date(b.publishedDate)
            : new Date(0);
          return dateB - dateA;
        });
      } else if (sortOrder === "rating") {
        sorted = sorted.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
      }

      setFilteredBooks(sorted);
    }
  }, [books, searchQuery, sortOrder]);

  const fetchBooksByGenre = async (genre) => {
    setLoading(true);
    setBooks([]);
    setError(null);

    try {
      const results = await searchBySubject(genre, { maxResults: 40 });
      if (results && typeof results === "object") {
        const formattedResults = formatSearchResults(results);
        setBooks(formattedResults.books || []);
        setFilteredBooks(formattedResults.books || []);
      } else {
        console.error(
          "Invalid response format from Google Books API:",
          results
        );
        setError(
          "We couldn't load books for this genre. Please try another one."
        );
      }
    } catch (error) {
      console.error("Error fetching books by genre:", error);
      setError("There was an error loading books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    router.push(`/book/${bookId}`);
    logGAEvent("select_book_from_genre_detail", { genre: genreName, bookId });
  };

  const handleAddToBookshelf = async (book) => {
    setAddingToBookshelf((prev) => ({ ...prev, [book.id]: true }));

    try {
      // Check if book already exists in user's bookshelf
      const existingBooks = await getBooks();
      const bookExists = existingBooks.find(
        (b) =>
          b.title === book.title &&
          b.author === (book.authors?.[0] || "Unknown")
      );

      if (bookExists) {
        messageApi.warning("This book is already in your bookshelf");
      } else {
        // Format book for adding to bookshelf
        const newBook = {
          title: book.title,
          author: book.authors?.[0] || "Unknown",
          coverImage: book.thumbnail || "",
          description: book.description || "",
          inWishlist: false,
          inProgress: false,
          currentPage: 0,
          totalPages: book.pageCount || 0,
          userId: JSON.parse(storage.getItem("user")).email,
          dateAdded: new Date().toISOString(),
          categories: book.categories || [genreName],
          isbn: book.industryIdentifiers?.[0]?.identifier || "",
          publisher: book.publisher || "",
          publishedDate: book.publishedDate || "",
          language: book.language || "en",
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
        logGAEvent("add_book_to_bookshelf_from_genre", {
          genre: genreName,
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

  return (
    <div className={styles.container}>
      {contextHolder}

      <div
        className={styles.genreDetailHeader}
        style={{ backgroundColor: `${genreDetails.color}15` }}
      >
        <div className={styles.genreHeaderContent}>
          <div
            className={styles.genreIconLarge}
            style={{ backgroundColor: `${genreDetails.color}30` }}
          >
            {genreDetails.icon}
          </div>
          <div className={styles.genreInfo}>
            <h1 className={styles.genreHeaderTitle}>{genreDetails.name}</h1>
            <p className={styles.genreDescription}>
              {genreDetails.description}
            </p>
          </div>
        </div>

        <Link href="/genres">
          <Button
            type="default"
            icon={<ChevronLeft size={16} />}
            className={styles.backButton}
          >
            Back to Genres
          </Button>
        </Link>
      </div>

      <div className={styles.genreControls}>
        <Input
          placeholder="Search within this genre..."
          prefix={<Search size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.genreSearch}
        />

        <div className={styles.sortControls}>
          <span>Sort by:</span>
          <Button
            type={sortOrder === "relevance" ? "primary" : "default"}
            onClick={() => setSortOrder("relevance")}
            size="small"
          >
            Relevance
          </Button>
          <Button
            type={sortOrder === "newest" ? "primary" : "default"}
            onClick={() => setSortOrder("newest")}
            size="small"
            icon={<SortDesc size={14} />}
          >
            Newest
          </Button>
          <Button
            type={sortOrder === "rating" ? "primary" : "default"}
            onClick={() => setSortOrder("rating")}
            size="small"
            icon={<SortAsc size={14} />}
          >
            Rating
          </Button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading
            messages={[
              `Finding the best ${genreDetails.name} books...`,
              "Exploring literary treasures...",
              "Discovering amazing reads...",
              "Curating books just for you...",
            ]}
          />
        </div>
      ) : (
        <>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {!error && (
            <>
              <div className={styles.resultsInfo}>
                {filteredBooks.length === 0 ? (
                  <p>No books found. Try adjusting your search.</p>
                ) : (
                  <p>
                    Showing {filteredBooks.length} books in {genreDetails.name}
                  </p>
                )}
              </div>

              {filteredBooks.length > 0 && (
                <div className={styles.genreDetailGrid}>
                  {filteredBooks.map((book) => (
                    <div key={book.id} className={styles.bookCardContainer}>
                      <BookCard book={book} onClick={handleBookClick} />
                      <div className={styles.bookActions}>
                        <Tooltip title="View details">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<BookOpen size={16} />}
                            onClick={() => handleBookClick(book.id)}
                            className={styles.actionButton}
                          />
                        </Tooltip>
                        <Tooltip title="Add to bookshelf">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<BookPlus size={16} />}
                            onClick={() => handleAddToBookshelf(book)}
                            loading={addingToBookshelf[book.id]}
                            className={styles.actionButton}
                          />
                        </Tooltip>
                      </div>
                      {book.averageRating && (
                        <Badge
                          count={`${book.averageRating}★`}
                          className={styles.ratingBadge}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
