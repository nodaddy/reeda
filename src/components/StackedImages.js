"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import Loading from "./Loading";

const StackedImages = ({ images, loading }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div 
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "300px",
        height: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      { loading ? <Loading messages={[
    "Let's go!",
    "Adding dictionary",
    "Almost done!",
    "Almost done!",
    "Almost done!",
    "Almost done!",
    "Almost done!",
]} /> : <AnimatePresence>
        {images.map((src, index) => (
          <motion.img
            key={index}
            
            src={src}
            alt={`Captured ${index}`}
            initial={{ y: index * 10, rotate: index % 2 === 0 ? -5 : 5, opacity: 0 }}
            animate={ { y: index * 15, opacity: 1 }}
            whileTap={{ scale: 1.1 }}
            drag="y"
            dragConstraints={{ top: -50, bottom: 50 }}
            style={{
              position: "absolute",
              width: expanded === index ? "150px" : "100px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "2px solid #ddd",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              zIndex: images.length - index,
            }}
            onClick={() => setExpanded(expanded === index ? null : index)}
          />
        ))}
      </AnimatePresence>}
    </div>
  );
};

export default StackedImages;
