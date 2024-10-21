import React, { useState, useEffect } from 'react';
import { Repeat, Download, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ImageProcessingProps {
  images: File[];
}

const ImageProcessing: React.FC<ImageProcessingProps> = ({ images }) => {
  const [format, setFormat] = useState('jpeg');
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const supportedFormats = ['jpeg', 'png', 'webp', 'bmp'];

  useEffect(() => {
    setConvertedImages([]);
  }, [images]);

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image before converting.', {
        position: 'bottom-left',
        duration: 3000,
        icon: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    setIsConverting(true);
    try {
      const convertedUrls = await Promise.all(images.map(async (image) => {
        const imageBitmap = await createImageBitmap(image);
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to get canvas context');

        ctx.drawImage(imageBitmap, 0, 0);
        
        return canvas.toDataURL(`image/${format}`);
      }));

      setConvertedImages(convertedUrls);

      // Show success toast
      toast.success(`${images.length} image${images.length > 1 ? 's' : ''} converted successfully!`, {
        position: 'bottom-left',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error converting images:', error);
      toast.error('Error converting images. Please try again.', {
        position: 'bottom-left',
        duration: 3000,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (index: number) => {
    const link = document.createElement('a');
    link.href = convertedImages[index];
    link.download = `converted_image_${index + 1}.${format === 'jpeg' ? 'jpg' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    convertedImages.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_image_${index + 1}.${format === 'jpeg' ? 'jpg' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">Convert Format</h2>
        <div className="flex space-x-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {supportedFormats.map(fmt => (
              <option key={fmt} value={fmt}>
                {fmt.toUpperCase()}
              </option>
            ))}
          </select>
          <motion.button
            onClick={handleConvert}
            disabled={isConverting || images.length === 0}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${(isConverting || images.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Repeat className="inline-block mr-2" size={20} />
            {isConverting ? 'Converting...' : 'Convert'}
          </motion.button>
          {convertedImages.length > 0 && (
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
        {images.length > 0 ? (
          <motion.div
            key="image-list"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Selected Images</h2>
            <ul className="space-y-2">
              {images.map((image, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{image.name}</span>
                  {convertedImages[index] && (
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
            <p>Please upload one or more images to start processing</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageProcessing;