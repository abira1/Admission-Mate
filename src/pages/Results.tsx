import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, SearchIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { Footer } from '../components/Footer';
import { UniversityCard } from '../components/UniversityCard';
import { University, StudentData } from '../types/University';
import { getUniversities, subscribeToUniversities } from '../utils/database';
interface EligibilityResult {
  university: University;
  eligibleUnits: Array<{
    unit: any;
    status: 'Open' | 'Closed';
    daysUntilDeadline: number;
  }>;
  totalEligibleUnits: number;
}
function matchEligibleUniversities(studentData: StudentData, allUniversities: University[]): EligibilityResult[] {
  const totalGPA = studentData.sscGPA + studentData.hscGPA;
  const today = new Date();
  const studentSSCYear = parseInt(studentData.sscYear);
  const studentHSCYear = parseInt(studentData.hscYear);
  const results = allUniversities.map(university => {
    // Check university-level allowed years
    const universitySSCYears = university.allowedYears?.ssc || [];
    const universityHSCYears = university.allowedYears?.hsc || [];
    // If university has year restrictions, check if student's years match
    const universityYearAllowed = (universitySSCYears.length === 0 || universitySSCYears.includes(studentSSCYear)) && (universityHSCYears.length === 0 || universityHSCYears.includes(studentHSCYear));
    if (!universityYearAllowed) {
      return null;
    }
    const eligibleUnits = university.units.map(unit => {
      // 1. Year Matching (Unit-level or fallback to University-level)
      const unitSSCYears = unit.allowedYears?.ssc || universitySSCYears;
      const unitHSCYears = unit.allowedYears?.hsc || universityHSCYears;
      const yearAllowed = (unitSSCYears.length === 0 || unitSSCYears.includes(studentSSCYear)) && (unitHSCYears.length === 0 || unitHSCYears.includes(studentHSCYear));
      if (!yearAllowed) return null;
      // 2. Group Matching
      const groupMatch = unit.groupAllowed.includes(studentData.group) || unit.groupAllowed.includes('All');
      if (!groupMatch) return null;
      // 3. GPA Threshold Check
      const totalGPAPass = totalGPA >= unit.minTotalGPA;
      const sscGPAPass = !unit.minSSC_GPA || studentData.sscGPA >= unit.minSSC_GPA;
      const hscGPAPass = !unit.minHSC_GPA || studentData.hscGPA >= unit.minHSC_GPA;
      if (!totalGPAPass || !sscGPAPass || !hscGPAPass) return null;
      // 4. Deadline Validation
      const deadline = new Date(unit.lastApplyDate);
      const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const status = deadline >= today ? 'Open' : 'Closed';
      return {
        unit,
        status,
        daysUntilDeadline
      };
    }).filter(result => result !== null);
    return {
      university,
      eligibleUnits,
      totalEligibleUnits: eligibleUnits.length
    };
  }).filter(result => result !== null && result.totalEligibleUnits > 0);
  // Sort by: Open status first, then soonest deadline, then highest GPA requirement
  return results.sort((a, b) => {
    const aHasOpen = a.eligibleUnits.some(u => u.status === 'Open');
    const bHasOpen = b.eligibleUnits.some(u => u.status === 'Open');
    if (aHasOpen && !bHasOpen) return -1;
    if (!aHasOpen && bHasOpen) return 1;
    const aEarliestDeadline = Math.min(...a.eligibleUnits.map(u => u.daysUntilDeadline));
    const bEarliestDeadline = Math.min(...b.eligibleUnits.map(u => u.daysUntilDeadline));
    if (aEarliestDeadline !== bEarliestDeadline) {
      return aEarliestDeadline - bEarliestDeadline;
    }
    const aHighestGPA = Math.max(...a.eligibleUnits.map(u => u.unit.minTotalGPA));
    const bHighestGPA = Math.max(...b.eligibleUnits.map(u => u.unit.minTotalGPA));
    return bHighestGPA - aHighestGPA;
  });
}
export function Results() {
  const navigate = useNavigate();
  const [eligibilityResults, setEligibilityResults] = useState<EligibilityResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<EligibilityResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (!data) {
      navigate('/');
      return;
    }

    const student: StudentData = JSON.parse(data);
    setStudentData(student);

    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Load universities from Firebase initially
        const allUniversities = await getUniversities();
        console.log('🔍 DEBUG: Total universities loaded:', allUniversities.length);
        console.log('🔍 DEBUG: Universities data:', allUniversities);
        console.log('🔍 DEBUG: Student data:', student);
        console.log('🔍 DEBUG: Student total GPA:', student.sscGPA + student.hscGPA);
        
        setTotalUniversities(allUniversities.length);

        if (allUniversities.length === 0) {
          console.warn('⚠️ No universities found in database!');
          setEligibilityResults([]);
          setFilteredResults([]);
          setLoading(false);
          return;
        }

        // Run matching algorithm
        const results = matchEligibleUniversities(student, allUniversities);
        console.log('✅ Eligible universities found:', results.length);
        console.log('✅ Matching results:', results);

        setEligibilityResults(results);
        setFilteredResults(results);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading universities:', error);
        setTotalUniversities(0);
        setEligibilityResults([]);
        setFilteredResults([]);
        setLoading(false);
      }
    };

    loadInitialData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUniversities((updatedUniversities) => {
      console.log('Real-time update: Universities changed', updatedUniversities.length);
      setTotalUniversities(updatedUniversities.length);
      
      // Re-run matching algorithm with updated universities
      const results = matchEligibleUniversities(student, updatedUniversities);
      console.log('Updated eligible universities:', results.length);
      
      setEligibilityResults(results);
      setFilteredResults(results);
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [navigate]);
  useEffect(() => {
    let filtered = eligibilityResults;
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(result => result.university.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Apply status filter
    if (filterStatus === 'open') {
      filtered = filtered.filter(result => result.eligibleUnits.some(u => u.status === 'Open'));
    } else if (filterStatus === 'closed') {
      filtered = filtered.filter(result => result.eligibleUnits.every(u => u.status === 'Closed'));
    }
    setFilteredResults(filtered);
  }, [searchTerm, filterStatus, eligibilityResults]);
  const totalEligibleUnits = eligibilityResults.reduce((sum, result) => sum + result.totalEligibleUnits, 0);
  const openUnitsCount = eligibilityResults.reduce((sum, result) => sum + result.eligibleUnits.filter(u => u.status === 'Open').length, 0);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-indigo-400 mb-4"></div>
            <p className="text-black font-bold text-lg">Loading universities...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-black active:text-gray-700 font-bold transition-colors bg-white px-5 py-4 sm:py-3 rounded-xl border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all w-fit text-lg sm:text-base">
            <ArrowLeftIcon className="w-6 h-6 sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </button>
          {/* Student Info Summary - Mobile Optimized */}
          {studentData && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="bg-white rounded-2xl border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-4">
                {/* GPA Cards - Full width on mobile, grid on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-100 px-4 py-3 rounded-xl border-3 border-black text-center">
                    <span className="text-xs font-bold text-gray-700 block mb-1">SSC GPA</span>
                    <p className="text-2xl sm:text-xl font-black text-black">
                      {studentData.sscGPA}
                    </p>
                  </div>
                  <div className="bg-green-100 px-4 py-3 rounded-xl border-3 border-black text-center">
                    <span className="text-xs font-bold text-gray-700 block mb-1">HSC GPA</span>
                    <p className="text-2xl sm:text-xl font-black text-black">
                      {studentData.hscGPA}
                    </p>
                  </div>
                  <div className="bg-yellow-100 px-4 py-3 rounded-xl border-3 border-black text-center">
                    <span className="text-xs font-bold text-gray-700 block mb-1">
                      Total GPA
                    </span>
                    <p className="text-2xl sm:text-xl font-black text-black">
                      {(studentData.sscGPA + studentData.hscGPA).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-100 px-4 py-3 rounded-xl border-3 border-black text-center col-span-2 sm:col-span-1">
                    <span className="text-xs font-bold text-gray-700 block mb-1">
                      Group
                    </span>
                    <p className="text-lg sm:text-base font-black text-black truncate">
                      {studentData.group}
                    </p>
                  </div>
                </div>
                {/* Status Badges */}
                <div className="flex gap-3 justify-center sm:justify-start">
                  <div className="bg-green-100 px-4 py-2.5 rounded-xl border-3 border-black flex-1 sm:flex-none text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-700">
                        {openUnitsCount} Open
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-100 px-4 py-2.5 rounded-xl border-3 border-black flex-1 sm:flex-none text-center">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircleIcon className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-bold text-red-700">
                        {totalEligibleUnits - openUnitsCount} Closed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>}
          {/* Search and Filters - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search universities..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-12 pr-4 py-4 sm:py-3 rounded-xl border-3 border-black focus:outline-none focus:ring-4 focus:ring-indigo-300 bg-white text-black text-base font-bold w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all" 
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:flex">
              <button 
                onClick={() => setFilterStatus('all')} 
                className={`px-4 sm:px-5 py-3.5 sm:py-3 rounded-xl border-3 border-black font-bold text-base sm:text-sm transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  filterStatus === 'all' 
                    ? 'bg-indigo-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus('open')} 
                className={`px-4 sm:px-5 py-3.5 sm:py-3 rounded-xl border-3 border-black font-bold text-base sm:text-sm transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  filterStatus === 'open' 
                    ? 'bg-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Open
              </button>
              <button 
                onClick={() => setFilterStatus('closed')} 
                className={`px-4 sm:px-5 py-3.5 sm:py-3 rounded-xl border-3 border-black font-bold text-base sm:text-sm transition-all active:translate-x-[2px] active:translate-y-[2px] ${
                  filterStatus === 'closed' 
                    ? 'bg-red-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Closed
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4 leading-tight">
            Your Eligible Universities
          </h1>
          <p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">
            {totalUniversities === 0 ? <span className="text-red-600">
                No universities in database. Please add universities in the
                Admin panel first.
              </span> : <>
                Found <span className="text-indigo-600 font-black">{filteredResults.length}</span> eligible out of{' '}
                {totalUniversities} total with <span className="text-green-600 font-black">{totalEligibleUnits}</span> programs
              </>}
          </p>
        </motion.div>
        {totalUniversities === 0 ? <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-12 sm:py-20 bg-white rounded-3xl border-4 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircleIcon className="w-20 h-20 text-orange-500 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 px-4">
              No Universities Found
            </h2>
            <p className="text-gray-700 font-bold mb-6 max-w-md mx-auto text-base px-4 leading-relaxed">
              The university database is empty. Please contact the administrator.
            </p>
          </motion.div> : filteredResults.length === 0 ? <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-12 sm:py-20 bg-white rounded-3xl border-4 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircleIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 px-4">
              No Eligible Universities Found
            </h2>
            <p className="text-gray-700 font-bold px-4 max-w-md mx-auto mb-4 text-base leading-relaxed">
              Based on your GPA ({studentData?.sscGPA} + {studentData?.hscGPA} ={' '}
              {((studentData?.sscGPA || 0) + (studentData?.hscGPA || 0)).toFixed(2)}
              ) and group ({studentData?.group}), no universities match.
            </p>
            <p className="text-sm text-gray-600 font-bold mb-8 px-4">
              Try adjusting your filters or check back later.
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-indigo-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all\">
              Try Different Criteria
            </button>
          </motion.div> : <div className="grid gap-5 sm:gap-6 pb-6 sm:pb-8">
            {filteredResults.map((result, index) => <UniversityCard key={result.university.id} university={result.university} index={index} />)}
          </div>}
      </div>
      )}
      <Footer />
    </div>
  );
}