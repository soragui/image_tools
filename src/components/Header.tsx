import React, { useState } from 'react';
import { Image, Menu, X } from 'lucide-react';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
          <Image className="mr-2" size={24} />
          <h1 className="text-2xl font-bold">Image Tools</h1>
        </div>
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li><a href="#" onClick={() => handleNavClick('home')} className="hover:text-blue-200">Home</a></li>
            <li><a href="#" onClick={() => handleNavClick('process')} className="hover:text-blue-200">Convert</a></li>
            <li><a href="#" onClick={() => handleNavClick('transform')} className="hover:text-blue-200">Transform</a></li>
            <li><a href="#" onClick={() => handleNavClick('crop')} className="hover:text-blue-200">Crop</a></li>
          </ul>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <ul className="space-y-2">
            <li><a href="#" onClick={() => handleNavClick('home')} className="block hover:text-blue-200">Home</a></li>
            <li><a href="#" onClick={() => handleNavClick('process')} className="block hover:text-blue-200">Convert</a></li>
            <li><a href="#" onClick={() => handleNavClick('transform')} className="block hover:text-blue-200">Transform</a></li>
            <li><a href="#" onClick={() => handleNavClick('crop')} className="block hover:text-blue-200">Crop</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;