// src/components/ImageDropzone.jsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

export default function ImageDropzone({ onFiles }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 10,
  });

  return (
    <div
      {...getRootProps()}
      className={`border border-gray-300 rounded-xl p-6 text-center cursor-pointer ${isDragActive ? "bg-gray-50" : "bg-white"}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
      <div className="text-sm text-gray-700">Drag & drop or click to attach images</div>
      <div className="text-xs text-gray-400 mt-1">Up to 10 images (jpg, png, webp)</div>
    </div>
  );
}
