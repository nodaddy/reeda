// services/profileService.js
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

const profileCollection = collection(db, "profiles");

// Create a new profile
export const createProfile = async (userId, profileData) => {
  try {
    // Ensure that profileData is not empty and contains valid fields
    if (!profileData || Object.keys(profileData).length === 0) {
      throw new Error("Profile data is empty");
    }

    console.log("Creating profile with data: ", profileData);

    // Reference to the profiles collection in Firestore
    const profileCollection = collection(db, "profiles");

    // Adding profile document to Firestore
    const docRef = await addDoc(profileCollection, {
      ...profileData,
      userId, // Ensure userId is included in the profile data
      createdAt: getCurrentTimestampInMilliseconds(), // Optionally add a creation timestamp
    });

    console.log("Profile created with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (error) {
    console.error("Error adding profile: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Read a profile by userId (stored inside the document)
export const getProfile = async (userId) => {
  try {
    // Reference to the profiles collection
    const profileCollection = collection(db, "profiles");

    // Create a query to find the document where userId matches
    const q = query(profileCollection, where("userId", "==", userId));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Check if we found any matching profile
    if (!querySnapshot.empty) {
      const profileDoc = querySnapshot.docs[0]; // Get the first matching document
      return { id: profileDoc.id, ...profileDoc.data() };
    } else {
      return null; // Return null if no profile was found
    }
  } catch (error) {
    console.error("Error getting profile: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Update a profile by userId (stored inside the document)
export const updateProfile = async (userId, updatedData) => {
  try {
    // Reference to the profiles collection
    const profileCollection = collection(db, "profiles");

    // Create a query to find the document where userId matches
    const q = query(profileCollection, where("userId", "==", userId));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching document
      const profileDoc = querySnapshot.docs[0];

      // Reference to the document using the document ID
      const profileRef = doc(db, "profiles", profileDoc.id);

      // Update the document with the new data
      await updateDoc(profileRef, updatedData);
      return updatedData; // to do: can be changed to actutally get the updated profile from the database,
    } else {
      throw new Error("Profile not found");
    }
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Delete a profile by ID
export const deleteProfile = async (profileId) => {
  try {
    const profileDoc = doc(db, "profiles", profileId);
    await deleteDoc(profileDoc);
  } catch (error) {
    console.error("Error deleting profile: ", error);
    throw error;
  }
};
