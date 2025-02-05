import React, { useState, useEffect, useRef } from "react";
import { Typography } from "antd";

const { Text } = Typography;

const OriginalTextWithTooltips = ({ paragraph }) => {
  const [selectedText, setSelectedText] = useState("");
  const textContainerRef = useRef(null);

  // Function to handle single word click
  const handleWordClick = (word) => {
    alert(word);
  };

  // Function to handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && textContainerRef.current?.contains(selection.anchorNode)) {
        const selected = selection.toString().trim();
        if (selected) {
          setSelectedText(selected);
        }
      }
    };

    const textContainer = textContainerRef.current;
    if (textContainer) {
      textContainer.addEventListener("mouseup", handleSelection);
      textContainer.addEventListener("touchend", handleSelection); // Mobile support
    }

    return () => {
      if (textContainer) {
        textContainer.removeEventListener("mouseup", handleSelection);
        textContainer.removeEventListener("touchend", handleSelection);
      }
    };
  }, []);

  // Show alert when selection changes
  useEffect(() => {
    if (selectedText) {
      alert(selectedText);
      setSelectedText(""); // Reset selection
    }
  }, [selectedText]);

  return (
    <div ref={textContainerRef} style={{ display: "inline" }}>
      {paragraph.split(/(\s+)/).map((part, index) =>
        part.trim() ? (
          <Text
            key={index}
            onClick={() => handleWordClick(part)}
            style={{ cursor: "pointer" }}
          >
            {part}
          </Text>
        ) : (
          <span key={index}>{part}</span> // Preserve spaces
        )
      )}
    </div>
  );
};

export default OriginalTextWithTooltips;
