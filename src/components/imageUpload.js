"use client";
import { useState, useCallback } from "react";
import { Camera, Loader } from "lucide-react";
import styles from './ImageUpload.module.css';
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import { addCoinsPerScan, scanPageRatio, streakMaintenanceIntervalInSeconds } from "@/configs/variables";
import { storage } from "@/app/utility";
import { getPageSummaryFromImage, getPageSummaryFromImageStream, getSimplifiedLanguage, getSimplifiedLanguageStream } from "@/openAI";
import { useAppContext } from "@/context/AppContext";
import { flag } from "@/assets";
import NextImage from "next/image";
import { secTextColor } from "@/configs/cssValues";
import { logGAEvent } from "@/firebase/googleAnalytics";

export const toBlob = async (imageSrc) => {
  const response = await fetch(imageSrc);
  return response.blob();
};

export default function ImageUpload({ setBook, bookTitle, setData, setModalOpen }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const { profile, setProfile } = useAppContext();

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setShowCropper(true);
        handleUpload(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
    }
  };

  const handleUpload = async (imageSrc) => {
    setUploadingImage(true);
    const croppedFile = await toBlob(imageSrc);

    let scanDataResponse = [{
      summary: '',
      simpleLang: ''
    }];

    await Promise.all([
      getPageSummaryFromImageStream(croppedFile, 5, (chunk) => {
      setModalOpen(false);
      scanDataResponse = [{...scanDataResponse[0], summary: scanDataResponse[0].summary + chunk }];
        setData((prev) => {
          return prev ? {...prev, data: [{ ...prev.data[0], summary: prev.data[0].summary + chunk }]} : { bookTitle: bookTitle, data: [{ simpleLang: '' , summary: chunk }] };
        });
      }),
      getSimplifiedLanguageStream(croppedFile, (chunk) => {
      setModalOpen(false);
      scanDataResponse = [{...scanDataResponse[0], simpleLang: scanDataResponse[0].simpleLang + chunk }];
      setData((prev) => {
        return prev ? {...prev, data: [{ ...prev.data[0], simpleLang: prev.data[0].simpleLang + chunk }]} : { bookTitle: bookTitle, data: [{summary: '', simpleLang: chunk }] };
        });
      }),
    ])

    const book = await getBookByTitleAndUserId(bookTitle);
    const updatedBook = await updateBookByUserIdAndTitle(
        { ...book, pagesRead: book?.pagesRead ? book?.pagesRead + 1 : 1 },
        bookTitle
    );

    setBook(updatedBook);
    await createScan({ bookTitle, data: scanDataResponse });

     // const profile = await getProfile(JSON.parse(storage.getItem('user')).email);
     const timeDifferenceInSeconds = (Date.now() - profile?.streak.lastPageScanTimestamp) / 1000;
     // alert(timeDifferenceInSeconds);
     if (timeDifferenceInSeconds > streakMaintenanceIntervalInSeconds && timeDifferenceInSeconds < streakMaintenanceIntervalInSeconds * 2) { // < 48 hours & > 24 hours
       setProfile(await updateProfile(profile.userId, {
         ...profile,
         coins: (profile?.coins || 0) + addCoinsPerScan,
         streak: {
             ...profile.streak,
             days: (profile.streak?.days || 0) + 1,
             lastPageScanTimestamp: Date.now(),
         },
         }))
     } else if(timeDifferenceInSeconds > streakMaintenanceIntervalInSeconds * 2) {
      setProfile(await updateProfile(profile.userId, {
        ...profile,
        coins: (profile?.coins || 0) + addCoinsPerScan,
        streak: {
          ...profile.streak,
          longestStreak: Math.max(profile.streak.longestStreak || 0, profile.streak?.days || 0),
          days: 1,
          lastPageScanTimestamp: Date.now(),
      },
        }))
    } else {
      setProfile(await updateProfile(profile.userId, {
        ...profile,
        coins: (profile?.coins || 0) + addCoinsPerScan,
        streak: {
          ...profile.streak,
          lastPageScanTimestamp: Date.now(),
      },
        }))
    }
    setUploadingImage(false);
  };

  return (
    <div align="center">
      {!showCropper && <span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: secTextColor
        }}>
          <NextImage src={flag} style={{
            width: '29%',
            height: 'auto'
          }} /> 
          <br/>
          <br/>
          <br/>
          Snap a page from {bookTitle}!
          <br/> and start reading!
          </span>
        <div className={styles.fileInputContainer}>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            capture="camera"  // This ensures the camera is opened directly
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-upload" className={styles.fileInputLabel}>
            { uploadingImage ? <Loader size={32} color='white' className="loader" /> : <Camera onClick={() => { logGAEvent('click_scan_first_page_of_book') }} size={32} color="white" />}
          </label>
        </div>
      </span>}
    </div>
  );
}
