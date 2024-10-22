import React from 'react';

function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! This page does not exist... yet
        </h1>
        <p className="text-2xl text-gray-600 mb-2">😔</p>
        <p className="text-lg text-gray-500">
          We’re working on it. Check back soon!
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
