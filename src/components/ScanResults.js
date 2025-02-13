'use client';

import { useState, useCallback, useEffect } from "react";
import { Button, Tooltip, Modal } from "antd";
import OriginalTextWithTooltips, { FontSizeControl } from "./TextWithIntegratedDictionary";
import { Camera, Hourglass, Loader, Plane, Plus, Pointer, WholeWord } from "lucide-react";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan, getLatestScanByBookTitleAndUserId } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import Cropper from 'react-easy-crop';
import { addCoinsPerScan, scanPageRatio, scanPageRation, streakMaintenanceIntervalInSeconds } from "@/configs/variables";
import { priColor } from "@/configs/cssValues";
import { storage } from "@/app/utility";
import { getPageSummaryFromImage, getSimplifiedLanguage } from "@/openAI";
import TextWithIntegratedDictionary from "./TextWithIntegratedDictionary";
import { useAppContext } from "@/context/AppContext";
import NightModeButton from "./NightModeButton";
import UploadingScanLoader from "./UploadingScanLoader";
import { logGAEvent } from "@/firebase/googleAnalytics";

export default function ScanResults({ setBook, scans }) {
  console.log(scans);
  const bookTitle = scans?.bookTitle;
  const [activeView, setActiveView] = useState("vocab");
  const [data, setData] = useState(scans?.data ? [scans.data[0]] : null);

  const [fontSize, setFontSize] = useState(17); // Default font size
  
  // States for cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const { profile, setProfile, nightModeOn } = useAppContext();


  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const file = files[0];  // Assuming single file upload
    const reader = new FileReader();
    
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };

    reader.readAsDataURL(file);
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

    setData({ ...data });
    setUploadingImage(false);
    setShowCropper(false);
  };

  return (
    <>
      {data && (
        <div
          style={{
            padding: '0px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'scroll',
            width: '82%',
            margin: 'auto',
            marginTop: '17px',
            borderTop: '0px',
            borderRadius: '10px',
            border: '1px solid silver',
            backgroundColor: nightModeOn ? 'black' : 'white',
            height: 'calc(100vh - 249px)', // This can be used if you want to explicitly set height too
            // padding: "25px",
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // maxHeight: 'calc(100vh - 270px)',
            // overflow: 'scroll',

          }}
        >
          <div
            style={{
              maxWidth: "800px",
              padding: "15px 0px",
              transition: "all 0.5s ease-in-out",
              overflowY: "auto",
            }}
          >
            {activeView === "summary" ? (
              <TextWithIntegratedDictionary fontSize={fontSize} setFontSize={setFontSize} text={data[0].summary} />
            ) : (
              <TextWithIntegratedDictionary fontSize={fontSize} setFontSize={setFontSize} text={data[0].simpleLang} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              alignItems: "center",
              justifyContent: "space-around",
              position: "absolute",
              width: "94%",
              bottom: "15px",
              padding: "0px 0px",
            }}
          >
            <div>
            <Button
                type={activeView === "summary" ? "primary" : "default"}
                style={{
                  padding: "16px 20px",
                  fontSize: "13px",
                  borderRadius: "999px 0px 0px 999px",
                  background: activeView === "summary" ? "#555555" : "#FFFFFF",
                  color: activeView === "summary" ? "#FFFFFF" : "#555555",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  setActiveView("summary");
                  logGAEvent('switch_between_takeaways_and_as_is');
                }}
              >
                Key Takeaways
              </Button>
              <Button
                type={activeView === "vocab" ? "primary" : "default"}
                style={{
                  padding: "16px 20px",
                  fontSize: "13px",
                  borderRadius: "0px 999px 999px 0px",
                  background: activeView === "vocab" ? "#555555" : "#FFFFFF",
                  color: activeView === "vocab" ? "#FFFFFF" : "#555555",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  setActiveView("vocab");
                  logGAEvent('switch_between_takeaways_and_as_is');
                }}
              >
                As is
              </Button>

              
            </div>

            <FontSizeControl fontSize={fontSize} setFontSize={setFontSize} />

            <NightModeButton /> 
             <div>
                {/* Hidden file input */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  capture="camera"  // This ensures the camera is opened directly
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {/* Label to trigger the file input when clicked */}
                <label
                  htmlFor="file-upload"
                  style={{
                    height: "45px",
                    width: "45px",
                    borderRadius: "50%",
                    backgroundColor: priColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Camera onClick={() => { logGAEvent('click_scan_more_pages_of_book') }} size={25} color="white" />
                </label>
              </div> 
          </div>
        </div>
      )}

      {/* Modal for cropping */}
      <Modal
        title="Crop and Upload Image"
        style={{ padding: "30px", borderRadius: "20px" }}
        okText={uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
        open={showCropper}
        onOk={() => { if(!uploadingImage) {handleUpload()}}}
        onCancel={() => setShowCropper(false)}
        onClose={() => setShowCropper(false)}
      >
        <div>
        {uploadingImage ? <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UploadingScanLoader />
          </div>:<div> 
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
    </>
  );
}

export const ContentBox = ({ text }) => (
  <div
    style={{
      color: "#2D2D2D",
      fontFamily: "'Inter', sans-serif",
      lineHeight: "1.75",
      letterSpacing: "0.75px",
      maxHeight: "60vh",
      textAlign: "left",
      paddingBottom: "30px",
      paddingTop: '10px',
      paddingLeft: '24px',
      fontSize: "16px",
      maxWidth: "90vw",
      whiteSpace: "pre-wrap",
    }}
  >
    {text}
  </div>
);
