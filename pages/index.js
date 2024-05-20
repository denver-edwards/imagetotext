import { useState } from "react";
import ImageUploadAndCrop from "../components/ImageUploadAndCrop";
import { createWorker } from "tesseract.js";

const Home = () => {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageCrop = async (croppedImage) => {
    setLoading(true);
    // const worker = createWorker({
    //   logger: (m) => console.log(m), // Add logger here if needed
    // });
    // await worker.load(); // Correct usage
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');

    const worker = await createWorker("eng");

    const {
      data: { text },
    } = await worker.recognize(croppedImage);
    setOcrText(text);
    await worker.terminate();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Image to Text OCR</h1>
      <ImageUploadAndCrop onImageCrop={handleImageCrop} />
      {loading && <p>Loading...</p>}
      {ocrText && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-semibold mb-2">Extracted Text:</h2>
          <pre className="whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
