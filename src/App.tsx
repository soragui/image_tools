import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ImageProcessingPage from './components/ImageProcessingPage';
import ImageTransformPage from './components/ImageTransformPage';
import ImageCropPage from './components/ImageCropPage';
import SEO from './components/SEO';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const getSEOData = () => {
    const baseUrl = 'https://your-domain.com'; // Replace with your actual domain
    switch (currentPage) {
      case 'home':
        return {
          title: 'Image Tools - Your All-in-One Image Processing Solution',
          description: 'Transform, convert, and optimize your images with our powerful and easy-to-use online tools.',
          keywords: 'image processing, image conversion, image transformation, online image tools',
          canonicalUrl: `${baseUrl}/`
        };
      case 'process':
        return {
          title: 'Convert Images - Image Tools',
          description: 'Convert your images to various formats including JPEG, PNG, and WebP with our fast and efficient online converter.',
          keywords: 'image conversion, format change, JPEG, PNG, WebP, online converter',
          canonicalUrl: `${baseUrl}/process`
        };
      case 'transform':
        return {
          title: 'Transform Images - Image Tools',
          description: 'Resize, rotate, and transform your images online with our user-friendly image transformation tools.',
          keywords: 'image resize, image rotation, image transformation, online image editor',
          canonicalUrl: `${baseUrl}/transform`
        };
      case 'crop':
        return {
          title: 'Crop Images - Image Tools',
          description: 'Easily crop your images online with our intuitive image cropping tool.',
          keywords: 'image crop, image editing, online cropping tool',
          canonicalUrl: `${baseUrl}/crop`
        };
      default:
        return {
          title: 'Image Tools',
          description: 'Online image processing and transformation tools',
          keywords: 'image tools, image processing, image transformation',
          canonicalUrl: baseUrl
        };
    }
  };

  const seoData = getSEOData();

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-100">
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          canonicalUrl={seoData.canonicalUrl}
        />
        <Header setCurrentPage={setCurrentPage} />
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white shadow-md rounded-lg overflow-hidden p-6"
            >
              {currentPage === 'home' && <LandingPage setCurrentPage={setCurrentPage} />}
              {currentPage === 'process' && <ImageProcessingPage />}
              {currentPage === 'transform' && <ImageTransformPage />}
              {currentPage === 'crop' && <ImageCropPage />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Toaster position="bottom-left" />
      </div>
    </HelmetProvider>
  );
}

export default App;