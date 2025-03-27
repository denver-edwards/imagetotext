import { useState, useEffect } from "react";
import Head from "next/head";
import ImageUploadAndCrop from "@/components/ImageUploadAndCrop";
import Modal from "@/components/Modal";

export default function Home() {
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [tesseract, setTesseract] = useState(null);

  // Load Tesseract.js from CDN
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => {
      setTesseract(window.Tesseract);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageCrop = async (croppedImageUrl) => {
    if (!tesseract) {
      setError("OCR engine is still loading. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const worker = await tesseract.createWorker({
        workerPath:
          "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js",
        langPath: "https://cdn.jsdelivr.net/npm/tesseract.js-data@4",
        corePath:
          "https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js",
      });

      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const {
        data: { text },
      } = await worker.recognize(croppedImageUrl);
      setOcrText(text);
      setModalOpen(true);
    } catch (err) {
      console.error("OCR Error:", err);
      setError(
        err.message || "Failed to extract text. Please try a clearer image."
      );
    } finally {
      setLoading(false);
      URL.revokeObjectURL(croppedImageUrl);
    }
  };

  return (
    <>
      <Head>
        <title>Image to Text OCR</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 pb-20 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Image to Text OCR
        </h1>
        <p className="mb-8 text-gray-600 text-center max-w-md">
          Upload an image, crop the area with text, and extract the text using
          OCR
        </p>

        {!tesseract ? (
          <div className="mt-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading OCR engine...</p>
          </div>
        ) : (
          <>
            <ImageUploadAndCrop
              onImageCrop={handleImageCrop}
              loading={loading}
            />

            {loading && (
              <div className="mt-6 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
                <p>Processing image...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="mt-4 p-6 border border-gray-300 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Extracted Text:</h2>
            {ocrText ? (
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {ocrText}
              </pre>
            ) : (
              <p className="text-gray-500">No text was extracted</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(ocrText)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2"
              >
                Copy Text
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
