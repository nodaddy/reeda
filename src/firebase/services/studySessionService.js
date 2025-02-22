import { getCurrentTimestampInMilliseconds } from "@/app/utility";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const studySessionsCollection = collection(db, "studySessions");

// ✅ Create a new study session
export const createStudySession = async (bookId, sessionData) => {
  try {
    if (!sessionData || Object.keys(sessionData).length === 0) {
      throw new Error("Study session data is empty");
    }

    console.log("Creating study session with data: ", sessionData);

    const { pagesCovered, summary, duration } = sessionData;

    const docRef = await addDoc(studySessionsCollection, {
      pagesCovered,
      summary,
      duration, // e.g., duration in minutes
      bookId,
      createdAt: getCurrentTimestampInMilliseconds(),
    });

    console.log("Study session created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding study session: ", error);
    throw error;
  }
};

// ✅ Read all study sessions for a specific bookId
export const getStudySessionsByBookId = async (bookId) => {
  try {
    const q = query(studySessionsCollection, where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);

    const studySessions = [];
    querySnapshot.forEach((doc) => {
      studySessions.push({ id: doc.id, ...doc.data() });
    });

    return studySessions;
  } catch (error) {
    console.error("Error getting study sessions: ", error);
    throw error;
  }
};

// ✅ Update a study session by its ID
export const updateStudySession = async (sessionId, updatedData) => {
  try {
    const sessionRef = doc(db, "studySessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      throw new Error("Study session not found");
    }

    const existingData = sessionSnap.data();

    // Merge existing data with updated fields
    const newData = { ...existingData, ...updatedData, updatedAt: new Date() };

    await updateDoc(sessionRef, newData);

    console.log("Study session updated:", sessionId);
    return newData;
  } catch (error) {
    console.error("Error updating study session: ", error);
    throw error;
  }
};

// ✅ Delete a study session by its ID
export const deleteStudySession = async (sessionId) => {
  try {
    const sessionRef = doc(db, "studySessions", sessionId);
    await deleteDoc(sessionRef);

    console.log("Study session deleted:", sessionId);
  } catch (error) {
    console.error("Error deleting study session: ", error);
    throw error;
  }
};
