export const getDiffernceInHoursBetweenDateStringAndNow = (dateString) => {
  const dateObj = new Date(dateString);
  console.log("Parsed Date:", dateObj);

  if (!isNaN(dateObj)) {
    // Check if the date is valid
    const now = new Date();
    const diff = now - dateObj; // Difference in milliseconds
    return diff / (1000 * 60 * 60); // Convert to hours
  } else {
    console.error("Invalid date format for dateString");
  }
};

const isBrowser = typeof window !== "undefined";

export const storage = {
  getItem: (key) => {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (isBrowser) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  },
  clearItem: () => {
    if (isBrowser) {
      localStorage.clear();
    }
  },
};

// method to generate a colour for a string
export const generateRandomColourForString = (title) => {
  if (!title) return "#CCCCCC"; // Default color if title is missing

  // Generate a hash from the title
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to a 6-character hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2); // Ensure 2-digit hex
  }

  // Adjust brightness for a premium feel
  return adjustColorBrightness(color, 30);
};

// Function to adjust brightness (lighten/darken)
const adjustColorBrightness = (hex, percent) => {
  let num = parseInt(hex.slice(1), 16),
    r = (num >> 16) + percent,
    g = ((num >> 8) & 0x00ff) + percent,
    b = (num & 0x0000ff) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

export const updatePagesRead = (pages) => {
  const today = new Date().toDateString(); // Get today's date as a string
  const storedData = JSON.parse(storage.getItem("pagesReadData")) || {};

  if (storedData.date !== today) {
    // If the stored date is not today, reset the count
    storedData.date = today;
    storedData.count = 0;
  }

  // Increment the count and save
  storedData.count += pages;
  storage.setItem("pagesReadData", JSON.stringify(storedData));
};

// Function to get today's page count
export const getPagesReadToday = () => {
  const storedData = JSON.parse(storage.getItem("pagesReadData")) || {};
  return storedData.date === new Date().toDateString() ? storedData.count : 0;
};

export const getCurrentTimestampInMilliseconds = () => {
  return Date.now();
};
