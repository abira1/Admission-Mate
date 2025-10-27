import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, GraduationCapIcon, CodeIcon } from 'lucide-react';
import { StudentData } from '../types/University';

export function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentData>({
    sscYear: '',
    hscYear: '',
    sscGPA: 0,
    hscGPA: 0,
    group: ''
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from({
    length: 10
  }, (_, i) => currentYear - i);
  const groups = ['Science', 'Business Studies', 'Humanities'];
  
  const handleGPAChange = (field: 'sscGPA' | 'hscGPA', value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || numValue >= 0 && numValue <= 5.0) {
      setFormData({
        ...formData,
        [field]: value === '' ? 0 : numValue
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sscYear && formData.hscYear && formData.sscGPA && formData.hscGPA && formData.group) {
      localStorage.setItem('studentData', JSON.stringify(formData));
      navigate('/loading');
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="text-center mb-8"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5 }} 
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-indigo-400 rounded-2xl border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <GraduationCapIcon className="w-8 h-8 text-black" />
              </div>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 leading-tight">
              Admission Mate
            </h1>
            <p className="text-base sm:text-lg text-gray-700 font-bold max-w-xl mx-auto px-4">
              Bangladesh's easiest admission eligibility checker
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    SSC Year *
                  </label>
                  <select 
                    value={formData.sscYear} 
                    onChange={e => setFormData({ ...formData, sscYear: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    HSC Year *
                  </label>
                  <select 
                    value={formData.hscYear} 
                    onChange={e => setFormData({ ...formData, hscYear: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    SSC GPA (Max 5.00) *
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="5.00" 
                    value={formData.sscGPA || ''} 
                    onChange={e => handleGPAChange('sscGPA', e.target.value)} 
                    placeholder="Enter GPA" 
                    className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    HSC GPA (Max 5.00) *
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="5.00" 
                    value={formData.hscGPA || ''} 
                    onChange={e => handleGPAChange('hscGPA', e.target.value)} 
                    placeholder="Enter GPA" 
                    className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-black font-bold mb-2 text-sm">
                  Group *
                </label>
                <select 
                  value={formData.group} 
                  onChange={e => setFormData({ ...formData, group: e.target.value })} 
                  className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                  required
                >
                  <option value="">Select Group</option>
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)' }} 
                whileTap={{ scale: 0.98 }} 
                type="submit" 
                className="w-full bg-indigo-400 hover:bg-indigo-500 text-black py-4 px-6 rounded-xl font-black text-lg flex items-center justify-center gap-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <SearchIcon className="w-5 h-5" />
                Find My Universities
              </motion.button>
            </form>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }} 
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CodeIcon className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700 font-bold text-sm">Developed by</span>
              <a 
                href="https://toiral-development.web.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 font-bold text-sm hover:text-indigo-700 underline transition-colors"
              >
                Toiral Web Development
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}