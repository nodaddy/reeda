// Replace with your actual OpenAI API key
const API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;

// const openai = new OpenAI({
//     apiKey: API_KEY,
//     dangerouslyAllowBrowser: true,
//     organization: "org-jkBqACiLqgRU8flgdZdYsOio",
//     project: process.env.NEXT_PUBLIC_OPEN_AI_PROJECT_ID,
// });

// Method to call the OpenAI API
// Shared helper function to handle streaming responses
const handleStream = async (response, onData) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    // Decode the chunk and add it to our buffer
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    
    // Split the buffer into lines and process each complete line
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
    
    for (const line of lines) {
      if (!line.trim() || line === 'data: [DONE]') continue;
      
      try {
        const jsonString = line.replace(/^data: /, '').trim();
        const json = JSON.parse(jsonString);
        const content = json.choices[0]?.delta?.content;
        if (content) {
          onData(content);
        }
      } catch (error) {
        console.warn('Error parsing JSON:', error);
      }
    }
  }
};

export const getPageSummaryFromImageStream = async (file, sentenceLimit, onData) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const imageBase64 = await toBase64(file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: `You are a summarizer, provide only the takeaways in the image text without any additional commentar, be quick as much as possible, i want instant result`
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
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    await handleStream(response, onData);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const getMeaningStream = async (words, onData) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: `you have to tell the meaning of the given words with as simple words as possible, explain quickly with as simple words as possible`
          },
          {
            role: "user",
            content: "tell me the meaning of" + words
          }
        ],
        temperature: 0.4,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    await handleStream(response, onData);
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
};

export const getSimplifiedLanguageStream = async (file, onData) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const imageBase64 = await toBase64(file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: `You are an AI that extracts text from images of book page, provide only the text in the image without any additional commentary, be quick as much as possible, i want instant result`
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
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    await handleStream(response, onData);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const getSummaryFromTextStream = async (words, onData) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a person who helps summarize the text provided, be quick as much as possible and give response within 60 words' },
          { role: 'user', content: words },
        ],
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      // Decode the chunk and add it to our buffer
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Split the buffer into lines and process each complete line
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue;

        // Remove the "data: " prefix and parse the JSON
        const jsonString = line.replace(/^data: /, '').trim();
        
        // Skip "[DONE]" message
        if (jsonString === '[DONE]') continue;

        try {
          const json = JSON.parse(jsonString);
          // Extract the content from the delta if it exists
          const content = json.choices[0]?.delta?.content;
          if (content) {
            onData(content);
          }
        } catch (error) {
          console.warn('Error parsing JSON:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching chat completion:', error);
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
