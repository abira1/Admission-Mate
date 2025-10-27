import React from 'react';
import { CodeIcon } from 'lucide-react';
export function Footer() {
  return <footer className="w-full bg-white border-t-4 border-black py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2">
          <CodeIcon className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700 font-bold text-sm">Developed by</span>
          <a href="https://toiral-development.web.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold text-sm hover:text-indigo-700 underline transition-colors">
            Toiral Web Development
          </a>
        </div>
      </div>
    </footer>;
}