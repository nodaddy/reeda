import React from "react";
import { Tooltip, Typography } from "antd";
import { priColor, secColor } from "@/configs/cssValues";
import { Content } from "next/font/google";
import { ContentBox } from "./ScanResults";

const { Text } = Typography;

const OriginalTextWithTooltips = ({paragraph}) => {
  // Regex to match (word) [meaning]
  const regex = /\((.*?)\) \[(.*?)\]/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(paragraph)) !== null) {
    const [fullMatch, word, meaning] = match;

    // Add the text before the matched word
    if (match.index > lastIndex) {
      parts.push(paragraph.substring(lastIndex, match.index));
    }

    // Add the highlighted word inside ()
    parts.push(
      <Tooltip key={match.index} title={meaning}>
        <Text style={{ color: "green", cursor: "pointer", fontSize: '16px' }}>
          {word}
        </Text>
      </Tooltip>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < paragraph?.length) {
    parts.push(paragraph.substring(lastIndex));
  }

  return (
    <ContentBox text={parts} />
  );
};

export default OriginalTextWithTooltips;
