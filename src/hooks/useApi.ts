import { useState, useEffect } from 'react';
import { Division, SchoolRoom, Student, Session } from '../types';
import { mockDivisions, mockSchoolRooms, mockStudents, mockSessions } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  divisions: 'mosque_divisions',
  schoolRooms: 'mosque_school_rooms',
  students: 'mosque_students',
  sessions: 'mosque_sessions'
};

// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.divisions)) {
    saveToStorage(STORAGE_KEYS.divisions, mockDivisions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.schoolRooms)) {
    saveToStorage(STORAGE_KEYS.schoolRooms, mockSchoolRooms);
  }
  if (!localStorage.getItem(STORAGE_KEYS.students)) {
    saveToStorage(STORAGE_KEYS.students, mockStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.sessions)) {
    saveToStorage(STORAGE_KEYS.sessions, mockSessions);
  }
};

// Generic hook for mock API data
function useApiData<T>(
  storageKey: string,
  defaultData: T[],
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await delay(300); // Simulate network delay
      const storedData = getFromStorage(storageKey, defaultData);
      setData(storedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeStorage();
    fetchData();
  }, dependencies);

  const updateData = (newData: T[]) => {
    setData(newData);
    saveToStorage(storageKey, newData);
  };

  return { data, loading, error, refetch: fetchData, setData: updateData };
}

// Divisions hook
export const useDivisions = () => {
  const { data, loading, error, refetch, setData } = useApiData<Division>(
    STORAGE_KEYS.divisions,
    mockDivisions
  );
  
  const addDivision = async (divisionData: Omit<Division, 'id'>) => {
    try {
      await delay(200);
      const newDivision: Division = {
        ...divisionData,
        id: Date.now().toString()
      };
      const updatedData = [newDivision, ...data];
      setData(updatedData);
      return newDivision;
    } catch (error) {
      console.error('Error adding division:', error);
      throw error;
    }
  };

  const updateDivision = async (id: string, divisionData: Partial<Division>) => {
    try {
      await delay(200);
      const updatedData = data.map(d => d.id === id ? { ...d, ...divisionData } : d);
      setData(updatedData);
      return updatedData.find(d => d.id === id);
    } catch (error) {
      console.error('Error updating division:', error);
      throw error;
    }
  };

  return { 
    divisions: data, 
    loading, 
    error, 
    refetch, 
    addDivision, 
    updateDivision 
  };
};

// School Rooms hook
export const useSchoolRooms = () => {
  const { data, loading, error, refetch, setData } = useApiData<SchoolRoom>(
    STORAGE_KEYS.schoolRooms,
    mockSchoolRooms
  );
  
  const addSchoolRoom = async (roomData: Omit<SchoolRoom, 'id'>) => {
    try {
      await delay(200);
      const newRoom: SchoolRoom = {
        ...roomData,
        id: Date.now().toString(),
        teacher: {
          ...roomData.teacher,
          id: roomData.teacher.id || Date.now().toString()
        }
      };
      const updatedData = [newRoom, ...data];
      setData(updatedData);
      return newRoom;
    } catch (error) {
      console.error('Error adding school room:', error);
      throw error;
    }
  };

  const updateSchoolRoom = async (id: string, roomData: Partial<SchoolRoom>) => {
    try {
      await delay(200);
      const updatedData = data.map(r => r.id === id ? { ...r, ...roomData } : r);
      setData(updatedData);
      return updatedData.find(r => r.id === id);
    } catch (error) {
      console.error('Error updating school room:', error);
      throw error;
    }
  };

  return { 
    schoolRooms: data, 
    loading, 
    error, 
    refetch, 
    addSchoolRoom, 
    updateSchoolRoom 
  };
};

// Students hook
export const useStudents = () => {
  const { data, loading, error, refetch, setData } = useApiData<Student>(
    STORAGE_KEYS.students,
    mockStudents
  );
  
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      await delay(200);
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString()
      };
      const updatedData = [newStudent, ...data];
      setData(updatedData);
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      await delay(200);
      const updatedData = data.map(s => s.id === id ? { ...s, ...studentData } : s);
      setData(updatedData);
      return updatedData.find(s => s.id === id);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  return { 
    students: data, 
    loading, 
    error, 
    refetch, 
    addStudent, 
    updateStudent 
  };
};

// Sessions hook
export const useSessions = () => {
  const { data, loading, error, refetch, setData } = useApiData<Session>(
    STORAGE_KEYS.sessions,
    mockSessions
  );
  
  const addSession = async (sessionData: Omit<Session, 'id'>) => {
    try {
      await delay(200);
      const newSession: Session = {
        ...sessionData,
        id: Date.now().toString()
      };
      const updatedData = [newSession, ...data];
      setData(updatedData);
      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const updateSession = async (id: string, sessionData: Partial<Session>) => {
    try {
      await delay(200);
      const updatedData = data.map(s => s.id === id ? { ...s, ...sessionData } : s);
      setData(updatedData);
      return updatedData.find(s => s.id === id);
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  return { 
    sessions: data, 
    loading, 
    error, 
    refetch, 
    addSession, 
    updateSession,
    setSessions: setData
  };
};