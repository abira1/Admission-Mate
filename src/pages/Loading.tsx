import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoaderIcon } from 'lucide-react';
export function Loading() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/results');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5
    }} className="text-center">
        <motion.div animate={{
        rotate: 360
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }} className="inline-block mb-6 sm:mb-8 bg-indigo-300 rounded-full p-5 sm:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <LoaderIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-black" />
        </motion.div>
        <motion.h2 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="text-xl sm:text-2xl md:text-3xl font-black text-black mb-4 px-4">
          Analyzing your eligibility...
        </motion.h2>
        <div className="max-w-xs mx-auto px-4">
          <div className="h-3 sm:h-4 bg-white rounded-full border-3 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: '100%'
          }} transition={{
            duration: 3,
            ease: 'easeInOut'
          }} className="h-full bg-indigo-300" />
          </div>
        </div>
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="text-black mt-4 sm:mt-6 font-bold text-sm sm:text-base px-4">
          Please wait while we find the best matches...
        </motion.p>
      </motion.div>
    </div>;
}