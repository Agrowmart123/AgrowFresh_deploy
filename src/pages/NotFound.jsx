import React from 'react';
import { Link } from 'react-router-dom'; 

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
    
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">404</h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Oops! Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>

          <Link
            to="/"
            className="inline-block text-[#68911a] px-8 py-3 rounded-lg 
                     font-medium hover:underline transition"
          >
            Go Back Home
          </Link>
        </div>
      </main>

     
    </div>
  );
}