import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCapIcon } from 'lucide-react';
export function Navbar() {
  return <nav className="w-full bg-white border-b-4 border-black z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-300 rounded-xl border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <GraduationCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-black text-black">
            AdmissionMate
          </span>
        </Link>
        <div className="flex gap-3 sm:gap-6">
          <Link to="/" className="text-black hover:text-gray-700 font-bold transition-colors text-xs sm:text-sm md:text-base">
            Home
          </Link>
          <Link to="/admin" className="text-black hover:text-gray-700 font-bold transition-colors text-xs sm:text-sm md:text-base">
            Admin
          </Link>
        </div>
      </div>
    </nav>;
}