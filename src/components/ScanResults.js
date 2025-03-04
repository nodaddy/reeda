"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Button,
  Tooltip,
  Modal,
  Popconfirm,
  Progress,
  Input,
  Slider,
  Checkbox,
  Tag,
  Popover,
  FloatButton,
} from "antd";
import OriginalTextWithTooltips, {
  FontSizeControl,
} from "./TextWithIntegratedDictionary";
import {
  Camera,
  Delete,
  Dot,
  Hourglass,
  Info,
  LetterText,
  Loader,
  Minus,
  Moon,
  PackagePlus,
  Plane,
  Plus,
  PlusCircle,
  PlusIcon,
  PlusSquare,
  Pointer,
  RefreshCcw,
  Rocket,
  Settings,
  Sparkles,
  WholeWord,
} from "lucide-react";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import {
  createScan,
  getLatestScanByBookTitleAndUserId,
} from "@/firebase/services/scanService";
import {
  getBookByTitleAndUserId,
  updateBookByUserIdAndTitle,
} from "@/firebase/services/bookService";
import {
  addCoinsPerScan,
  scanPageRatio,
  scanPageRation,
  streakMaintenanceIntervalInSeconds,
  freeAIscans,
} from "@/configs/variables";
import {
  getPageSummaryFromImage,
  getPageSummaryFromImageStream,
  getSimplifiedLanguage,
  getSimplifiedLanguageStream,
} from "@/openAI";
import TextWithIntegratedDictionary from "./TextWithIntegratedDictionary";
import { useAppContext } from "@/context/AppContext";
import NightModeButton from "./NightModeButton";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { toBlob } from "./imageUpload";
import { priColor, priTextColor, secColor } from "@/configs/cssValues";
import { uploadImages } from "@/assets";
import NextImage from "next/image";
import StackedImages from "./StackedImages";
import { storage } from "@/app/utility";
import PremiumSlideIn from "./PremiumSlideIn";

const backgroundColor = "#F0F0F8";
const accentColor = "#4A4AFF";
const textColor = "#333344";
const shadowColor = "rgba(0, 0, 28, 0.08)";

export default function ScanResults({ setBook, scans, setDataOut }) {
  // console.log(scans);
  const bookTitle = scans?.bookTitle;
  const [activeView, setActiveView] = useState("summary");
  const [data, setData] = useState(null);

  const [fontSize, setFontSize] = useState(15); // Default font size

  // States for cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    nightModeOn,
    summaryOrFullText,
    setSummaryOrFullText,
    selectedSessionNumberOfPages,
    setSelectedSessionNumberOfPages,
    setShowingSummaryOrFullText,
    profile,
    isPremium,
    setSlideIn,
    setSlideInContent,
  } = useAppContext();

  const [images, setImages] = useState([]);

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
    const file = files[0]; // Assuming single file upload
    const reader = new FileReader();

    reader.onload = () => {
      // setImageSrc(reader.result);
      setData([
        {
          summary: "",
          simpleLang: "",
        },
      ]);
      handleUpload(reader.result);
      // setShowCropper(true);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (images.length == selectedSessionNumberOfPages) {
      setTimeout(() => {
        handleUpload();
      }, 200);
    }
  }, [images]);

  const handleUpload = async () => {
    setUploadingImage(true);

    // Check if user has reached free scan limit
    const userId = JSON.parse(storage.getItem("user"))?.email;

    // Get current number of AI scans used
    const numberOfAIScansUsed = profile?.numberOfAIScansUsed || 0;

    // Check if user has reached free scan limit and is not premium
    if (numberOfAIScansUsed >= freeAIscans && !isPremium) {
      setUploadingImage(false);
      // Show premium slide-in instead of redirecting
      setSlideInContent(<PremiumSlideIn />);
      setSlideIn(true);
      return;
    }

    for (const image of images) {
      const croppedFile = await getBlob(image);

      if (!croppedFile) {
        console.error("Failed to create blob for image:", image);
        continue; // Skip this iteration if blob creation fails
      }

      // Update user's profile to increment the number of AI scans used
      if (userId) {
        try {
          // Get current profile data
          const updatedData = {
            numberOfAIScansUsed: (profile?.numberOfAIScansUsed || 0) + 1,
          };

          // Update profile with incremented scan count
          await updateProfile(userId, updatedData);
        } catch (error) {
          console.error("Error updating profile with scan count:", error);
        }
      }

      if (summaryOrFullText == "summary") {
        await getPageSummaryFromImageStream(croppedFile, 5, (chunk) => {
          setUploadingImage(false);
          setDataOut({ ...scans, summary: "" });
          setShowingSummaryOrFullText("summary");
          setData((prev) =>
            prev
              ? [{ ...prev[0], summary: prev[0].summary + chunk }]
              : [{ summary: chunk, simpleLang: "" }]
          );
        });
      } else if (summaryOrFullText == "fulltext") {
        await getSimplifiedLanguageStream(croppedFile, (chunk) => {
          setDataOut({ ...scans, simpleLang: "" });

          setUploadingImage(false);
          setShowingSummaryOrFullText("fulltext");
          setData((prev) =>
            prev
              ? [{ ...prev[0], simpleLang: prev[0].simpleLang + chunk }]
              : [{ simpleLang: chunk, summary: "" }]
          );
        });
      }
    }
    setImages([]);
  };

  return (
    <>
      {true && (
        <div
          style={{
            padding: "0px 11px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "scroll",
            width: "95%",
            margin: "auto",
            marginTop: "17px",
            borderTop: "0px",
            borderRadius: "10px",
            // border: '1px solid silver',
            backgroundColor: nightModeOn ? "black" : "white",
            height: "calc(100vh - 249px)", // This can be used if you want to explicitly set height too
            // padding: "25px",
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // maxHeight: 'calc(100vh - 270px)',
            // overflow: 'scroll',
          }}
        >
          {data && (
            <div
              style={{
                maxWidth: "800px",
                padding: "5px 0px",
                transition: "all 0.5s ease-in-out",
                overflowY: "auto",
              }}
            >
              {data[0].summary != "" ? (
                <TextWithIntegratedDictionary
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  text={data[0].summary}
                />
              ) : (
                <TextWithIntegratedDictionary
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  text={data[0].simpleLang}
                />
              )}
            </div>
          )}

          {!data && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
                padding: "10px",
              }}
            >
              {/* Grid Layout for Images + Capture Button */}
              {images.length > 0 && (
                <>
                  <br />
                  <br />
                  <br />
                  <StackedImages images={images} loading={uploadingImage} />
                </>
              )}

              {/* {
    images.length == 0 && (
      <div align="center" style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px'
      }}> 
        <NextImage src={uploadImages}
        style={{width: '50%', height: 'auto'}}
        />
      </div>
    )
  } */}

              <br />
              <br />
              {images.length == 0 && (
                <div
                  style={{
                    margin: "auto",
                    padding: "10px 30px 20px",
                    backgroundColor: backgroundColor,
                    borderRadius: "16px",
                    boxShadow: `0px 12px 24px ${shadowColor}`,
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(74, 74, 255, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "25px",
                    }}
                  >
                    {/* <Settings size={18} color={accentColor} style={{ marginRight: '12px' }} /> */}
                  </div>

                  <div
                    style={
                      {
                        // borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                      }
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          color: textColor,
                          marginRight: "15px",
                        }}
                      >
                        No. of Pages:
                      </span>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            setSelectedSessionNumberOfPages(
                              Math.max(0, selectedSessionNumberOfPages - 1)
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "rgba(74, 74, 255, 0.1)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(74, 74, 255, 0.15)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(74, 74, 255, 0.1)")
                          }
                        >
                          <Minus size={14} color={accentColor} />
                        </button>

                        <span
                          style={{
                            margin: "0 10px",
                            fontSize: "16px",
                            fontWeight: "500",
                            color: textColor,
                            minWidth: "15px",
                            textAlign: "center",
                          }}
                        >
                          {selectedSessionNumberOfPages}
                        </span>

                        <button
                          onClick={() =>
                            setSelectedSessionNumberOfPages(
                              Math.min(10, selectedSessionNumberOfPages + 1)
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "rgba(74, 74, 255, 0.1)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(74, 74, 255, 0.15)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(74, 74, 255, 0.1)")
                          }
                        >
                          <Plus size={14} color={accentColor} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "23px" }}>
                    {/* <span style={{
          display: 'block',
          fontSize: '15px',
          fontWeight: '500',
          color: textColor,
          marginBottom: '12px'
        }}>Result Format</span> */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "11px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "20px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border:
                              summaryOrFullText === "summary"
                                ? `2px solid ${accentColor}`
                                : "2px solid rgba(0, 0, 0, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                            transition: "all 0.2s ease",
                            backgroundColor:
                              summaryOrFullText === "summary"
                                ? "rgba(74, 74, 255, 0.1)"
                                : "transparent",
                          }}
                        >
                          {summaryOrFullText === "summary" && (
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                              }}
                            ></div>
                          )}
                        </div>
                        <input
                          type="radio"
                          value="summary"
                          checked={summaryOrFullText === "summary"}
                          onChange={(e) => setSummaryOrFullText(e.target.value)}
                          style={{ display: "none" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: textColor,
                            fontWeight:
                              summaryOrFullText === "summary" ? "500" : "400",
                          }}
                        >
                          Summary
                        </span>
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border:
                              summaryOrFullText === "fulltext"
                                ? `2px solid ${accentColor}`
                                : "2px solid rgba(0, 0, 0, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                            transition: "all 0.2s ease",
                            backgroundColor:
                              summaryOrFullText === "fulltext"
                                ? "rgba(74, 74, 255, 0.1)"
                                : "transparent",
                          }}
                        >
                          {summaryOrFullText === "fulltext" && (
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                              }}
                            ></div>
                          )}
                        </div>
                        <input
                          type="radio"
                          value="fulltext"
                          checked={summaryOrFullText === "fulltext"}
                          onChange={(e) => setSummaryOrFullText(e.target.value)}
                          style={{ display: "none" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: textColor,
                            fontWeight:
                              summaryOrFullText === "fulltext" ? "500" : "400",
                          }}
                        >
                          Full Text
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <br />
              <label
                htmlFor="file-upload"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: "100px",
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
                  <div
                    id="progress-upload"
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    {/* Plus Icon Positioned in Center */}

                    <Progress
                      type="circle"
                      percent={
                        (images.length / selectedSessionNumberOfPages) * 100
                      }
                      strokeColor={{
                        "0%": nightModeOn ? "white" : "black", // Start color (green)
                        "100%": nightModeOn ? "white" : "black", // End color (blue)
                      }}
                      showInfo={false}
                      strokeWidth={12}
                      style={{ width: "80px", height: "80px" }}
                    />
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
          )}

          <div
            style={{
              display: data ? "flex" : "none",
              marginBottom: "20px",
              alignItems: "center",
              justifyContent: "space-around",
              position: "absolute",
              width: "94%",
              bottom: "15px",
              padding: "0px 0px",
            }}
          >
            {/* <div>
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

              
            </div> */}

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
                {uploadingImage ? (
                  <Loader size={25} color="white" className="loader" />
                ) : (
                  <Popconfirm
                    title="Start a new session?"
                    icon={<></>}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                      setShowingSummaryOrFullText(null);
                      setData(null);
                      setImages([]);
                      logGAEvent("click_scan_more_pages_of_book");
                    }}
                    placement="topLeft"
                  >
                    <Button
                      style={{
                        backgroundColor: !nightModeOn ? "black" : "white",
                        color: !nightModeOn ? "white" : "black",
                      }}
                      size={25}
                      color={nightModeOn ? "white" : "black"}
                    >
                      New Session
                    </Button>
                  </Popconfirm>
                )}
              </label>
            </div>

            <Popover
              content={
                <div style={{ padding: "30px", backgroundColor: "aliceblue" }}>
                  - Tap on any word to see the meaning (On-page dictionary)
                  <br />
                  - Change the font size by usnig the &nbsp; <LetterText />
                  &nbsp; button
                  <br />
                  - Toggle night mode by using the&nbsp; <Moon />
                  &nbsp; button
                </div>
              }
            >
              <Info color={priColor} />
            </Popover>
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
            <Loading />
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
      paddingTop: "10px",
      paddingLeft: "24px",
      fontSize: "16px",
      maxWidth: "90vw",
      whiteSpace: "pre-wrap",
    }}
  >
    {text}
  </div>
);
