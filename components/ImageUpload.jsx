import { useState } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.match(/image\/(bmp|jpg|jpeg|png|pbm|webp)/)) {
      setError("Unsupported image format");
      return;
    }

    setError("");

    let imageData;

    // Check if FileReader is available (browser environment)
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();

      reader.onload = (event) => {
        imageData = event.target.result;
        setSelectedImage(imageData);
        onImageUpload(imageData);
      };

      reader.onerror = (error) => {
        setError("Error reading file");
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-96 flex flex-col justify-center items-center">
      <input
        type="file"
        accept="image/bmp, image/jpeg, image/png, image/webp"
        onChange={handleImageChange}
      />
      {error && <p className="text-red-500">{error}</p>}
      {selectedImage && (
        <img
          src={
            typeof selectedImage === "string"
              ? selectedImage
              : URL.createObjectURL(new Blob([selectedImage]))
          }
          alt="Uploaded"
          className="mt-4 h-full"
        />
      )}
    </div>
  );
};

export default ImageUpload;
