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
  return <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-hidden">
        <div className="max-w-2xl w-full">
          <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center mb-4">
            <motion.div initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.5
          }} className="inline-block mb-2">
              <div className="w-12 h-12 bg-indigo-300 rounded-2xl border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <GraduationCapIcon className="w-6 h-6 text-black" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-black mb-2">
              Admission Mate
            </h1>
            <p className="text-sm text-black font-bold max-w-xl mx-auto px-4">
              Bangladesh's easiest admission eligibility checker
            </p>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black mb-1 text-xs">
                    SSC Year
                  </label>
                  <select value={formData.sscYear} onChange={e => setFormData({
                  ...formData,
                  sscYear: e.target.value
                })} className="w-full px-3 py-2 rounded-xl border-3 border-black focus:outline-none bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm" required>
                    <option value="">Select Year</option>
                    {years.map(year => <option key={year} value={year}>
                        {year}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-black font-black mb-1 text-xs">
                    HSC Year
                  </label>
                  <select value={formData.hscYear} onChange={e => setFormData({
                  ...formData,
                  hscYear: e.target.value
                })} className="w-full px-3 py-2 rounded-xl border-3 border-black focus:outline-none bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm" required>
                    <option value="">Select Year</option>
                    {years.map(year => <option key={year} value={year}>
                        {year}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-black font-black mb-1 text-xs">
                    SSC GPA (Max 5.00)
                  </label>
                  <input type="number" step="0.01" min="0" max="5.00" value={formData.sscGPA || ''} onChange={e => handleGPAChange('sscGPA', e.target.value)} placeholder="Enter GPA" className="w-full px-3 py-2 rounded-xl border-3 border-black focus:outline-none bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm" required />
                </div>
                <div>
                  <label className="block text-black font-black mb-1 text-xs">
                    HSC GPA (Max 5.00)
                  </label>
                  <input type="number" step="0.01" min="0" max="5.00" value={formData.hscGPA || ''} onChange={e => handleGPAChange('hscGPA', e.target.value)} placeholder="Enter GPA" className="w-full px-3 py-2 rounded-xl border-3 border-black focus:outline-none bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-black font-black mb-1 text-xs">
                  Group
                </label>
                <select value={formData.group} onChange={e => setFormData({
                ...formData,
                group: e.target.value
              })} className="w-full px-3 py-2 rounded-xl border-3 border-black focus:outline-none bg-white text-black font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm" required>
                  <option value="">Select Group</option>
                  {groups.map(group => <option key={group} value={group}>
                      {group}
                    </option>)}
                </select>
              </div>
              <motion.button whileHover={{
              scale: 1.02,
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
            }} whileTap={{
              scale: 0.98
            }} type="submit" className="w-full bg-indigo-300 hover:bg-indigo-400 text-black py-2.5 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <SearchIcon className="w-4 h-4" />
                Find Universities
              </motion.button>
            </form>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <CodeIcon className="w-4 h-4 text-black" />
              <span className="text-black font-bold text-sm">Developed by</span>
              <a href="https://toiral-development.web.app/" target="_blank" rel="noopener noreferrer" className="text-black font-bold text-sm hover:text-indigo-600 underline transition-colors">
                Toiral Web Development
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}