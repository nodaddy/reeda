// WIP, this is an effort to make a common crop modal for image uploads, incomplete

import { Modal } from "antd"

export const CropModal = ({uploadingImage, showCropper, handleUpload, setShowCropper, setCroppedAreaPixels}) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
  
    const [uploadingImage, setUploadingImage] = useState(false);
  
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    return <Modal
    title="Crop Image"
    style={{ padding: "30px", borderRadius: "20px" }}
    okText={uploadingImage ? <Loader size={10} className="loader" /> : "Upload"}
    open={showCropper}
    onOk={() => { if(!uploadingImage) {handleUpload()}}}
    onCancel={() => setShowCropper(false)}
    onClose={() => setShowCropper(false)}
  >
    <div>
      <div> 
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          aspect={scanPageRatio}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        /> 
      </div>
    </div>
  </Modal>
}