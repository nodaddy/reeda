'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import { Button, Tooltip, Modal, Popconfirm, Progress, Input, Slider } from "antd";
import OriginalTextWithTooltips, { FontSizeControl } from "./TextWithIntegratedDictionary";
import { Camera, Delete, Hourglass, Loader, PackagePlus, Plane, Plus, PlusCircle, PlusIcon, PlusSquare, Pointer, RefreshCcw, Rocket, Sparkles, WholeWord } from "lucide-react";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { createScan, getLatestScanByBookTitleAndUserId } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId, updateBookByUserIdAndTitle } from "@/firebase/services/bookService";
import { addCoinsPerScan, scanPageRatio, scanPageRation, streakMaintenanceIntervalInSeconds } from "@/configs/variables";
import { getPageSummaryFromImage, getPageSummaryFromImageStream, getSimplifiedLanguage, getSimplifiedLanguageStream } from "@/openAI";
import TextWithIntegratedDictionary from "./TextWithIntegratedDictionary";
import { useAppContext } from "@/context/AppContext";
import NightModeButton from "./NightModeButton";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { toBlob } from "./imageUpload";
import { secColor } from "@/configs/cssValues";

export default function ScanResults({ setBook, scans }) {
  // console.log(scans);
  const bookTitle = scans?.bookTitle;
  const [activeView, setActiveView] = useState("summary");
  const [data, setData] = useState(null);

  const [fontSize, setFontSize] = useState(14); // Default font size
  
  // States for cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const { profile, setProfile, nightModeOn } = useAppContext();

  const [images, setImages] = useState([]);

  const [selectedSessionNumberOfPages, setSelectedSessionNumberOfPages] = useState(3);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prevImages) => [...prevImages, imageUrl]);
    }
  };

  const getBlob = async (src) => {
  
    const offscreenCanvas = document.createElement("canvas");
    const context = offscreenCanvas.getContext("2d");
  
    if (!context) {
      console.error("Canvas context is not available!");
      return null;
    }
  
    const imageElement = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  
    // Set offscreen canvas size
    offscreenCanvas.width = imageElement.width;
    offscreenCanvas.height = imageElement.height;
  
    context.drawImage(imageElement, 0, 0);
  
    return new Promise((resolve) => {
      offscreenCanvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };
  
  
  


  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
   setData(scans?.data ? [scans.data[0]] : null);
  }, [scans]);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const file = files[0];  // Assuming single file upload
    const reader = new FileReader();
    
    reader.onload = () => {
      // setImageSrc(reader.result);
      setData([{
        summary: '',
        simpleLang: ''
      }])
      handleUpload(reader.result);
      // setShowCropper(true);
    };

    reader.readAsDataURL(file);
  };

  // const getCroppedImage = (imageSrc, crop) => {
  //   return new Promise((resolve) => {
  //     const image = new Image();
  //     image.src = imageSrc;
  //     image.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = crop.width;
  //       canvas.height = crop.height;
  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(
  //         image,
  //         crop.x,
  //         crop.y,
  //         crop.width,
  //         crop.height,
  //         0,
  //         0,
  //         crop.width,
  //         crop.height
  //       );
  //       canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
  //     };
  //   });
  // };

  useEffect(() => {
    if (images.length == selectedSessionNumberOfPages) {
      setTimeout(() => {
      handleUpload();
      }, 200)
    }
  }, [images]);
 
  const handleUpload = async () => {
    setUploadingImage(true);

    let scanDataResponse = [{
      summary: '',
      simpleLang: ''
    }];

    for (const image of images) {
      const croppedFile = await getBlob(image);
    
      if (!croppedFile) {
        console.error("Failed to create blob for image:", image);
        continue; // Skip this iteration if blob creation fails
      }
    
      await Promise.all([
        getPageSummaryFromImageStream(croppedFile, 5, (chunk) => {
          setUploadingImage(false);
    
          // Ensure scanDataResponse[0] exists before modifying
          if (!scanDataResponse[0]) {
            scanDataResponse[0] = { summary: "", simpleLang: "" };
          }
          scanDataResponse[0].summary += chunk;
    
          setData((prev) => 
            prev 
              ? [{ ...prev[0], summary: prev[0].summary + chunk }] 
              : [{ summary: chunk }]
          );
        }),
    
        getSimplifiedLanguageStream(croppedFile, (chunk) => {
          setUploadingImage(false);
    
          // Ensure scanDataResponse[0] exists before modifying
          if (!scanDataResponse[0]) {
            scanDataResponse[0] = { summary: "", simpleLang: "" };
          }
          scanDataResponse[0].simpleLang += chunk;
    
          setData((prev) => 
            prev 
              ? [{ ...prev[0], simpleLang: prev[0].simpleLang + chunk }] 
              : [{ simpleLang: chunk }]
          );
        }),
      ]);
    }


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
    setImages([]);
    // setShowCropper(false);
  };

  return (
    <>
      {true && (
        <div
          style={{
            padding: '0px 11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'scroll',
            width: '95%',
            margin: 'auto',
            marginTop: '17px',
            borderTop: '0px',
            borderRadius: '10px',
            // border: '1px solid silver',
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
          {data && <div
            style={{
              maxWidth: "800px",
              padding: "5px 0px",
              transition: "all 0.5s ease-in-out",
              overflowY: "auto",
            }}
          >
            {activeView === "summary" ? (
              <TextWithIntegratedDictionary fontSize={fontSize} setFontSize={setFontSize} text={data[0].summary} />
            ) : (
              <TextWithIntegratedDictionary fontSize={fontSize} setFontSize={setFontSize} text={data[0].simpleLang} />
            )}
          </div>}

          {!data && 

<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", padding: "10px" }}>
  
{/* Grid Layout for Images + Capture Button */}
<div style={{ 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
    gap: "10px", 
    width: "100%", 
    maxWidth: "300px", 
    justifyContent: "center",
    alignItems: "center"
  }}>
  
  {images.map((src, index) => (
    <img
      key={index}
      src={src}
      alt={`Captured ${index}`}
      style={{
        width: "60px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "2px solid #ddd",
      }}
    />
  ))}
  
  {/* Image Capture Button as the Last Grid Element */}
  <label 
    htmlFor="file-upload"
    style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '160px',
      width: "80px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      // animation: "pulse 2s infinite",
    }}
  >
    <input
      id="file-upload"
      type="file"
      accept="image/*"
      capture="camera" // Opens the camera directly
      onChange={handleCapture}
      style={{ display: "none" }}
    />
    {uploadingImage ? (
      <Loader size={25} color="white" className="loader" />
    ) : (
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
      <Progress
        type="circle"
        percent={(images.length / selectedSessionNumberOfPages) * 100}
        strokeColor={{
          "0%": nightModeOn ? "white" : "black", // Start color (green)
          "100%": nightModeOn ? "white" : "black", // End color (blue)
        }}
        showInfo={false}
        strokeWidth={12}
        style={{ width: "80px", height: "80px" }}
      />
      
      {/* Plus Icon Positioned in Center */}
      <Plus 
        size={40} 
        color={nightModeOn ? "white" : "black"}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none", // Ensures clicks go through to Progress
        }}
      />
    </div>
    
    )}
  </label>

</div>

<br/>
<br/>

{/* Merge Images Button */}
{/* {<button 
  onClick={() => {
    if(images.length > 0){
      handleUpload()
    } else {
      alert("Please add at least one page before starting the session.")
    }
  }} 
  style={{
    padding: "10px 15px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "transparent",
    color: 'black',
    cursor: "pointer",
    transition: "background 0.2s",
  }}
>
{ images.length > 0 ?
<> <Sparkles />&nbsp;Start Session </>
  
  : <> Add pages for the session </> } 
</button>} */}

</div>

            }

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
                Summary
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
                Full Text
              </Button>

              
            </div>

            <FontSizeControl fontSize={fontSize} setFontSize={setFontSize} />

            <NightModeButton /> 
             <div>
                {/* Hidden file input */}
                 
                <label
                  style={{
                    height: "45px",
                    width: "45px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  { uploadingImage ? <Loader size={25} color='white' className="loader" /> : 
                  <Popconfirm 
                  title="New Session"
                  icon={<></>}
                  placement="topLeft"

                  onConfirm={() => { logGAEvent('click_scan_more_pages_of_book'); setData(null); setImages([]); }}
                   description={
                    <>
                    Select number of pages
                    <br/>
                    <Slider
                      
                      min={1}
                      max={10}
                      step={1}
                      showInfo={true}
                      value={selectedSessionNumberOfPages}
                      onChange={(value) => setSelectedSessionNumberOfPages(value)}
                      style={{ width: "100%" }}
                      
                    />
                    </>
                   } okText="Start session" cancelText="Cancel">
                  <RefreshCcw size={25} color={nightModeOn ? "white" : "black"} />
                  </Popconfirm>
                  }
                </label>
              </div> 
          </div>
        </div>
      )}

      {/* Modal for cropping */}
      {/* <Modal
        title="Crop and Upload Image"
        style={{ padding: "30px", borderRadius: "20px" }}
        footer={[
          <Button key="back" onClick={() => setShowCropper(false)}>
            Cancel
          </Button>,
          <Button key="submit" style={{backgroundColor: 'black'}} type="primary" onClick={() => { 
            // setShowCropper(false);
            setData([{
              summary: '',
              simpleLang: ''
            }])
            if (!uploadingImage) { handleUpload(); } }}>
            {uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
          </Button>,
        ]}
        open={showCropper}
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
      </Modal> */}
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
