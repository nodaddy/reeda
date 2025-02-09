import { useRef } from "react";
import { Button } from "antd";
import { Camera } from "lucide-react";

const CameraUpload = ({ handleImage }) => {
  const fileInputRef = useRef(null);

  const openCamera = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Button icon={<Camera />} onClick={openCamera}>
        Take a Photo
      </Button>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Opens back camera directly
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={(e) => {
            handleImage(e.target.files[0]);
        }}
      />
    </div>
  );
};

export default CameraUpload;
