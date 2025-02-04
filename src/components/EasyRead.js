import React from "react";
import { Tooltip, Typography } from "antd";
import { Content } from "next/font/google";
import { ContentBox } from "./ScanResults";

const { Text } = Typography;

const EasyRead = ({ text }) => {
  // Regex to match (word) [meaning]
  const regex = /\((.*?)\) \[(.*?)\]/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, word, meaning] = match;

    // Add the text before the matched word
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the meaning text (visible) and word in the tooltip
    parts.push(
      <Tooltip key={match.index} title={word}>
        <Text style={{ color: 'green', cursor: "pointer" }}>
          {meaning}
        </Text>
      </Tooltip>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <ContentBox text={parts}></ContentBox>
  );
};

export default EasyRead;
