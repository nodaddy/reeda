import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      console.log("FCM Token:", token);
    } catch (err) {
      console.error("Error getting token:", err);
    }
  } else {
    console.warn("Notification permission denied.");
  }
}

export default requestNotificationPermission;
