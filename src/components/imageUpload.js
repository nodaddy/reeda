"use client";
import { useState, useCallback } from "react";
import { Camera, Loader } from "lucide-react";
import styles from './ImageUpload.module.css';
import Cropper from 'react-easy-crop';
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import { Button, Modal } from "antd";
import { addCoinsPerScan, scanPageRatio, streakMaintenanceIntervalInSeconds } from "@/configs/variables";
import { storage } from "@/app/utility";
import { getPageSummaryFromImage, getSimplifiedLanguage } from "@/openAI";
import { useAppContext } from "@/context/AppContext";
import { flag } from "@/assets";
import NextImage from "next/image";
import { secTextColor } from "@/configs/cssValues";
import UploadingScanLoader from "./UploadingScanLoader";
import { logGAEvent } from "@/firebase/googleAnalytics";

export default function ImageUpload({ setBook, bookTitle, setData, setModalOpen }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
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
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
    }
  };

  const getCroppedImage = (imageSrc, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = () => {
      };
    });
  };

  const handleUpload = async () => {
    setUploadingImage(true);
    const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);

    const [summary, simpleLang] = await Promise.all([
      getPageSummaryFromImage(croppedFile, 5),
      getSimplifiedLanguage(croppedFile),
    ])

    const book = await getBookByTitleAndUserId(bookTitle);
    const updatedBook = await updateBookByUserIdAndTitle(
        { ...book, pagesRead: book?.pagesRead ? book?.pagesRead + 1 : 1 },
        bookTitle
    );

    const data = [{
        summary,
        simpleLang
    }]
    setBook(updatedBook);
    await createScan({ bookTitle, data });

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

    setData({ data: data, bookTitle: bookTitle });
    setUploadingImage(false);
    setShowCropper(false);
    setModalOpen(false);
  };

  return (
    <div align="center">
      <Modal
        title="Crop and Upload Image"
        style={{ padding: "30px", borderRadius: "20px" }}
        open={showCropper}
        footer={[
          <Button key="back" onClick={() => setShowCropper(false)}>
            Cancel
          </Button>,
          <Button key="submit" style={{backgroundColor: 'black'}} type="primary" onClick={() => { if (!uploadingImage) { handleUpload(); } }}>
            {uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
          </Button>,
        ]}
        onCancel={() => {
          setShowCropper(false);
        }}
        onClose={() => {
          setShowCropper(false);
        }}
      >
        <div>
          {uploadingImage ? <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UploadingScanLoader />
          </div> : <div>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              aspect={scanPageRatio}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>}
        </div>
      </Modal> 
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
            <Camera onClick={() => { logGAEvent('click_scan_first_page_of_book') }} size={32} color="white" />
          </label>
        </div>
      </span>}
    </div>
  );
}
