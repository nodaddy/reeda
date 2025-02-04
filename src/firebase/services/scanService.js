'use client'
import { storage } from '@/app/utility';
// services/scanService.js
import { db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, orderBy, getCountFromServer  } from "firebase/firestore";
const scanCollection = collection(db, "scans");

// Create a new scan
export const createScan = async (scanData) => {
  const userId = JSON.parse(storage.getItem('user')).email;

  try {
    // Ensure that scanData is not empty and contains valid fields
    if (!scanData || Object.keys(scanData).length === 0) {
      throw new Error("Scan data is empty");
    }

    console.log("Creating scan with data: ", scanData);

    // Adding scan document to Firestore
    const docRef = await addDoc(scanCollection, {
      ...scanData,
      userId,  // Ensure userId is included in the scan data
      createdAt: new Date(), // Optionally add a creation timestamp
    });

    console.log("Scan created with ID: ", docRef.id);
    return docRef.id;  // Return the document ID
  } catch (error) {
    console.error("Error adding scan: ", error);
    throw error;  // Re-throw the error to be handled by the calling function
  }
};

// Read the latest scan by userId and bookTitle
export const getLatestScan = async () => {
    const userId = JSON.parse(storage.getItem('user')).email;
  
    try {
      // Create a query to find scans by both userId and bookTitle, ordered by 'createdAt' in descending order
      const q = query(
        scanCollection,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")  // Order by creation date (descending to get the latest scan)
      );
  
      // Get the query snapshot
      const querySnapshot = await getDocs(q);
  
      // Check if we found any matching scans
      if (!querySnapshot.empty) {
        const latestScanDoc = querySnapshot.docs[0]; // Get the first (most recent) scan
        return { id: latestScanDoc.id, ...latestScanDoc.data() };
      } else {
        return null; // Return null if no scan was found
      }
    } catch (error) {
      console.error("Error getting latest scan: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  

// Read the latest scan by userId and bookTitle
export const getLatestScanByBookTitleAndUserId = async (bookTitle) => {
    const userId = JSON.parse(storage.getItem('user')).email;
  
    try {
      // Create a query to find scans by both userId and bookTitle, ordered by 'createdAt' in descending order
      const q = query(
        scanCollection,
        where("userId", "==", userId),
        where("bookTitle", "==", bookTitle),
        orderBy("createdAt", "desc")  // Order by creation date (descending to get the latest scan)
      );
  
      // Get the query snapshot
      const querySnapshot = await getDocs(q);
  
      // Check if we found any matching scans
      if (!querySnapshot.empty) {
        const latestScanDoc = querySnapshot.docs[0]; // Get the first (most recent) scan
        return { id: latestScanDoc.id, ...latestScanDoc.data() };
      } else {
        return null; // Return null if no scan was found
      }
    } catch (error) {
      console.error("Error getting latest scan: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  

// Read scans by userId and bookTitle
export const getScanByBookTitleAndUserId = async (bookTitle) => {
  const userId = JSON.parse(storage.getItem('user')).email;

  try {
    // Create a query to find scans by both userId and bookTitle
    const q = query(
      scanCollection,
      where("userId", "==", userId),
      where("bookTitle", "==", bookTitle)
    );

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Check if we found any matching scans
    if (!querySnapshot.empty) {
      const scanDoc = querySnapshot.docs[0]; // Get the first matching document
      return { id: scanDoc.id, ...scanDoc.data() };
    } else {
      return null; // Return null if no scan was found
    }
  } catch (error) {
    console.error("Error getting scan: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export const getScanCount = async () => {
    const userId = JSON.parse(storage.getItem('user')).email;
  
    try {
      console.log('Getting scan count');
  
      // Create a query to find scans by userId
      const q = query(scanCollection, where("userId", "==", userId));
  
      // Get the count directly from Firestore (no need to download full documents)
      const snapshot = await getCountFromServer(q);
  
      // Return the count of the documents
      return snapshot.data().count; // The count value is available under `.data().count`
    } catch (error) {
      console.error("Error getting scan count: ", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };

// Read all scans by userId (stored inside the document)
export const getScans = async () => {
  const userId = JSON.parse(storage.getItem('user')).email;

  try {
    console.log('Getting scans');

    // Create a query to find scans by userId
    const q = query(scanCollection, where("userId", "==", userId));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Check if we found any scans
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((scanDoc) => ({
        id: scanDoc.id,
        ...scanDoc.data(),
      }));
    } else {
      return []; // Return an empty array if no scans are found
    }
  } catch (error) {
    console.error("Error getting scans: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Update a scan by userId and bookTitle
export const updateScanByUserIdAndBookTitle = async (updatedData, bookTitle) => {
  const userId = JSON.parse(storage.getItem('user')).email;

  try {
    // Create a query to find the scan where both userId and bookTitle match
    const q = query(
      scanCollection,
      where("userId", "==", userId),
      where("bookTitle", "==", bookTitle)
    );

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching document
      const scanDoc = querySnapshot.docs[0];

      // Reference to the document using the document ID
      const scanRef = doc(db, "scans", scanDoc.id);

      // Update the document with the new data
      await updateDoc(scanRef, updatedData);
      console.log("Scan updated successfully");
    } else {
      throw new Error("Scan not found");
    }
  } catch (error) {
    console.error("Error updating scan: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Delete a scan by ID
export const deleteScan = async (scanId) => {
  try {
    const scanDoc = doc(db, "scans", scanId);
    await deleteDoc(scanDoc);
  } catch (error) {
    console.error("Error deleting scan: ", error);
    throw error;
  }
};
