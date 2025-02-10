'use client'
import { storage } from '@/app/utility';
// services/bookservice.js
import { db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
const bookCollection = collection(db, "books");



// Create a new book
export const createbook = async (bookData) => {
const userId = JSON.parse(storage.getItem('user')).email;

// trim book title for any leading and trailing spaces
bookData.title = bookData.title.trim();

    try {
      // Ensure that bookData is not empty and contains valid fields
      if (!bookData || Object.keys(bookData).length === 0) {
        throw new Error("book data is empty");
      }
  
      console.log("Creating book with data: ", bookData);
  
      // Reference to the books collection in Firestore
      const bookCollection = collection(db, "books");
  
      // Adding book document to Firestore
      const docRef = await addDoc(bookCollection, {
        ...bookData,
        pagesRead: 0,
        userId,  // Ensure userId is included in the book data
        createdAt: new Date(), // Optionally add a creation timestamp
      });
  
      console.log("book created with ID: ", docRef.id);
      return docRef.id;  // Return the document ID
    } catch (error) {
      console.error("Error adding book: ", error);
      throw error;  // Re-throw the error to be handled by the calling function
    }
  };

// Read a book by userId and title
export const getBookByTitleAndUserId = async (title) => {
const userId = JSON.parse(storage.getItem('user')).email;
    try {
      // Reference to the books collection
      const bookCollection = collection(db, "books");
  
      // Create a query to find the document where both userId and title match
      const q = query(
        bookCollection,
        where("userId", "==", userId),
        where("title", "==", title)
      );
  
      // Get the query snapshot
      const querySnapshot = await getDocs(q);
  
      // Check if we found any matching book
      if (!querySnapshot.empty) {
        const bookDoc = querySnapshot.docs[0]; // Get the first matching document
        return { id: bookDoc.id, ...bookDoc.data() };
      } else {
        return null; // Return null if no book was found
      }
    } catch (error) {
      console.error("Error getting book: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  

// Read all books by userId (stored inside the document)
export const getBooks = async () => {
const userId = JSON.parse(storage.getItem('user')).email;
    try {
        console.log('getting books');

      // Reference to the books collection
      const bookCollection = collection(db, "books");
  
      // Create a query to find documents where userId matches
      const q = query(bookCollection, where("userId", "==", userId));
  
      // Get the query snapshot
      const querySnapshot = await getDocs(q);
  
      // Check if we found any matching books
      if (!querySnapshot.empty) {
        // Map through the documents and return an array of books
        return querySnapshot.docs.map((bookDoc) => ({
          id: bookDoc.id,
          ...bookDoc.data(),
        }));
      } else {
        return []; // Return an empty array if no books are found
      }
    } catch (error) {
      console.error("Error getting books: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  

// Update a book by userId (stored inside the document)
export const updateBookByUserIdAndTitle = async (updatedData, title) => {
    const userId = JSON.parse(storage.getItem('user')).email;
    try {
      // Reference to the books collection
      const bookCollection = collection(db, "books");
  
      // Create a query to find the document where both userId and title match
      const q = query(
        bookCollection,
        where("userId", "==", userId),
        where("title", "==", title)
      );
  
      // Get the query snapshot
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Get the first matching document
        const bookDoc = querySnapshot.docs[0];
  
        // Reference to the document using the document ID
        const bookRef = doc(db, "books", bookDoc.id);
  
        // Update the document with the new data
        await updateDoc(bookRef, updatedData);

        console.log("Book updated successfully with data" + JSON.stringify(updatedData));
        return updatedData;
      } else {
        throw new Error("Book not found");
      }
    } catch (error) {
      console.error("Error updating book: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  
// Delete a book by ID
export const deleteBook = async (bookId) => {
  try {
    const bookDoc = doc(db, "books", bookId);
    await deleteDoc(bookDoc);
  } catch (error) {
    console.error("Error deleting book: ", error);
    throw error;
  }
};