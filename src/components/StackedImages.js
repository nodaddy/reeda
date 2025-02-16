"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
      <AnimatePresence>
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Captured ${index}`}
            initial={{ y: index * 10, rotate: index % 2 === 0 ? -5 : 5, opacity: 0 }}
            animate={loading ? {
              scale: [1, 1.2, 0.8, 1.1, 1],
              rotate: [0, 10, -10, 5, 0],
              filter: [
                "blur(0px)", 
                "blur(3px)", 
                "brightness(1.5) saturate(1.2)", 
                "drop-shadow(0px 0px 10px rgba(255,255,255,0.8))", 
                "blur(0px)"
              ],
              opacity: [1, 0.8, 1, 0.9, 1],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            } : { y: index * 15, opacity: 1 }}
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
      </AnimatePresence>
    </div>
  );
};

export default StackedImages;
