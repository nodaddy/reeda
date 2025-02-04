"use client";
import { useState, useCallback } from "react";
import { Camera, Loader } from "lucide-react";
import styles from './ImageUpload.module.css';
import Cropper from 'react-easy-crop';
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import { Button, Modal } from "antd";
import { priColor } from "@/configs/cssValues";
import { scanPageRatio } from "@/configs/variables";
import { storage } from "@/app/utility";

export default function ImageUpload({ setBook, bookTitle, setData, setModalOpen, inResults }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

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
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
      };
    });
  };

  const handleUpload = async () => {
    setUploadingImage(true);
    const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);
    const formData = new FormData();
    formData.append("file", croppedFile);

    const res = await fetch(`/api/uploadscans`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const book = await getBookByTitleAndUserId(bookTitle);
      const updatedBook = await updateBookByUserIdAndTitle(
        { ...book, pagesRead: book.pagesRead ? book.pagesRead + 1 : 1 },
        bookTitle
      );
      setBook(updatedBook);
      await createScan({ bookTitle, data });

      const profile = await getProfile(JSON.parse(storage.getItem('user')).email);
      if ((Date.now() - profile?.lastPageScanTimestamp) / 1000 > 84600) {
        await updateProfile(profile.email, {
          ...profile,
          streak: {
            ...profile.streak,
            days: profile.streak?.days + 1 || 1,
            lastPageScanTimestamp: Date.now(),
          },
        });
      }

      setData({ data });
    setUploadingImage(false);
      setModalOpen(true);
      setShowCropper(false);
    }
  };

  return (
    <div align="center">
      <Modal
        title="Crop Image"
        style={{ padding: "30px", borderRadius: "20px" }}
        okText={uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
        open={showCropper}
        onOk={() => { if(!uploadingImage) {handleUpload()}}}
        onCancel={() => setShowCropper(false)}
        onClose={() => setShowCropper(false)}
      >
       <div>
          {uploadingImage ? <div style={{height: '50vh'}}>animation</div>:<div> 
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
  <br/>
  <br/>
  <br/> 
  {!showCropper && <span>
      <span>Snap a page!</span>
      <div className={styles.fileInputContainer}>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
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