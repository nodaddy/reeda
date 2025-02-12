async function requestNotificationPermission() {
  if (Notification.permission === "granted") {
    console.log("Notifications already granted.");
    return;
  }

  if (Notification.permission === "denied") {
    console.log("Notifications are blocked. Ask the user to enable them in browser settings.");
    alert("You have blocked notifications. Please enable them in your browser settings.");
    return;
  }

  // Only prompt if permission is 'default'
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
  } else {
    console.log("Notification permission denied.");
  }
}

export default requestNotificationPermission;
