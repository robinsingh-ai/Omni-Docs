// NotFound.tsx
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl text-gray-700 mt-4">Page Not Found</p>
                <a href="/" className="text-blue-500 mt-6 inline-block underline">
                    Go back to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
