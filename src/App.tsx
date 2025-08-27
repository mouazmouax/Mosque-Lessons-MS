import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Divisions from './components/Divisions';
import SchoolRooms from './components/SchoolRooms';
import Students from './components/Students';
import Sessions from './components/Sessions';
import Analytics from './components/Analytics';
import { useDivisions, useSchoolRooms, useStudents, useSessions } from './hooks/useApi';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use API hooks
  const { divisions, addDivision, updateDivision } = useDivisions();
  const { schoolRooms, addSchoolRoom, updateSchoolRoom } = useSchoolRooms();
  const { students, addStudent, updateStudent } = useStudents();
  const { sessions, addSession, updateSession, setSessions } = useSessions();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard divisions={divisions} schoolRooms={schoolRooms} students={students} sessions={sessions} />;
      case 'divisions':
        return (
          <Divisions 
            divisions={divisions} 
            onAddDivision={addDivision} 
            onUpdateDivision={updateDivision}
          />
        );
      case 'schoolrooms':
        return (
          <SchoolRooms 
            schoolRooms={schoolRooms}
            divisions={divisions}
            onAddSchoolRoom={addSchoolRoom} 
            onUpdateSchoolRoom={updateSchoolRoom}
          />
        );
      case 'students':
        return (
          <Students 
            students={students} 
            schoolRooms={schoolRooms}
            divisions={divisions}
            onAddStudent={addStudent} 
            onUpdateStudent={updateStudent}
          />
        );
      case 'sessions':
        return (
          <Sessions 
            sessions={sessions}
            setSessions={setSessions}
            divisions={divisions}
            schoolRooms={schoolRooms}
            students={students}
          />
        );
      case 'analytics':
        return <Analytics divisions={divisions} schoolRooms={schoolRooms} students={students} sessions={sessions} />;
      default:
        return <Dashboard divisions={divisions} schoolRooms={schoolRooms} students={students} sessions={sessions} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;