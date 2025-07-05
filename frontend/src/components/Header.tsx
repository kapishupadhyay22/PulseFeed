import React from 'react';
import { Camera, Heart, Home, Search, User } from 'lucide-react';

interface HeaderProps {
  onCreatePost: () => void;
  onNavigate: (page: 'home' | 'profile') => void;
  currentPage: 'home' | 'profile';
}

export const Header: React.FC<HeaderProps> = ({ onCreatePost, onNavigate, currentPage }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PulseFeed
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`h-6 w-6 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="h-6 w-6" />
            </button>
            <Search className="h-6 w-6 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-200 transform hover:scale-110" />
            <button
              onClick={onCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <Camera className="h-5 w-5" />
            </button>
            <Heart className="h-6 w-6 text-gray-700 hover:text-blue-600 cursor-pointer transition-all duration-200 transform hover:scale-110" />
            <button
              onClick={() => onNavigate('profile')}
              className={`h-6 w-6 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                currentPage === 'profile' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};