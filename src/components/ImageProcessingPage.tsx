import React from 'react';
import ImageUpload from './ImageUpload';
import ImageProcessing from './ImageProcessing';

const ImageProcessingPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = React.useState<File[]>([]);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Process Images</h1>
      <ImageUpload onUpload={handleImageUpload} />
      <ImageProcessing images={uploadedImages} />
    </div>
  );
};

export default ImageProcessingPage;