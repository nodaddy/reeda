import OpenAI from "openai";
import axios from 'axios';

// Replace with your actual OpenAI API key
const API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;

const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
    organization: "org-jkBqACiLqgRU8flgdZdYsOio",
    project: process.env.NEXT_PUBLIC_OPEN_AI_PROJECT_ID,
});

// Method to call the OpenAI API
export const getPageSummary = async (message, sentenceLimit) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  console.log(message);

  try {
    const response = await axios.post(
      url,
      {
        model: 'gpt-4o-mini',
        messages: [
        {role: "system", content: `you are a summarizer who summarizes precisely the text which will be a page from some book, user will give you a book page and you will summarize it in ${6} sentences`},
        {
            role: "user",
            content: message
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



export const getSimplifiedLanguage = async (message) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  console.log(message);

  try {
    const response = await axios.post(
      url,
      {
        model: 'gpt-4o-mini',
        messages: [
        {role: "system", content: "you are a translator from english to simplified english, you will replace tough english words with easier words or phrases, your response must be grammatically correct, also wrap the simplified words in brackets [] to distinguish them from the original words and also wrap the original words in parentheses () to distinguish them from the simplified words"},
        {
            role: "user",
            content: message
        }
      ],
      temperature: 0
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