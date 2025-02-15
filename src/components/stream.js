import React, { useState } from 'react';
import { getSummaryFromTextStream } from '@/openAI';

const TextSummarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSummarize = async () => {
    setSummary(''); // Clear previous summary

    await getSummaryFromTextStream(inputText, (chunk) => {
      setSummary((prev) => prev + chunk);
    });
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text to summarize"
      />
      <button onClick={handleSummarize}>Summarize</button>
      <div>
        <h3>Summary:</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default TextSummarizer;
