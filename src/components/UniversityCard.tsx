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
export function UniversityCard({
  university,
  index
}: UniversityCardProps) {
  // Find the earliest deadline among all units
  const earliestDeadline = university.units.reduce((earliest, unit) => {
    if (!earliest || new Date(unit.lastApplyDate) < new Date(earliest)) {
      return unit.lastApplyDate;
    }
    return earliest;
  }, university.units[0]?.lastApplyDate);
  const countdown = useCountdown(earliestDeadline);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: index * 0.1
  }} whileHover={{
    y: -5,
    boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
  }} className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <h3 className="text-xl font-black text-black mb-3">{university.name}</h3>
      {/* Countdown Timer */}
      <div className={`mb-4 p-3 rounded-xl border-3 border-black ${countdown.expired ? 'bg-red-100' : 'bg-blue-100'}`}>
        {countdown.expired ? <div className="flex items-center gap-2">
            <XCircleIcon className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-black text-red-600">
                Application Closed
              </p>
              <p className="text-xs font-bold text-gray-600 line-through">
                {new Date(earliestDeadline).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
              </p>
            </div>
          </div> : <div>
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-black text-blue-600">
                Application closes in:
              </p>
            </div>
            <div className="flex gap-2 text-center">
              <div className="bg-white border-2 border-black rounded-lg px-2 py-1 min-w-[50px]">
                <p className="text-lg font-black text-black">
                  {countdown.days}
                </p>
                <p className="text-xs font-bold text-gray-600">days</p>
              </div>
              <div className="bg-white border-2 border-black rounded-lg px-2 py-1 min-w-[50px]">
                <p className="text-lg font-black text-black">
                  {countdown.hours}
                </p>
                <p className="text-xs font-bold text-gray-600">hrs</p>
              </div>
              <div className="bg-white border-2 border-black rounded-lg px-2 py-1 min-w-[50px]">
                <p className="text-lg font-black text-black">
                  {countdown.minutes}
                </p>
                <p className="text-xs font-bold text-gray-600">min</p>
              </div>
              <div className="bg-white border-2 border-black rounded-lg px-2 py-1 min-w-[50px]">
                <p className="text-lg font-black text-black">
                  {countdown.seconds}
                </p>
                <p className="text-xs font-bold text-gray-600">sec</p>
              </div>
            </div>
          </div>}
      </div>
      {/* Units Information */}
      <div className="space-y-3 mb-4">
        {university.units.map(unit => {
        const unitCountdown = useCountdown(unit.lastApplyDate);
        return <div key={unit.unitId} className="bg-yellow-50 rounded-xl p-3 border-2 border-black">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-black text-black text-sm">
                  {unit.unitName}
                </h4>
                <span className="px-2 py-1 bg-yellow-200 border-2 border-black rounded text-xs font-bold">
                  Min GPA: {unit.minTotalGPA}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-black">
                  <CalendarIcon className="w-3 h-3" />
                  <span className="font-bold">
                    Exam:{' '}
                    {new Date(unit.examDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-black">
                  <ClockIcon className="w-3 h-3" />
                  <span className={`font-bold ${unitCountdown.expired ? 'line-through text-gray-500' : ''}`}>
                    Deadline:{' '}
                    {new Date(unit.lastApplyDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
                  </span>
                </div>
              </div>
            </div>;
      })}
      </div>
      <a href={university.admission_page} target="_blank" rel="noopener noreferrer" className={`w-full py-3 px-6 rounded-xl font-black flex items-center justify-center gap-2 border-3 border-black transition-all ${countdown.expired ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}`}>
        {countdown.expired ? 'Application Closed' : 'Apply Now'}
        {!countdown.expired && <ExternalLinkIcon className="w-4 h-4" />}
      </a>
    </motion.div>;
}