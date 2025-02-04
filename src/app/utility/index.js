export const getDiffernceInHoursBetweenDateStringAndNow = (dateString) => {
  
    const dateObj = new Date(dateString);
    console.log("Parsed Date:", dateObj);

    if (!isNaN(dateObj)) { // Check if the date is valid
      const now = new Date();
      const diff = now - dateObj; // Difference in milliseconds
      return diff / (1000 * 60 * 60); // Convert to hours
    } else {
      console.error("Invalid date format for dateString");
    }
}



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
