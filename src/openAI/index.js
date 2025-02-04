import OpenAI from "openai";
import axios from 'axios';

// Replace with your actual OpenAI API key
const API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;

// const openai = new OpenAI({
//     apiKey: API_KEY,
//     dangerouslyAllowBrowser: true,
//     organization: "org-jkBqACiLqgRU8flgdZdYsOio",
//     project: process.env.NEXT_PUBLIC_OPEN_AI_PROJECT_ID,
// });

// Method to call the OpenAI API
export const getPageSummaryFromImage = async (file, sentenceLimit) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    // Convert image to base64
    const imageBase64 = await toBase64(file);

    const response = await axios.post(
      url,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: `You are a summarizer who extracts text from a book page image and summarizes it in ${sentenceLimit} sentences.`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {url: `data:${file.type};base64,${imageBase64}`}
              }
            ]
          }
        ],
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(response);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// Helper function to convert file to base64
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove `data:image/...;base64,`
    reader.onerror = (error) => reject(error);
  });
};


// Method to call the OpenAI API
export const getMeaning = async (words) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  console.log(words);

  try {
    const response = await axios.post(
      url,
      {
        model: 'gpt-4o-mini',
        messages: [
        {role: "system", content: `you have to tell the meaning of the given words with as simple words as possible, explain quickly with as simple words as possible`},
        {
            role: "user",
            content: "tell me the meaning of" + words
        }
      ],
        temperature: 0.4,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    ).then(response => response.data).catch(error => {
          console.error('Error fetching chat completion:', error);
          throw error;
        });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
};

// Method to call the OpenAI API
export const getSimplifiedLanguage = async (file) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    // Convert image to base64
    const imageBase64 = await toBase64(file);

    const response = await axios.post(
      url,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: `scan the text in the image, it is an image from a book page. your job is to extract the text from the image and replace the some tough words in the text with simple words, keep the tough original words in small braces () and the new simple words in square brackets []. eg. replace 'i am feeling ravenous and thirsty' with 'i am feeling (ravenous)[very hungry] and thirsty'`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {url: `data:${file.type};base64,${imageBase64}`}
              }
            ]
          }
        ],
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log(response);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};