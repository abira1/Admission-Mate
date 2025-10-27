import { ref, set, get, remove, update } from 'firebase/database';
import { db } from './firebase';
import { University } from '../types/University';

// Get all universities
export const getUniversities = async (): Promise<University[]> => {
  try {
    const universitiesRef = ref(db, 'universities');
    const snapshot = await get(universitiesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
};

// Add a new university
export const addUniversity = async (university: University): Promise<void> => {
  try {
    const universityRef = ref(db, `universities/${university.id}`);
    await set(universityRef, university);
  } catch (error) {
    console.error('Error adding university:', error);
    throw error;
  }
};

// Update a university
export const updateUniversity = async (university: University): Promise<void> => {
  try {
    const universityRef = ref(db, `universities/${university.id}`);
    await update(universityRef, university);
  } catch (error) {
    console.error('Error updating university:', error);
    throw error;
  }
};

// Delete a university
export const deleteUniversity = async (id: string): Promise<void> => {
  try {
    const universityRef = ref(db, `universities/${id}`);
    await remove(universityRef);
  } catch (error) {
    console.error('Error deleting university:', error);
    throw error;
  }
};

// Initialize database with default universities
export const initializeUniversities = async (universities: University[]): Promise<void> => {
  try {
    const universitiesRef = ref(db, 'universities');
    const snapshot = await get(universitiesRef);
    
    // Only initialize if database is empty
    if (!snapshot.exists()) {
      const universitiesData: Record<string, University> = {};
      universities.forEach(uni => {
        universitiesData[uni.id] = uni;
      });
      await set(universitiesRef, universitiesData);
    }
  } catch (error) {
    console.error('Error initializing universities:', error);
    throw error;
  }
};
