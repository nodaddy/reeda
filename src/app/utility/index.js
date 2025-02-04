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