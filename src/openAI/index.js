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

// Helper function to convert and compress the image to base64 (grayscale, WebP) and alert the size
const toBase64 = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.3) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Read the image file as a data URL
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      
      img.onload = () => {
        // Calculate the new dimensions based on maxWidth and maxHeight while maintaining the aspect ratio
        let width = img.width;
        let height = img.height;

        const aspectRatio = width / height;
        
        // Resize to fit within the maxWidth and maxHeight without cropping (maintaining aspect ratio)
        if (width > maxWidth || height > maxHeight) {
          if (aspectRatio > 1) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }
        
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to grayscale (black and white)
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // Convert RGB to grayscale using the luminance formula
          const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = gray; // Set RGB values to the grayscale value
        }
        
        // Put the grayscale image data back to the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert the original image to base64
        const originalBase64 = reader.result.split(',')[1];
        const originalSizeInBytes = originalBase64.length * (3 / 4) - (originalBase64.indexOf('=') > -1 ? originalBase64.split('=').length - 1 : 0);
        const originalSizeInKB = (originalSizeInBytes / 1024).toFixed(2); // Size in KB

        // Convert the canvas to WebP format with the desired quality
        const webpBase64 = canvas.toDataURL('image/webp', quality);
        const webpSizeInBytes = webpBase64.length * (3 / 4) - (webpBase64.indexOf('=') > -1 ? webpBase64.split('=').length - 1 : 0);
        const webpSizeInKB = (webpSizeInBytes / 1024).toFixed(2); // Size in KB
        
        // Alert both original and WebP compressed sizes
        // alert(`Original image size: ${originalSizeInKB} KB\nCompressed image size (WebP): ${webpSizeInKB} KB`);
        
        // Resolve with the WebP base64 string (without the header)
        resolve(webpBase64.split(',')[1]); 
      };
      
      img.onerror = (error) => reject(error);
    };

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
            content: `You are an AI that extracts text from images of book page and replace some difficult or tough or phrases words with simple words using the format (difficult word)[simpler word], Provide only the transformed text without any additional commentary or phrases like "Certainly!" or "Here is the text.`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${file.type};base64,${imageBase64}` }
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

    let responseText = response.data.choices[0].message.content.trim();

    return responseText; 
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
