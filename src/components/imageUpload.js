"use client";
import { useState, useCallback } from "react";
import { Camera, Loader } from "lucide-react";
import styles from './ImageUpload.module.css';
import Cropper from 'react-easy-crop';
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import { Button, Modal } from "antd";
import { scanPageRatio } from "@/configs/variables";
import { storage } from "@/app/utility";
import { getPageSummaryFromImage, getSimplifiedLanguage } from "@/openAI";

export default function ImageUpload({ setBook, bookTitle, setData, setModalOpen, inResults }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    alert("Crop complete");
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    alert("File change triggered");
    const file = e.target.files[0];
    if (file) {
      alert(`File selected: ${file.name}`);
      const reader = new FileReader();
      reader.onload = () => {
        alert("File loaded");
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      alert("No file selected");
    }
  };

  const getCroppedImage = (imageSrc, crop) => {
    alert("Getting cropped image");
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        alert("Image loaded on canvas");
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
        alert("Drawing image on canvas");
        canvas.toBlob((blob) => {
          alert("Blob created");
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = () => {
        alert("Error loading image");
      };
    });
  };

  const handleUpload = async () => {
    alert("Upload triggered");
    setUploadingImage(true);
    const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);

    getPageSummaryFromImage(croppedFile, 5).then((summary) => {
      alert("Summary generated");
      getSimplifiedLanguage(croppedFile).then(async (simpleLang) => {
        alert("Simplified language generated");

        const book = await getBookByTitleAndUserId(bookTitle);
        alert(`Book fetched: ${book.title}`);

        const updatedBook = await updateBookByUserIdAndTitle(
          { ...book, pagesRead: book.pagesRead ? book.pagesRead + 1 : 1 },
          bookTitle
        );
        alert("Book updated");

        const data = [{
          summary,
          simpleLang
        }];
        setBook(updatedBook);

        await createScan({ bookTitle, data });
        alert("Scan created");

        const profile = await getProfile(JSON.parse(storage.getItem('user')).email);
        alert("Profile fetched");

        if ((Date.now() - profile?.lastPageScanTimestamp) / 1000 > 84600) {
          await updateProfile(profile.email, {
            ...profile,
            streak: {
              ...profile.streak,
              days: profile.streak?.days + 1 || 1,
              lastPageScanTimestamp: Date.now(),
            },
          });
          alert("Profile streak updated");
        }

        setData({ data });
        setUploadingImage(false);
        setModalOpen(true);
        setShowCropper(false);
        alert("Process complete, modal open");
      });
    });
  };

  return (
    <div align="center">
      <Modal
        title="Crop Image"
        style={{ padding: "30px", borderRadius: "20px" }}
        okText={uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
        open={showCropper}
        onOk={() => { 
          alert("OK clicked");
          if (!uploadingImage) { handleUpload(); }
        }}
        onCancel={() => {
          alert("Cancel clicked");
          setShowCropper(false);
        }}
        onClose={() => {
          alert("Close clicked");
          setShowCropper(false);
        }}
      >
        <div>
          {uploadingImage ? <div style={{ height: '50vh' }}>animation</div> : <div>
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
      <br />
      <br />
      <br />
      {!showCropper && <span>
        <span>Snap a page!</span>
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
            <Camera size={32} color="white" />
          </label>
        </div>
      </span>}
    </div>
  );
}
