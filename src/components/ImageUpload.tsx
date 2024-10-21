import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className="flex justify-center">
      <motion.div
        {...getRootProps()}
        className={`w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isDragActive ? { borderColor: '#3B82F6' } : { borderColor: '#D1D5DB' }}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Upload className="mx-auto mb-4" size={48} />
          {isDragActive ? (
            <p className="text-lg">Drop the images here ...</p>
          ) : (
            <p className="text-lg">Drag 'n' drop images here, or click to select files</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageUpload;