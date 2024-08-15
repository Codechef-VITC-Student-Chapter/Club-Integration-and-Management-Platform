import React from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white">
      <div className="flex items-center justify-center space-x-2 mb-8">
        <div
          className="w-8 h-8 bg-white rounded-full custom-bounce"
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className="w-8 h-8 bg-white rounded-full custom-bounce"
          style={{ animationDelay: '200ms' }}
        ></div>
        <div
          className="w-8 h-8 bg-white rounded-full custom-bounce"
          style={{ animationDelay: '400ms' }}
        ></div>
      </div>
      <h1 className="text-3xl font-bold tracking-widest">Loading</h1>
    </div>
  );
}

export default LoadingScreen;
