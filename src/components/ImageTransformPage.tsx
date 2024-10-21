import React, { useState } from 'react';
import { Maximize2, RotateCw, Download, AlertCircle, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const ImageTransformPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [percentage, setPercentage] = useState<number>(100);
  const [angle, setAngle] = useState<number>(0);
  const [transformedImages, setTransformedImages] = useState<string[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages(files);
    setTransformedImages([]);
  };

  const handleTransform = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please select at least one image before transforming.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    if (percentage <= 0 && angle === 0) {
      toast.error('Please enter a valid percentage or rotation angle.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    setIsTransforming(true);
    try {
      const transformedUrls = await Promise.all(uploadedImages.map(async (image) => {
        const img = new Image();
        img.src = URL.createObjectURL(image);
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to get canvas context');

        const newWidth = img.width * (percentage / 100);
        const newHeight = img.height * (percentage / 100);

        const radians = (angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        
        canvas.width = newWidth * cos + newHeight * sin;
        canvas.height = newWidth * sin + newHeight * cos;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
        
        return canvas.toDataURL(image.type);
      }));

      setTransformedImages(transformedUrls);

      toast.success(`${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} transformed successfully!`, {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error transforming images:', error);
      toast.error('Error transforming images. Please try again.', {
        position: 'bottom-left',
        duration: 3000,
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleDownload = (index: number) => {
    const link = document.createElement('a');
    link.href = transformedImages[index];
    link.download = `transformed_image_${index + 1}.${uploadedImages[index].name.split('.').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    transformedImages.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `transformed_image_${index + 1}.${uploadedImages[index].name.split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    toast.success('All transformed images downloaded!', {
      position: 'bottom-left',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Transform Images</h1>
      <ImageUpload onUpload={handleImageUpload} />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Math.max(1, Math.min(200, parseInt(e.target.value) || 100)))}
              placeholder="Percentage"
              className="border rounded-l px-3 py-2 w-24"
            />
            <span className="bg-gray-100 border border-l-0 rounded-r px-3 py-2">
              <Percent size={20} />
            </span>
          </div>
          <input
            type="number"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value) || 0)}
            placeholder="Rotation Angle"
            className="border rounded px-3 py-2 w-32"
          />
          <motion.button
            onClick={handleTransform}
            disabled={isTransforming || uploadedImages.length === 0}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${(isTransforming || uploadedImages.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="inline-block mr-2" size={20} />
            {isTransforming ? 'Transforming...' : 'Transform'}
          </motion.button>
          {transformedImages.length > 0 && (
            <motion.button
              onClick={handleDownloadAll}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="inline-block mr-2" size={20} />
              Download All
            </motion.button>
          )}
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
            <h2 className="text-xl font-semibold mb-2">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="border rounded p-4">
                  <p className="mb-2 font-semibold">{image.name}</p>
                  {transformedImages[index] ? (
                    <div>
                      <img src={transformedImages[index]} alt={`Transformed ${image.name}`} className="w-full h-auto mb-2" />
                      <button
                        onClick={() => handleDownload(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                      >
                        <Download size={20} className="inline-block mr-2" />
                        Download
                      </button>
                    </div>
                  ) : (
                    <img src={URL.createObjectURL(image)} alt={image.name} className="w-full h-auto" />
                  )}
                </div>
              ))}
            </div>
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
            <p>Please upload one or more images to start transforming</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageTransformPage;