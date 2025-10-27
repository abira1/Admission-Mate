import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, ListIcon, EditIcon, TrashIcon, XIcon, SaveIcon, InfoIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { University, UniversityUnit } from '../types/University';
import { getUniversities, addUniversity, updateUniversity, deleteUniversity, initializeUniversities } from '../utils/database';
const INITIAL_UNIVERSITIES: University[] = [{
  id: 'du',
  name: 'University of Dhaka',
  type: 'public',
  website: 'https://www.du.ac.bd',
  admission_page: 'https://www.du.ac.bd/admission',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'A',
    unitName: 'Unit A (Science/Engineering)',
    minTotalGPA: 8.0,
    minSSC_GPA: 3.5,
    minHSC_GPA: 3.5,
    groupAllowed: ['Science'],
    notes: 'Check department page for subject-specific requirements',
    lastVerified: '2024-12-27',
    examDate: '2025-10-15T10:00:00Z',
    lastApplyDate: '2025-09-30T23:59:59Z',
    allowedYears: {
      ssc: [2023, 2024],
      hsc: [2025]
    }
  }, {
    unitId: 'B',
    unitName: 'Unit B (Humanities)',
    minTotalGPA: 7.5,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Humanities'],
    notes: 'Arts and social science programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-20T10:00:00Z',
    lastApplyDate: '2025-10-05T23:59:59Z'
  }, {
    unitId: 'C',
    unitName: 'Unit C (Business Studies)',
    minTotalGPA: 7.5,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Business Studies'],
    notes: 'Subject/Accounting requirement might apply',
    lastVerified: '2024-12-27',
    examDate: '2025-10-25T10:00:00Z',
    lastApplyDate: '2025-10-10T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'buet',
  name: 'Bangladesh University of Engineering and Technology (BUET)',
  type: 'public',
  website: 'https://www.buet.ac.bd',
  admission_page: 'http://ugadmission.buet.ac.bd',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'ENG',
    unitName: 'Engineering Programs',
    minTotalGPA: 9.0,
    minSSC_GPA: 4.5,
    minHSC_GPA: 4.5,
    groupAllowed: ['Science'],
    notes: 'Strong subject grades required in Math/Physics. Pre-selection rules apply.',
    lastVerified: '2024-12-27',
    examDate: '2025-11-05T09:00:00Z',
    lastApplyDate: '2025-10-15T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'ju',
  name: 'Jahangirnagar University',
  type: 'public',
  website: 'https://www.juniv.edu',
  admission_page: 'https://www.juniv.edu/admission',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'A',
    unitName: 'Unit A (Science)',
    minTotalGPA: 8.5,
    minSSC_GPA: 4.0,
    minHSC_GPA: 4.0,
    groupAllowed: ['Science'],
    notes: 'Check unit circular for specific requirements',
    lastVerified: '2024-12-27',
    examDate: '2025-10-18T10:00:00Z',
    lastApplyDate: '2025-10-01T23:59:59Z'
  }, {
    unitId: 'B',
    unitName: 'Unit B (Humanities)',
    minTotalGPA: 7.0,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Humanities'],
    notes: 'Arts and social science programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-22T10:00:00Z',
    lastApplyDate: '2025-10-06T23:59:59Z'
  }, {
    unitId: 'C',
    unitName: 'Unit C (Business Studies)',
    minTotalGPA: 7.5,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Business Studies'],
    notes: 'Business administration programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-28T10:00:00Z',
    lastApplyDate: '2025-10-12T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'nsu',
  name: 'North South University',
  type: 'private',
  website: 'https://www.northsouth.edu',
  admission_page: 'https://www.northsouth.edu/admissions',
  allowedYears: {
    ssc: [2020, 2021, 2022, 2023, 2024],
    hsc: [2022, 2023, 2024, 2025]
  },
  units: [{
    unitId: 'GEN',
    unitName: 'General Programs',
    minTotalGPA: 6.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Science', 'Business Studies', 'Humanities'],
    notes: 'Check NSU admissions page for program-specific requirements',
    lastVerified: '2024-12-27',
    examDate: '2025-09-15T10:00:00Z',
    lastApplyDate: '2025-08-31T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'bup',
  name: 'Bangladesh University of Professionals (BUP)',
  type: 'public',
  website: 'https://www.bup.edu.bd',
  admission_page: 'https://www.bup.edu.bd/admission',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'SCI',
    unitName: 'Science Programs',
    minTotalGPA: 9.0,
    minSSC_GPA: 4.0,
    minHSC_GPA: 4.0,
    groupAllowed: ['Science'],
    notes: 'High combined GPA required. Check program page for specific requirements',
    lastVerified: '2024-12-27',
    examDate: '2025-11-10T10:00:00Z',
    lastApplyDate: '2025-10-25T23:59:59Z'
  }, {
    unitId: 'BUS',
    unitName: 'Business & Social Science',
    minTotalGPA: 8.0,
    minSSC_GPA: 3.5,
    minHSC_GPA: 3.5,
    groupAllowed: ['Business Studies', 'Humanities'],
    notes: 'Verify program-specific requirements on official website',
    lastVerified: '2024-12-27',
    examDate: '2025-11-15T10:00:00Z',
    lastApplyDate: '2025-10-30T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'cu',
  name: 'University of Chittagong',
  type: 'public',
  website: 'https://www.cu.ac.bd',
  admission_page: 'https://www.cu.ac.bd/admission',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'A',
    unitName: 'Unit A (Science)',
    minTotalGPA: 7.0,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Science'],
    notes: 'General public university minimum rules apply',
    lastVerified: '2024-12-27',
    examDate: '2025-10-12T10:00:00Z',
    lastApplyDate: '2025-09-27T23:59:59Z'
  }, {
    unitId: 'B',
    unitName: 'Unit B (Humanities)',
    minTotalGPA: 6.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Humanities'],
    notes: 'Check official circular for updated requirements',
    lastVerified: '2024-12-27',
    examDate: '2025-10-16T10:00:00Z',
    lastApplyDate: '2025-10-01T23:59:59Z'
  }, {
    unitId: 'C',
    unitName: 'Unit C (Business Studies)',
    minTotalGPA: 6.5,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Business Studies'],
    notes: 'Business administration and commerce programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-20T10:00:00Z',
    lastApplyDate: '2025-10-05T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'ku',
  name: 'Khulna University',
  type: 'public',
  website: 'https://www.ku.ac.bd',
  admission_page: 'https://www.ku.ac.bd/admission',
  allowedYears: {
    ssc: [2022, 2023, 2024],
    hsc: [2024, 2025]
  },
  units: [{
    unitId: 'A',
    unitName: 'Unit A (Science)',
    minTotalGPA: 7.0,
    minSSC_GPA: 3.0,
    minHSC_GPA: 3.0,
    groupAllowed: ['Science'],
    notes: 'Cluster admission rules apply for science group',
    lastVerified: '2024-12-27',
    examDate: '2025-10-08T10:00:00Z',
    lastApplyDate: '2025-09-23T23:59:59Z'
  }, {
    unitId: 'B',
    unitName: 'Unit B (Humanities)',
    minTotalGPA: 6.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Humanities'],
    notes: 'Arts and social science programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-11T10:00:00Z',
    lastApplyDate: '2025-09-26T23:59:59Z'
  }, {
    unitId: 'C',
    unitName: 'Unit C (Business Studies)',
    minTotalGPA: 6.5,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Business Studies'],
    notes: 'Business administration programs',
    lastVerified: '2024-12-27',
    examDate: '2025-10-14T10:00:00Z',
    lastApplyDate: '2025-09-29T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'gub',
  name: 'Green University of Bangladesh',
  type: 'private',
  website: 'https://www.green.edu.bd',
  admission_page: 'https://www.green.edu.bd/admission',
  allowedYears: {
    ssc: [2020, 2021, 2022, 2023, 2024],
    hsc: [2022, 2023, 2024, 2025]
  },
  units: [{
    unitId: 'GEN',
    unitName: 'General Programs',
    minTotalGPA: 5.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Science', 'Business Studies', 'Humanities'],
    notes: 'Min GPA 2.5 in both exams, OR if one exam has GPA 2.0 then total must be 6.0',
    lastVerified: '2024-12-27',
    examDate: '2025-09-20T10:00:00Z',
    lastApplyDate: '2025-09-10T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'wub',
  name: 'World University of Bangladesh',
  type: 'private',
  website: 'https://admission.wub.edu.bd',
  admission_page: 'https://admission.wub.edu.bd',
  allowedYears: {
    ssc: [2020, 2021, 2022, 2023, 2024],
    hsc: [2022, 2023, 2024, 2025]
  },
  units: [{
    unitId: 'GEN',
    unitName: 'General Programs',
    minTotalGPA: 5.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Science', 'Business Studies', 'Humanities'],
    notes: 'Combined GPA 5.0 with min 2.5 in each, OR total GPA 6.0 if one exam below 2.5',
    lastVerified: '2024-12-27',
    examDate: '2025-09-25T10:00:00Z',
    lastApplyDate: '2025-09-15T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'buhs',
  name: 'Bangladesh University of Health Sciences',
  type: 'private',
  website: 'https://buhs.ac.bd',
  admission_page: 'https://buhs.ac.bd/admission',
  allowedYears: {
    ssc: [2020, 2021, 2022, 2023, 2024],
    hsc: [2022, 2023, 2024, 2025]
  },
  units: [{
    unitId: 'HEALTH',
    unitName: 'Health Sciences Programs',
    minTotalGPA: 5.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Science'],
    notes: 'Min GPA 2.5 in both SSC & HSC, OR if one has GPA 2.0 then total at least 6.0',
    lastVerified: '2024-12-27',
    examDate: '2025-09-18T10:00:00Z',
    lastApplyDate: '2025-09-05T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}, {
  id: 'bubt',
  name: 'Bangladesh University of Business & Technology',
  type: 'private',
  website: 'https://www.bubt.edu.bd',
  admission_page: 'https://www.bubt.edu.bd/admission',
  allowedYears: {
    ssc: [2020, 2021, 2022, 2023, 2024],
    hsc: [2022, 2023, 2024, 2025]
  },
  units: [{
    unitId: 'GEN',
    unitName: 'General Programs',
    minTotalGPA: 5.0,
    minSSC_GPA: 2.5,
    minHSC_GPA: 2.5,
    groupAllowed: ['Science', 'Business Studies', 'Humanities'],
    notes: 'Min GPA 2.5/2nd division in SSC & HSC, OR if one exam below then total 6.0',
    lastVerified: '2024-12-27',
    examDate: '2025-09-22T10:00:00Z',
    lastApplyDate: '2025-09-12T23:59:59Z'
  }],
  lastUpdated: '2024-12-27',
  editable: true,
  isActive: true,
  createdAt: new Date()
}];
export function Admin() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [universities, setUniversities] = useState<University[]>([]);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setLoading(true);
        // Initialize with default data if database is empty
        await initializeUniversities(INITIAL_UNIVERSITIES);
        
        // Fetch universities from Firebase
        const unis = await getUniversities();
        setUniversities(unis);
      } catch (error) {
        console.error('Error loading universities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, []);

  const handleAddUniversity = async (university: Omit<University, 'id' | 'createdAt'>) => {
    try {
      const newUniversity: University = {
        ...university,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      await addUniversity(newUniversity);
      const updated = await getUniversities();
      setUniversities(updated);
      setActiveTab('list');
    } catch (error) {
      console.error('Error adding university:', error);
      alert('Failed to add university. Please try again.');
    }
  };

  const handleUpdateUniversity = async (university: University) => {
    try {
      await updateUniversity(university);
      const updated = await getUniversities();
      setUniversities(updated);
      setEditingUniversity(null);
    } catch (error) {
      console.error('Error updating university:', error);
      alert('Failed to update university. Please try again.');
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    try {
      await deleteUniversity(id);
      const updated = await getUniversities();
      setUniversities(updated);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting university:', error);
      alert('Failed to delete university. Please try again.');
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 gap-6 sm:gap-8">
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="w-full lg:w-64 bg-white rounded-3xl border-4 border-black p-6 h-fit lg:sticky lg:top-24 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl sm:text-2xl font-black text-black mb-6">
            Admin Panel
          </h2>
          <div className="space-y-3">
            <button onClick={() => setActiveTab('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all border-3 border-black ${activeTab === 'list' ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-yellow-100'}`}>
              <ListIcon className="w-5 h-5" />
              All Universities ({universities.length})
            </button>
            <button onClick={() => setActiveTab('add')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all border-3 border-black ${activeTab === 'add' ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-yellow-100'}`}>
              <PlusIcon className="w-5 h-5" />
              Add New University
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-100 rounded-xl border-3 border-black">
            <div className="flex items-start gap-2">
              <InfoIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
              <div className="text-xs text-black font-bold">
                <p className="mb-2">
                  Enter university details and add units with specific
                  requirements.
                </p>
                <p>
                  Each unit can have different GPA requirements and allowed
                  groups.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="flex-1">
          {activeTab === 'list' ? <UniversityList universities={universities} onEdit={setEditingUniversity} onDelete={id => setDeleteConfirm(id)} /> : <AddUniversityForm onSubmit={handleAddUniversity} />}
        </motion.div>
      </div>
      <AnimatePresence>
        {editingUniversity && <EditModal university={editingUniversity} onClose={() => setEditingUniversity(null)} onSave={handleUpdateUniversity} />}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirm && <DeleteConfirmModal onConfirm={() => handleDeleteUniversity(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />}
      </AnimatePresence>
      <Footer />
    </div>;
}
function UniversityList({
  universities,
  onEdit,
  onDelete
}: {
  universities: University[];
  onEdit: (uni: University) => void;
  onDelete: (id: string) => void;
}) {
  return <div className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">
        All Universities
      </h2>
      <div className="space-y-4">
        {universities.map(uni => <div key={uni.id} className="border-4 border-black rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-black text-black mb-2">
                  {uni.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-bold">
                    {uni.type}
                  </span>
                  <span className="px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-bold">
                    {uni.units.length}{' '}
                    {uni.units.length === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>
                <a href={uni.admission_page} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 font-bold underline">
                  Admission Page →
                </a>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(uni)} className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <EditIcon className="w-4 h-4 text-black" />
                </button>
                <button onClick={() => onDelete(uni.id)} className="p-2 bg-red-400 hover:bg-red-500 rounded-lg transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <TrashIcon className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {uni.units.map(unit => <div key={unit.unitId} className="bg-white border-3 border-black rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-black text-black">{unit.unitName}</h4>
                    <span className="px-2 py-1 bg-yellow-200 border-2 border-black rounded text-xs font-bold">
                      Min GPA: {unit.minTotalGPA}
                    </span>
                  </div>
                  <div className="text-sm text-black font-bold space-y-1">
                    <p>Groups: {unit.groupAllowed.join(', ')}</p>
                    {unit.minSSC_GPA && <p>Min SSC: {unit.minSSC_GPA}</p>}
                    {unit.minHSC_GPA && <p>Min HSC: {unit.minHSC_GPA}</p>}
                    {unit.notes && <p className="text-xs mt-2 text-gray-700">{unit.notes}</p>}
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
}
function AddUniversityForm({
  onSubmit
}: {
  onSubmit: (university: Omit<University, 'id' | 'createdAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'public' as 'public' | 'private',
    website: '',
    admission_page: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    editable: true,
    isActive: true,
    allowedSSCYears: '',
    allowedHSCYears: ''
  });
  const [units, setUnits] = useState<UniversityUnit[]>([{
    unitId: '',
    unitName: '',
    minTotalGPA: 0,
    minSSC_GPA: undefined,
    minHSC_GPA: undefined,
    groupAllowed: [],
    notes: '',
    lastVerified: new Date().toISOString().split('T')[0],
    examDate: '',
    lastApplyDate: ''
  }]);
  const groups = ['Science', 'Business Studies', 'Humanities'];
  const addUnit = () => {
    setUnits([...units, {
      unitId: '',
      unitName: '',
      minTotalGPA: 0,
      minSSC_GPA: undefined,
      minHSC_GPA: undefined,
      groupAllowed: [],
      notes: '',
      lastVerified: new Date().toISOString().split('T')[0],
      examDate: '',
      lastApplyDate: ''
    }]);
  };
  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };
  const updateUnit = (index: number, field: keyof UniversityUnit, value: any) => {
    const updated = [...units];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setUnits(updated);
  };
  const toggleGroup = (index: number, group: string) => {
    const updated = [...units];
    const currentGroups = updated[index].groupAllowed;
    updated[index].groupAllowed = currentGroups.includes(group) ? currentGroups.filter(g => g !== group) : [...currentGroups, group];
    setUnits(updated);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedYears = formData.allowedSSCYears && formData.allowedHSCYears ? {
      ssc: formData.allowedSSCYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y)),
      hsc: formData.allowedHSCYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y))
    } : undefined;
    onSubmit({
      name: formData.name,
      type: formData.type,
      website: formData.website,
      admission_page: formData.admission_page,
      lastUpdated: formData.lastUpdated,
      editable: formData.editable,
      isActive: formData.isActive,
      allowedYears,
      units
    });
  };
  return <div className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">
        Add New University
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-black font-black mb-2">
            University Name
          </label>
          <input type="text" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
        </div>
        <div>
          <label className="block text-black font-black mb-2">
            University Type
          </label>
          <select value={formData.type} onChange={e => setFormData({
          ...formData,
          type: e.target.value as 'public' | 'private'
        })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="block text-black font-black mb-2">
            Official Website
          </label>
          <input type="url" value={formData.website} onChange={e => setFormData({
          ...formData,
          website: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
        </div>
        <div>
          <label className="block text-black font-black mb-2">
            Admission Page URL
          </label>
          <input type="url" value={formData.admission_page} onChange={e => setFormData({
          ...formData,
          admission_page: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
        </div>
        <div className="border-t-4 border-black pt-6">
          <h3 className="text-xl font-black text-black mb-4">
            Allowed Years (University Level)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-black font-bold mb-2 text-sm">
                Allowed SSC Years (comma separated)
              </label>
              <input type="text" value={formData.allowedSSCYears} onChange={e => setFormData({
              ...formData,
              allowedSSCYears: e.target.value
            })} placeholder="e.g., 2022, 2023, 2024" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
              <p className="text-xs text-gray-600 mt-1">
                Leave empty to allow all years
              </p>
            </div>
            <div>
              <label className="block text-black font-bold mb-2 text-sm">
                Allowed HSC Years (comma separated)
              </label>
              <input type="text" value={formData.allowedHSCYears} onChange={e => setFormData({
              ...formData,
              allowedHSCYears: e.target.value
            })} placeholder="e.g., 2024, 2025" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
              <p className="text-xs text-gray-600 mt-1">
                Leave empty to allow all years
              </p>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-black pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-black">Units / Programs</h3>
            <button type="button" onClick={addUnit} className="flex items-center gap-2 px-4 py-2 bg-green-400 rounded-lg border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <PlusIcon className="w-4 h-4" />
              Add Unit
            </button>
          </div>
          <div className="space-y-4">
            {units.map((unit, index) => <div key={index} className="bg-yellow-50 border-3 border-black rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-black">Unit {index + 1}</h4>
                  {units.length > 1 && <button type="button" onClick={() => removeUnit(index)} className="p-2 bg-red-400 rounded-lg border-2 border-black">
                      <XIcon className="w-4 h-4" />
                    </button>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Unit ID
                    </label>
                    <input type="text" value={unit.unitId} onChange={e => updateUnit(index, 'unitId', e.target.value)} placeholder="e.g., A, B, C, ENG" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Unit Name
                    </label>
                    <input type="text" value={unit.unitName} onChange={e => updateUnit(index, 'unitName', e.target.value)} placeholder="e.g., Unit A (Science)" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                  </div>
                </div>
                <div className="border-t-2 border-black pt-4">
                  <h5 className="text-sm font-black text-black mb-3">
                    Unit-Specific Allowed Years (Optional)
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold mb-2 text-xs">
                        Unit SSC Years (comma separated)
                      </label>
                      <input type="text" value={unit.allowedYears?.ssc?.join(', ') || ''} onChange={e => {
                    const years = e.target.value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                    updateUnit(index, 'allowedYears', years.length > 0 ? {
                      ssc: years,
                      hsc: unit.allowedYears?.hsc || []
                    } : undefined);
                  }} placeholder="Leave empty to use university years" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-xs" />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2 text-xs">
                        Unit HSC Years (comma separated)
                      </label>
                      <input type="text" value={unit.allowedYears?.hsc?.join(', ') || ''} onChange={e => {
                    const years = e.target.value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                    updateUnit(index, 'allowedYears', years.length > 0 ? {
                      ssc: unit.allowedYears?.ssc || [],
                      hsc: years
                    } : undefined);
                  }} placeholder="Leave empty to use university years" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-xs" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      📅 Exam Date
                    </label>
                    <input type="datetime-local" value={unit.examDate ? unit.examDate.slice(0, 16) : ''} onChange={e => updateUnit(index, 'examDate', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      ⏰ Last Date for Application
                    </label>
                    <input type="datetime-local" value={unit.lastApplyDate ? unit.lastApplyDate.slice(0, 16) : ''} onChange={e => updateUnit(index, 'lastApplyDate', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                    {unit.lastApplyDate && unit.examDate && new Date(unit.lastApplyDate) >= new Date(unit.examDate) && <p className="text-xs text-red-600 font-bold mt-1">
                          ⚠️ Application deadline must be before exam date
                        </p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Min Total GPA
                    </label>
                    <input type="number" step="0.1" value={unit.minTotalGPA} onChange={e => updateUnit(index, 'minTotalGPA', parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Min SSC GPA
                    </label>
                    <input type="number" step="0.1" value={unit.minSSC_GPA || ''} onChange={e => updateUnit(index, 'minSSC_GPA', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Optional" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Min HSC GPA
                    </label>
                    <input type="number" step="0.1" value={unit.minHSC_GPA || ''} onChange={e => updateUnit(index, 'minHSC_GPA', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Optional" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    Allowed Groups
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {groups.map(group => <label key={group} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={unit.groupAllowed.includes(group)} onChange={() => toggleGroup(index, group)} className="w-4 h-4 rounded border-2 border-black" />
                        <span className="text-sm font-bold text-black">
                          {group}
                        </span>
                      </label>)}
                  </div>
                </div>
                <div>
                  <label className="block text-black font-bold mb-2 text-sm">
                    Notes
                  </label>
                  <textarea value={unit.notes} onChange={e => updateUnit(index, 'notes', e.target.value)} placeholder="Additional requirements or notes" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm h-20 resize-none" />
                </div>
              </div>)}
          </div>
        </div>
        <motion.button whileHover={{
        scale: 1.02,
        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
      }} whileTap={{
        scale: 0.98
      }} type="submit" className="w-full bg-yellow-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          Add University
        </motion.button>
      </form>
    </div>;
}
function EditModal({
  university,
  onClose,
  onSave
}: {
  university: University;
  onClose: () => void;
  onSave: (university: University) => void;
}) {
  const [formData, setFormData] = useState({
    name: university.name,
    type: university.type,
    website: university.website,
    admission_page: university.admission_page,
    lastUpdated: university.lastUpdated,
    editable: university.editable,
    isActive: university.isActive,
    allowedSSCYears: university.allowedYears?.ssc?.join(', ') || '',
    allowedHSCYears: university.allowedYears?.hsc?.join(', ') || ''
  });
  const [units, setUnits] = useState<UniversityUnit[]>(university.units);
  const groups = ['Science', 'Business Studies', 'Humanities'];
  const addUnit = () => {
    setUnits([...units, {
      unitId: '',
      unitName: '',
      minTotalGPA: 0,
      minSSC_GPA: undefined,
      minHSC_GPA: undefined,
      groupAllowed: [],
      notes: '',
      lastVerified: new Date().toISOString().split('T')[0],
      examDate: '',
      lastApplyDate: ''
    }]);
  };
  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };
  const updateUnit = (index: number, field: keyof UniversityUnit, value: any) => {
    const updated = [...units];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setUnits(updated);
  };
  const toggleGroup = (index: number, group: string) => {
    const updated = [...units];
    const currentGroups = updated[index].groupAllowed;
    updated[index].groupAllowed = currentGroups.includes(group) ? currentGroups.filter(g => g !== group) : [...currentGroups, group];
    setUnits(updated);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedYears = formData.allowedSSCYears && formData.allowedHSCYears ? {
      ssc: formData.allowedSSCYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y)),
      hsc: formData.allowedHSCYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y))
    } : undefined;
    onSave({
      name: formData.name,
      type: formData.type,
      website: formData.website,
      admission_page: formData.admission_page,
      lastUpdated: formData.lastUpdated,
      editable: formData.editable,
      isActive: formData.isActive,
      allowedYears,
      units,
      id: university.id,
      createdAt: university.createdAt
    });
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Edit University
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-400 hover:bg-gray-500 rounded-lg border-2 border-black">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-black font-black mb-2">
              University Name
            </label>
            <input type="text" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
          </div>
          <div>
            <label className="block text-black font-black mb-2">
              University Type
            </label>
            <select value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value as 'public' | 'private'
          })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-black font-black mb-2">
              Official Website
            </label>
            <input type="url" value={formData.website} onChange={e => setFormData({
            ...formData,
            website: e.target.value
          })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
          </div>
          <div>
            <label className="block text-black font-black mb-2">
              Admission Page URL
            </label>
            <input type="url" value={formData.admission_page} onChange={e => setFormData({
            ...formData,
            admission_page: e.target.value
          })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
          </div>
          <div className="border-t-4 border-black pt-6">
            <h3 className="text-xl font-black text-black mb-4">
              Allowed Years (University Level)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-bold mb-2 text-sm">
                  Allowed SSC Years (comma separated)
                </label>
                <input type="text" value={formData.allowedSSCYears} onChange={e => setFormData({
                ...formData,
                allowedSSCYears: e.target.value
              })} placeholder="e.g., 2022, 2023, 2024" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                <p className="text-xs text-gray-600 mt-1">
                  Leave empty to allow all years
                </p>
              </div>
              <div>
                <label className="block text-black font-bold mb-2 text-sm">
                  Allowed HSC Years (comma separated)
                </label>
                <input type="text" value={formData.allowedHSCYears} onChange={e => setFormData({
                ...formData,
                allowedHSCYears: e.target.value
              })} placeholder="e.g., 2024, 2025" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                <p className="text-xs text-gray-600 mt-1">
                  Leave empty to allow all years
                </p>
              </div>
            </div>
          </div>
          <div className="border-t-4 border-black pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-black">
                Units / Programs
              </h3>
              <button type="button" onClick={addUnit} className="flex items-center gap-2 px-4 py-2 bg-green-400 rounded-lg border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <PlusIcon className="w-4 h-4" />
                Add Unit
              </button>
            </div>
            <div className="space-y-4">
              {units.map((unit, index) => <div key={index} className="bg-yellow-50 border-3 border-black rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-black">Unit {index + 1}</h4>
                    {units.length > 1 && <button type="button" onClick={() => removeUnit(index)} className="p-2 bg-red-400 rounded-lg border-2 border-black">
                        <XIcon className="w-4 h-4" />
                      </button>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        Unit ID
                      </label>
                      <input type="text" value={unit.unitId} onChange={e => updateUnit(index, 'unitId', e.target.value)} placeholder="e.g., A, B, C, ENG" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        Unit Name
                      </label>
                      <input type="text" value={unit.unitName} onChange={e => updateUnit(index, 'unitName', e.target.value)} placeholder="e.g., Unit A (Science)" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                    </div>
                  </div>
                  <div className="border-t-2 border-black pt-4">
                    <h5 className="text-sm font-black text-black mb-3">
                      Unit-Specific Allowed Years (Optional)
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black font-bold mb-2 text-xs">
                          Unit SSC Years (comma separated)
                        </label>
                        <input type="text" value={unit.allowedYears?.ssc?.join(', ') || ''} onChange={e => {
                      const years = e.target.value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                      updateUnit(index, 'allowedYears', years.length > 0 ? {
                        ssc: years,
                        hsc: unit.allowedYears?.hsc || []
                      } : undefined);
                    }} placeholder="Leave empty to use university years" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-xs" />
                      </div>
                      <div>
                        <label className="block text-black font-bold mb-2 text-xs">
                          Unit HSC Years (comma separated)
                        </label>
                        <input type="text" value={unit.allowedYears?.hsc?.join(', ') || ''} onChange={e => {
                      const years = e.target.value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                      updateUnit(index, 'allowedYears', years.length > 0 ? {
                        ssc: unit.allowedYears?.ssc || [],
                        hsc: years
                      } : undefined);
                    }} placeholder="Leave empty to use university years" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-xs" />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        📅 Exam Date
                      </label>
                      <input type="datetime-local" value={unit.examDate ? unit.examDate.slice(0, 16) : ''} onChange={e => updateUnit(index, 'examDate', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        ⏰ Last Date for Application
                      </label>
                      <input type="datetime-local" value={unit.lastApplyDate ? unit.lastApplyDate.slice(0, 16) : ''} onChange={e => updateUnit(index, 'lastApplyDate', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                      {unit.lastApplyDate && unit.examDate && new Date(unit.lastApplyDate) >= new Date(unit.examDate) && <p className="text-xs text-red-600 font-bold mt-1">
                            ⚠️ Application deadline must be before exam date
                          </p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        Min Total GPA
                      </label>
                      <input type="number" step="0.1" value={unit.minTotalGPA} onChange={e => updateUnit(index, 'minTotalGPA', parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" required />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        Min SSC GPA
                      </label>
                      <input type="number" step="0.1" value={unit.minSSC_GPA || ''} onChange={e => updateUnit(index, 'minSSC_GPA', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Optional" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2 text-sm">
                        Min HSC GPA
                      </label>
                      <input type="number" step="0.1" value={unit.minHSC_GPA || ''} onChange={e => updateUnit(index, 'minHSC_GPA', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Optional" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Allowed Groups
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {groups.map(group => <label key={group} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={unit.groupAllowed.includes(group)} onChange={() => toggleGroup(index, group)} className="w-4 h-4 rounded border-2 border-black" />
                          <span className="text-sm font-bold text-black">
                            {group}
                          </span>
                        </label>)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-black font-bold mb-2 text-sm">
                      Notes
                    </label>
                    <textarea value={unit.notes} onChange={e => updateUnit(index, 'notes', e.target.value)} placeholder="Additional requirements or notes" className="w-full px-3 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm h-20 resize-none" />
                  </div>
                </div>)}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <motion.button whileHover={{
            scale: 1.02,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
          }} whileTap={{
            scale: 0.98
          }} type="submit" className="flex-1 bg-yellow-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              Save Changes
            </motion.button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>;
}
function DeleteConfirmModal({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full mx-4">
        <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">
          Confirm Deletion
        </h2>
        <p className="text-black font-bold mb-6">
          Are you sure you want to delete this university? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <motion.button whileHover={{
          scale: 1.02,
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
        }} whileTap={{
          scale: 0.98
        }} onClick={onConfirm} className="flex-1 bg-red-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Delete
          </motion.button>
          <button onClick={onCancel} className="flex-1 bg-gray-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>;
}