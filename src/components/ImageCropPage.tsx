import React, { useState, useCallback } from 'react';
import { Crop, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedImage(files[0]);
      setCroppedImageUrl(null);
    }
  }, []);

  const handleCrop = useCallback(async () => {
    if (!uploadedImage || !completedCrop) {
      toast.error('Please select an image and define a crop area.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    setIsCropping(true);
    try {
      const image = new Image();
      image.src = URL.createObjectURL(uploadedImage);
      await new Promise((resolve) => { image.onload = resolve; });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

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

      const croppedImageDataUrl = canvas.toDataURL(uploadedImage.type);
      setCroppedImageUrl(croppedImageDataUrl);

      toast.success('Image cropped successfully!', {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image. Please try again.', {
        position: 'bottom-left',
        duration: 3000,
      });
    } finally {
      setIsCropping(false);
    }
  }, [uploadedImage, completedCrop]);

  const handleDownload = useCallback(() => {
    if (croppedImageUrl) {
      const link = document.createElement('a');
      link.href = croppedImageUrl;
      link.download = `cropped_${uploadedImage?.name || 'image'}.${uploadedImage?.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [croppedImageUrl, uploadedImage]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Crop Image</h1>
      <ImageUpload onUpload={handleImageUpload} />
      <AnimatePresence>
        {uploadedImage ? (
          <motion.div
            key="image-crop"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img src={URL.createObjectURL(uploadedImage)} alt="Upload" />
            </ReactCrop>
            <div className="flex space-x-4">
              <motion.button
                onClick={handleCrop}
                disabled={isCropping}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${isCropping ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crop className="inline-block mr-2" size={20} />
                {isCropping ? 'Cropping...' : 'Crop Image'}
              </motion.button>
              {croppedImageUrl && (
                <motion.button
                  onClick={handleDownload}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="inline-block mr-2" size={20} />
                  Download Cropped Image
                </motion.button>
              )}
            </div>
            {croppedImageUrl && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Cropped Image Preview</h2>
                <img src={croppedImageUrl} alt="Cropped" className="max-w-full h-auto" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="no-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 py-8"
          >
            <AlertCircle className="mx-auto mb-2" size={48} />
            <p className="text-xl mb-2">No image selected</p>
            <p>Please upload an image to start cropping</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageCropPage;