import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

const ImageUploadAndCrop = ({ onImageCrop }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: null });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCrop = () => {
    if (!completedCrop || !imageRef.current) {
      return;
    }

    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      const croppedImageUrl = URL.createObjectURL(blob);
      onImageCrop(croppedImageUrl);
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {imageSrc && (
        <div className="px-10 max-w-screen-md">
          <ReactCrop
            src={imageSrc}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={handleCropComplete}
          >
            <Image src={imageSrc} alt="Source" width={700} height={700} />
          </ReactCrop>
        </div>
      )}
      {imageSrc && (
        <button
          onClick={handleCrop}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Process
        </button>
      )}
    </div>
  );
};

export default ImageUploadAndCrop;
