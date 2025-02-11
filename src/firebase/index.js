// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { storage } from "@/app/utility";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);

const handleDeleteAccount = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await user.delete();
      alert("Your account has been deleted successfully.");
      storage.removeItem('user');
      window.location.reload();
      // Redirect user or show confirmation message
    } catch (error) {
      console.error("Error deleting account:", error.message);
      if (error.code === "auth/requires-recent-login") {
        alert("This action requires recent login. Please log out and try agian by loggin in again");
        // Trigger reauthentication here
      }
    }
  }
};


export {
    auth,
    db,
    googleAuthProvider,
    analytics,
    handleDeleteAccount
}