import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { University } from '../types/University';
interface UniversityFormProps {
  initialData?: University;
  onSubmit: (data: Omit<University, 'id' | 'createdAt'>) => void;
  submitLabel: string;
}
export function UniversityForm({
  initialData,
  onSubmit,
  submitLabel
}: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    minTotalGPA: initialData?.minTotalGPA?.toString() || '',
    minSSCGPA: initialData?.minSSCGPA?.toString() || '',
    minHSCGPA: initialData?.minHSCGPA?.toString() || '',
    acceptedGroups: initialData?.acceptedGroups || [] as string[],
    applicationDeadline: initialData?.applicationDeadline || '',
    admissionLink: initialData?.admissionLink || '',
    shortNote: initialData?.shortNote || ''
  });
  const groups = ['Science', 'Business Studies', 'Humanities'];
  const handleGroupToggle = (group: string) => {
    setFormData(prev => ({
      ...prev,
      acceptedGroups: prev.acceptedGroups.includes(group) ? prev.acceptedGroups.filter(g => g !== group) : [...prev.acceptedGroups, group]
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      minTotalGPA: parseFloat(formData.minTotalGPA),
      minSSCGPA: formData.minSSCGPA ? parseFloat(formData.minSSCGPA) : undefined,
      minHSCGPA: formData.minHSCGPA ? parseFloat(formData.minHSCGPA) : undefined,
      acceptedGroups: formData.acceptedGroups,
      applicationDeadline: formData.applicationDeadline,
      admissionLink: formData.admissionLink,
      shortNote: formData.shortNote
    });
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
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
          Minimum Total GPA
        </label>
        <input type="number" step="0.1" value={formData.minTotalGPA} onChange={e => setFormData({
        ...formData,
        minTotalGPA: e.target.value
      })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-black font-black mb-2">
            Minimum SSC GPA (Optional)
          </label>
          <input type="number" step="0.1" min="0" max="5.0" value={formData.minSSCGPA} onChange={e => setFormData({
          ...formData,
          minSSCGPA: e.target.value
        })} placeholder="e.g., 3.5" className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
        </div>
        <div>
          <label className="block text-black font-black mb-2">
            Minimum HSC GPA (Optional)
          </label>
          <input type="number" step="0.1" min="0" max="5.0" value={formData.minHSCGPA} onChange={e => setFormData({
          ...formData,
          minHSCGPA: e.target.value
        })} placeholder="e.g., 3.5" className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-black font-black mb-2">
          Accepted Groups
        </label>
        <div className="flex flex-wrap gap-4">
          {groups.map(group => <label key={group} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.acceptedGroups.includes(group)} onChange={() => handleGroupToggle(group)} className="w-5 h-5 rounded border-3 border-black text-yellow-400 focus:ring-yellow-400" />
              <span className="text-black font-bold">{group}</span>
            </label>)}
        </div>
      </div>
      <div>
        <label className="block text-black font-black mb-2">
          Application Deadline
        </label>
        <input type="text" value={formData.applicationDeadline} onChange={e => setFormData({
        ...formData,
        applicationDeadline: e.target.value
      })} placeholder="e.g., December 31, 2024" className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
      </div>
      <div>
        <label className="block text-black font-black mb-2">
          Official Admission Link
        </label>
        <input type="url" value={formData.admissionLink} onChange={e => setFormData({
        ...formData,
        admissionLink: e.target.value
      })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
      </div>
      <div>
        <label className="block text-black font-black mb-2">Short Note</label>
        <textarea value={formData.shortNote} onChange={e => setFormData({
        ...formData,
        shortNote: e.target.value
      })} className="w-full px-4 py-3 rounded-xl border-3 border-black focus:outline-none bg-white h-24 resize-none font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
      </div>
      <motion.button whileHover={{
      scale: 1.02,
      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
    }} whileTap={{
      scale: 0.98
    }} type="submit" className="w-full bg-yellow-400 text-black py-4 px-8 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
        <SaveIcon className="w-5 h-5" />
        {submitLabel}
      </motion.button>
    </form>;
}
function AddUniversityForm({
  onSubmit
}: {
  onSubmit: (data: Omit<University, 'id' | 'createdAt'>) => void;
}) {
  return <div className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">
        Add New University
      </h2>
      <UniversityForm onSubmit={onSubmit} submitLabel="Add University" />
    </div>;
}
function EditModal({
  university,
  onClose,
  onSave
}: {
  university: University;
  onClose: () => void;
  onSave: (uni: University) => void;
}) {
  const handleSubmit = (data: Omit<University, 'id' | 'createdAt'>) => {
    onSave({
      ...data,
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
  }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div initial={{
      scale: 0.9,
      y: 20
    }} animate={{
      scale: 1,
      y: 0
    }} exit={{
      scale: 0.9,
      y: 20
    }} className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Edit University
          </h2>
          <button onClick={onClose} className="p-2 bg-red-400 hover:bg-red-500 rounded-lg transition-colors border-2 border-black">
            <XIcon className="w-5 h-5 text-black" />
          </button>
        </div>
        <UniversityForm initialData={university} onSubmit={handleSubmit} submitLabel="Save Changes" />
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
  }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <motion.div initial={{
      scale: 0.9,
      y: 20
    }} animate={{
      scale: 1,
      y: 0
    }} exit={{
      scale: 0.9,
      y: 20
    }} className="bg-white rounded-3xl border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-black text-black mb-4">
          Delete University?
        </h2>
        <p className="text-black font-bold mb-6">
          Are you sure you want to delete this university? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-black py-3 px-6 rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-400 text-black py-3 px-6 rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>;
}