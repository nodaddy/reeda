import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { priColor } from "@/configs/cssValues";
import { updateProfile } from "@/firebase/services/profileService";
import { useAppContext } from "@/context/AppContext";

const ReadingInterests = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const { profile, setProfile } = useAppContext();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const genres = [
    {
      id: 1,
      name: "Fiction",
      image: "/api/placeholder/400/300",
      color: "rgb(168, 50, 121)",
    },
    {
      id: 2,
      name: "Science & Technology",
      image: "/api/placeholder/400/300",
      color: "rgb(39, 133, 106)",
    },
    {
      id: 3,
      name: "Business",
      image: "/api/placeholder/400/300",
      color: "rgb(30, 50, 100)",
    },
    {
      id: 4,
      name: "Self Development",
      image: "/api/placeholder/400/300",
      color: "rgb(232, 17, 91)",
    },
    {
      id: 5,
      name: "Biography",
      image: "/api/placeholder/400/300",
      color: "rgb(125, 75, 50)",
    },
    {
      id: 6,
      name: "History",
      image: "/api/placeholder/400/300",
      color: "rgb(45, 70, 185)",
    },
    {
      id: 7,
      name: "Philosophy",
      image: "/api/placeholder/400/300",
      color: "rgb(140, 25, 50)",
    },
    {
      id: 8,
      name: "Poetry",
      image: "/api/placeholder/400/300",
      color: "rgb(215, 242, 125)",
    },
  ];

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
        padding: isMobile ? "20px 12px" : "40px 20px",
        color: "white",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "28px" : "48px",
            fontWeight: "700",
            marginBottom: isMobile ? "12px" : "16px",
            background: "linear-gradient(90deg, #fff 0%, #e0e0e0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            padding: isMobile ? "0 10px" : 0,
          }}
        >
          What do you love to read?
        </h2>

        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: "#a0a0a0",
            marginBottom: isMobile ? "32px" : "48px",
            fontWeight: "300",
            padding: isMobile ? "0 20px" : 0,
          }}
        >
          Choose atleast 3 genres to get started
        </p>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fill, minmax(250px, 1fr))",
            gap: isMobile ? "12px" : "20px",
            padding: isMobile ? "10px" : "20px",
          }}
        >
          {genres.map((genre) => (
            <motion.div
              key={genre.id}
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleGenre(genre.id)}
              style={{
                position: "relative",
                height: isMobile ? "120px" : "180px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                background: genre.color,
                filter: selectedGenres.includes(genre.id)
                  ? "grayscale(0%)"
                  : "grayscale(100%)",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: selectedGenres.includes(genre.id)
                    ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))`
                    : `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "12px" : "20px",
                }}
              >
                <div
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "4px 16px" : "12px 24px",
                    transition: "all 0.2s ease",
                    width: "100%",
                    maxWidth: isMobile ? "140px" : "200px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMobile ? "16px" : "20px",
                      fontWeight: "600",
                      margin: 0,
                      color: selectedGenres.includes(genre.id)
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                      whiteSpace: "wrap",
                      overflow: "hidden",
                    }}
                  >
                    {genre.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: isMobile ? "16px" : "24px",
            background: "linear-gradient(transparent, #1a1a1a 40%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <motion.button
            whileHover={!isMobile ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              setLoading(true);
              await updateProfile(profile.userId, {
                ...profile,
                onboarded: true,
                readingInterests: genres
                  .filter((genre) => selectedGenres.includes(genre.id))
                  .map((item) => item.name),
              });
              setProfile({
                ...profile,
                onboarded: true,
                readingInterests: genres
                  .filter((genre) => selectedGenres.includes(genre.id))
                  .map((item) => item.name),
              });
              setLoading(false);
            }}
            style={{
              width: isMobile ? "100%" : "auto",
              padding: isMobile ? "16px" : "16px 48px",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: "white",
              backgroundColor: priColor,
              border: "none",
              borderRadius: isMobile ? "999px" : "30px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              opacity: selectedGenres.length > 0 ? 1 : 0.6,
              transition: "all 0.2s ease",
              WebkitTapHighlightColor: "transparent",
            }}
            disabled={selectedGenres.length < 3 || loading}
          >
            {loading ? "Saving..." : "Continue"}
          </motion.button>

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              margin: 0,
            }}
          >
            Selected {selectedGenres.length} genres
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingInterests;
