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

const notesCollection = collection(db, "notes");

// Create a new note
export const createNote = async (bookId, noteData) => {
  try {
    if (!noteData || Object.keys(noteData).length === 0) {
      throw new Error("Note data is empty");
    }

    console.log("Creating note with data: ", noteData);

    const { title, description, tags } = noteData;

    const docRef = await addDoc(notesCollection, {
      title,
      description,
      tags,
      bookId,
      createdAt: getCurrentTimestampInMilliseconds(),
    });

    console.log("Note created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding note: ", error);
    throw error;
  }
};

// Read all notes for a specific bookId
export const getNotesByBookId = async (bookId) => {
  try {
    const q = query(notesCollection, where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);

    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return notes;
  } catch (error) {
    console.error("Error getting notes: ", error);
    throw error;
  }
};

// Update a note by its ID
export const updateNote = async (noteId, updatedData) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
      throw new Error("Note not found");
    }

    const existingData = noteSnap.data();

    // Merge existing data with updated fields
    const newData = { ...existingData, ...updatedData, updatedAt: new Date() };

    await updateDoc(noteRef, newData);

    console.log("Note updated:", noteId);
    return newData;
  } catch (error) {
    console.error("Error updating note: ", error);
    throw error;
  }
};

// Delete a note by its ID
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);

    console.log("Note deleted:", noteId);
  } catch (error) {
    console.error("Error deleting note: ", error);
    throw error;
  }
};
