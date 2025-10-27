import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLinkIcon, CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { University } from '../types/University';

interface UniversityCardProps {
  university: University;
  index: number;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true
        });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(difference / (1000 * 60 * 60) % 24),
        minutes: Math.floor(difference / 1000 / 60 % 60),
        seconds: Math.floor(difference / 1000 % 60),
        expired: false
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return timeLeft;
}

export function UniversityCard({ university, index }: UniversityCardProps) {
  const earliestDeadline = university.units.reduce((earliest, unit) => {
    if (!earliest || new Date(unit.lastApplyDate) < new Date(earliest)) {
      return unit.lastApplyDate;
    }
    return earliest;
  }, university.units[0]?.lastApplyDate);
  
  const countdown = useCountdown(earliestDeadline);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }} 
      className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 className="text-xl sm:text-2xl font-black text-black leading-tight">
          {university.name}
        </h3>
        <span className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold whitespace-nowrap flex-shrink-0 ${university.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
          {university.type === 'public' ? 'Public' : 'Private'}
        </span>
      </div>
      
      {/* Countdown Timer - Mobile Optimized */}
      <div className={`mb-5 p-4 sm:p-5 rounded-xl border-3 border-black transition-all ${
        countdown.expired ? 'bg-red-100' : 'bg-green-50'
      }`}>
        {countdown.expired ? (
          <div className="flex items-center gap-3">
            <XCircleIcon className="w-6 h-6 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-base sm:text-sm font-black text-red-600">
                Application Closed
              </p>
              <p className="text-sm sm:text-xs font-bold text-gray-600 line-through mt-1">
                {new Date(earliestDeadline).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="w-5 h-5 text-green-700" />
              <p className="text-base sm:text-sm font-black text-green-700">
                Application closes in:
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white border-3 border-black rounded-xl p-3 text-center">
                <p className="text-2xl sm:text-xl font-black text-black">
                  {countdown.days}
                </p>
                <p className="text-xs font-bold text-gray-600 mt-1">days</p>
              </div>
              <div className="bg-white border-3 border-black rounded-xl p-3 text-center">
                <p className="text-2xl sm:text-xl font-black text-black">
                  {countdown.hours}
                </p>
                <p className="text-xs font-bold text-gray-600 mt-1">hrs</p>
              </div>
              <div className="bg-white border-3 border-black rounded-xl p-3 text-center">
                <p className="text-2xl sm:text-xl font-black text-black">
                  {countdown.minutes}
                </p>
                <p className="text-xs font-bold text-gray-600 mt-1">min</p>
              </div>
              <div className="bg-white border-3 border-black rounded-xl p-3 text-center">
                <p className="text-2xl sm:text-xl font-black text-black">
                  {countdown.seconds}
                </p>
                <p className="text-xs font-bold text-gray-600 mt-1">sec</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Units Information - Mobile Optimized */}
      <div className="space-y-3 sm:space-y-4 mb-5">
        {university.units.map(unit => {
          const unitCountdown = useCountdown(unit.lastApplyDate);
          return (
            <div key={unit.unitId} className="bg-yellow-50 rounded-xl p-4 border-3 border-black">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="font-black text-black text-base leading-snug flex-1">
                  {unit.unitName}
                </h4>
                <span className="px-3 py-1.5 bg-yellow-200 border-2 border-black rounded-lg text-sm font-bold whitespace-nowrap flex-shrink-0">
                  {unit.minTotalGPA}
                </span>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2 text-gray-700">
                  <CalendarIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-bold leading-relaxed">
                    Exam: {new Date(unit.examDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <ClockIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className={`font-bold leading-relaxed ${
                    unitCountdown.expired ? 'line-through text-gray-500' : ''
                  }`}>
                    Deadline: {new Date(unit.lastApplyDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* CTA Button - Mobile Optimized */}
      <motion.a 
        href={university.admission_page} 
        target="_blank" 
        rel="noopener noreferrer" 
        whileTap={{ scale: 0.97 }}
        className={`block w-full py-4 sm:py-3 px-6 rounded-xl font-black text-lg sm:text-base text-center flex items-center justify-center gap-2 border-3 border-black transition-all ${
          countdown.expired 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-yellow-400 text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]'
        }`}
      >
        {countdown.expired ? 'Application Closed' : 'Apply Now'}
        {!countdown.expired && <ExternalLinkIcon className="w-5 h-5" />}
      </motion.a>
    </motion.div>
  );
}