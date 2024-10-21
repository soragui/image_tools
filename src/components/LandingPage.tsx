import React from 'react';
import { Image, Zap, Lock, Users, Repeat, Maximize2, RotateCw, Crop } from 'lucide-react';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Image Tools</h1>
        <p className="text-xl text-gray-600 mb-8">Your all-in-one solution for image processing and transformation</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentPage('process')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <Repeat className="mr-2" size={24} />
            Convert Images
          </button>
          <button
            onClick={() => setCurrentPage('transform')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Maximize2 className="mr-2" size={24} />
            Transform Images
          </button>
          <button
            onClick={() => setCurrentPage('crop')}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-300 flex items-center"
          >
            <Crop className="mr-2" size={24} />
            Crop Images
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Image size={40} />}
          title="Image Conversion"
          description="Convert images to various formats including JPEG, PNG, WebP, and more with just a few clicks."
        />
        <FeatureCard
          icon={<Maximize2 size={40} />}
          title="Resize & Rotate"
          description="Easily resize your images by percentage and rotate them to any angle you need."
        />
        <FeatureCard
          icon={<Crop size={40} />}
          title="Image Cropping"
          description="Crop your images with precision using our intuitive cropping tool."
        />
        <FeatureCard
          icon={<Zap size={40} />}
          title="Batch Processing"
          description="Save time by processing multiple images at once with our powerful batch tools."
        />
      </section>

      <section className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <Step number={1} title="Upload">
            Upload your image(s) using our simple drag-and-drop interface.
          </Step>
          <Step number={2} title="Choose Tool">
            Select the desired tool: Convert, Transform, or Crop.
          </Step>
          <Step number={3} title="Process">
            Adjust settings and apply changes to your images.
          </Step>
          <Step number={4} title="Download">
            Download your processed images instantly or in batch!
          </Step>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-8">Why Choose Image Tools?</h2>
        <div className="flex flex-wrap justify-center gap-12">
          <Stat icon={<Users size={32} />} value="10,000+" label="Happy Users" />
          <Stat icon={<Zap size={32} />} value="Lightning" label="Fast Processing" />
          <Stat icon={<Lock size={32} />} value="100%" label="Secure & Private" />
          <Stat icon={<RotateCw size={32} />} value="24/7" label="Available" />
        </div>
      </section>

      <section className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to transform your images?</h2>
        <p className="text-xl text-gray-600 mb-6">Start using our powerful tools today - no sign-up required!</p>
        <button
          onClick={() => setCurrentPage('process')}
          className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-semibold"
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      <div className="text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => {
  return (
    <div className="text-center">
      <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => {
  return (
    <div className="text-center">
      <div className="text-blue-500 mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default LandingPage;