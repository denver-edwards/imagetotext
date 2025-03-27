import { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

const ImageUploadAndCrop = ({ onImageCrop, loading }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCrop = () => {
    if (!completedCrop || !imageRef.current || !imageSrc) {
      return;
    }

    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

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

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        onImageCrop(croppedImageUrl);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label className="mb-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow">
        <span>{imageSrc ? "Upload Different Image" : "Upload Image"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={loading}
        />
      </label>

      {imageSrc && (
        <div className="w-full max-w-2xl">
          <div className="mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              aspect={undefined}
              ruleOfThirds
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <Image
                ref={imageRef}
                src={imageSrc}
                alt="Source"
                width={800}
                height={600}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </ReactCrop>
          </div>
          <button
            onClick={handleCrop}
            disabled={!completedCrop || loading}
            className={`py-2 px-6 rounded-lg shadow ${
              !completedCrop || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {loading ? "Processing..." : "Extract Text"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadAndCrop;
