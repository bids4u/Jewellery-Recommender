import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploader({ onImagesChange }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;

      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        if (onImagesChange) onImagesChange(updated);
        return updated;
      });

      setIsDragging(false);
    },
    [onImagesChange]
  );

  const removeFile = (target) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.file.name !== target.file.name);
      if (onImagesChange) onImagesChange(updated);
      return updated;
    });
    URL.revokeObjectURL(target.preview);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 10,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`relative border border-gray-300/70 rounded-xl p-6 text-center transition cursor-pointer overflow-hidden
        ${isDragging ? "bg-gray-100 border-gray-400" : "bg-white hover:bg-gray-50"}
      `}
    >
      <input {...getInputProps()} />

      {/* Elegant silver overlay when dragging */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100/70 flex flex-col justify-center items-center rounded-xl z-10 border border-gray-400"
          >
            <UploadCloud className="w-12 h-12 text-gray-600 animate-bounce" />
            <p className="mt-2 font-medium text-gray-700 text-lg">
              Drop your images here
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default State */}
      <div className="relative z-0">
        <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium tracking-wide">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-gray-400 italic">
          Up to 10 images allowed (JPG / PNG)
        </p>
      </div>

      {/* Image Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-6">
          {files.map((f) => (
            <motion.div
              key={f.file.name}
              whileHover={{ scale: 1.03 }}
              className="relative group"
            >
              <img
                src={f.preview}
                alt={f.file.name}
                onLoad={() => URL.revokeObjectURL(f.preview)}
                className="rounded-lg object-cover h-24 w-full shadow-sm border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f);
                }}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
