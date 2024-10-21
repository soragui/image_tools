import React, { useState } from 'react';
import { Maximize2, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const ImageResizePage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [resizedImages, setResizedImages] = useState<string[]>([]);
  const [isResizing, setIsResizing] = useState(false);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
    setResizedImages([]);
  };

  const handleResize = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please select at least one image before resizing.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    if (width <= 0 && height <= 0) {
      toast.error('Please enter a valid width or height.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    setIsResizing(true);
    try {
      const resizedUrls = await Promise.all(uploadedImages.map(async (image) => {
        const img = new Image();
        img.src = URL.createObjectURL(image);
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to get canvas context');

        let newWidth = width;
        let newHeight = height;

        if (width > 0 && height > 0) {
          // Both dimensions specified
          newWidth = width;
          newHeight = height;
        } else if (width > 0) {
          // Only width specified, maintain aspect ratio
          newHeight = (img.height / img.width) * width;
        } else if (height > 0) {
          // Only height specified, maintain aspect ratio
          newWidth = (img.width / img.height) * height;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        return canvas.toDataURL(image.type);
      }));

      setResizedImages(resizedUrls);

      toast.success(`${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} resized successfully!`, {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error resizing images:', error);
      toast.error('Error resizing images. Please try again.', {
        position: 'bottom-left',
        duration: 3000,
      });
    } finally {
      setIsResizing(false);
    }
  };

  const handleDownload = (index: number) => {
    const link = document.createElement('a');
    link.href = resizedImages[index];
    link.download = `resized_image_${index + 1}.${uploadedImages[index].name.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Resize Images</h1>
      <ImageUpload onUpload={handleImageUpload} />
      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="number"
            value={width || ''}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            placeholder="Width"
            className="border rounded px-3 py-2 w-24"
          />
          <input
            type="number"
            value={height || ''}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            placeholder="Height"
            className="border rounded px-3 py-2 w-24"
          />
          <motion.button
            onClick={handleResize}
            disabled={isResizing || uploadedImages.length === 0}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${(isResizing || uploadedImages.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="inline-block mr-2" size={20} />
            {isResizing ? 'Resizing...' : 'Resize'}
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
                  {resizedImages[index] && (
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
            <p>Please upload one or more images to start resizing</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageResizePage;