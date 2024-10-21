import React, { useState } from 'react';
import { RotateCw, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const ImageRotatePage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [angle, setAngle] = useState<number>(90);
  const [rotatedImages, setRotatedImages] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
    setRotatedImages([]);
  };

  const handleRotate = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please select at least one image before rotating.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    setIsRotating(true);
    try {
      const rotatedUrls = await Promise.all(uploadedImages.map(async (image) => {
        const img = new Image();
        img.src = URL.createObjectURL(image);
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to get canvas context');

        const radians = (angle * Math.PI) / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);

        if (angle % 180 === 0) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = img.height;
          canvas.height = img.width;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        return canvas.toDataURL(image.type);
      }));

      setRotatedImages(rotatedUrls);

      toast.success(`${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} rotated successfully!`, {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error rotating images:', error);
      toast.error('Error rotating images. Please try again.', {
        position: 'bottom-left',
        duration: 3000,
      });
    } finally {
      setIsRotating(false);
    }
  };

  const handleDownload = (index: number) => {
    const link = document.createElement('a');
    link.href = rotatedImages[index];
    link.download = `rotated_image_${index + 1}.${uploadedImages[index].name.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Rotate Images</h1>
      <ImageUpload onUpload={handleImageUpload} />
      <div className="space-y-4">
        <div className="flex space-x-4">
          <select
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
          <motion.button
            onClick={handleRotate}
            disabled={isRotating || uploadedImages.length === 0}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${(isRotating || uploadedImages.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCw className="inline-block mr-2" size={20} />
            {isRotating ? 'Rotating...' : 'Rotate'}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {uploadedImages.length > 0 ? (
          <motion.div
            key="image-list"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Selected Images</h2>
            <ul className="space-y-2">
              {uploadedImages.map((image, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{image.name}</span>
                  {rotatedImages[index] && (
                    <button
                      onClick={() => handleDownload(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Download size={20} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
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
            <p className="text-xl mb-2">No images selected</p>
            <p>Please upload one or more images to start rotating</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageRotatePage;