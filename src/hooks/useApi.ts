import { useState, useEffect } from 'react';
import { divisionsApi, schoolRoomsApi, studentsApi, sessionsApi } from '../services/api';

// Generic hook for API data
function useApiData<T>(apiFunction: () => Promise<T[]>, dependencies: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData, setData };
}

// Specific hooks for each entity
export const useDivisions = () => {
  const { data, loading, error, refetch, setData } = useApiData(divisionsApi.getAll);
  
  const addDivision = async (divisionData: any) => {
    try {
      const newDivision = await divisionsApi.create(divisionData);
      setData(prev => [newDivision, ...prev]);
      return newDivision;
    } catch (error) {
      console.error('Error adding division:', error);
      throw error;
    }
  };

  const updateDivision = async (id: string, divisionData: any) => {
    try {
      const updatedDivision = await divisionsApi.update(id, divisionData);
      setData(prev => prev.map(d => d.id === id ? updatedDivision : d));
      return updatedDivision;
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

export const useSchoolRooms = () => {
  const { data, loading, error, refetch, setData } = useApiData(schoolRoomsApi.getAll);
  
  const addSchoolRoom = async (roomData: any) => {
    try {
      const newRoom = await schoolRoomsApi.create(roomData);
      setData(prev => [newRoom, ...prev]);
      return newRoom;
    } catch (error) {
      console.error('Error adding school room:', error);
      throw error;
    }
  };

  const updateSchoolRoom = async (id: string, roomData: any) => {
    try {
      const updatedRoom = await schoolRoomsApi.update(id, roomData);
      setData(prev => prev.map(r => r.id === id ? updatedRoom : r));
      return updatedRoom;
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

export const useStudents = () => {
  const { data, loading, error, refetch, setData } = useApiData(studentsApi.getAll);
  
  const addStudent = async (studentData: any) => {
    try {
      const newStudent = await studentsApi.create(studentData);
      setData(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: any) => {
    try {
      const updatedStudent = await studentsApi.update(id, studentData);
      setData(prev => prev.map(s => s.id === id ? updatedStudent : s));
      return updatedStudent;
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

export const useSessions = () => {
  const { data, loading, error, refetch, setData } = useApiData(sessionsApi.getAll);
  
  const addSession = async (sessionData: any) => {
    try {
      const newSession = await sessionsApi.create(sessionData);
      setData(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const updateSession = async (id: string, sessionData: any) => {
    try {
      const updatedSession = await sessionsApi.update(id, sessionData);
      setData(prev => prev.map(s => s.id === id ? updatedSession : s));
      return updatedSession;
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