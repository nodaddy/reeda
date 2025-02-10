import React, { useState, useEffect, useRef } from "react";
import { Typography, Modal, Button, Slider, Popover } from "antd";
import Dictionary from "@/app/dictionary/page";
import { LetterText, MagnetIcon, TextIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { priTextColor } from "@/configs/cssValues";


const { Text } = Typography;

const TextWithIntegratedDictionary = ({ text, fontSize, setFontSize }) => {
  const [selectedText, setSelectedText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const textContainerRef = useRef(null);

  const {nightModeOn} = useAppContext();

  // Function to handle single word click
  const handleWordClick = (word) => {
    setSelectedText(word);
    setIsModalVisible(true);
  };

  // Function to handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && textContainerRef.current?.contains(selection.anchorNode)) {
        const selected = selection.toString().trim();
        if (selected) {
          setSelectedText(selected);
          setIsModalVisible(true);
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

  // Function to handle font size change
  const handleFontSizeChange = (value) => {
    setFontSize(value);
  };

  return (
    <div>
      {/* Font size control for mobile view */}
      <div
        ref={textContainerRef}
        style={{
          display: "inline",
          fontSize: `${fontSize}px`,
          lineHeight: 1.5, // Improve readability
          wordBreak: "break-word", // Avoid text overflow
        }}
      >
        {text.split(/(\s+)/).map((part, index) =>
          part.trim() ? (
            <Text
              key={index}
              onClick={() => handleWordClick(part)}
              style={{
                cursor: "pointer",
                color: nightModeOn ? "lightgrey" : priTextColor,
                fontSize: `${fontSize}px`,
                display: "inline-block",
              }}
            >
              {part}
            </Text>
          ) : (
            <span key={index}>{part}</span> // Preserve spaces
          )
        )}

        <Modal
          title={<span style={{ fontSize: "20px", fontWeight: "500", paddingLeft: '10px' }}>{selectedText}</span>}
          width={'85%'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
        >
          <Dictionary incomingWords={selectedText} />
        </Modal>
      </div>
    </div>
  );
};


export const FontSizeControl = ({fontSize, setFontSize}) => {

  const handleFontSizeChange = value => {
    setFontSize(value);
  };

  const content = ( 
      <Slider 
        min={12} 
        max={30} 
        tooltip={false}
        vertical
        onChange={handleFontSizeChange} 
        value={fontSize} 
        style={{ height: '100px' }}
      /> 
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <Popover
        content={content}
        trigger="click"
        placement="top" // This places the popover above the button
      >
        <LetterText size={25} />
      </Popover>
    </div>
  );
};

export default TextWithIntegratedDictionary;
