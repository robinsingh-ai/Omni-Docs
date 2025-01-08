import React from 'react';
import '../index.css';
export default function Spinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
        </div >
    );
}