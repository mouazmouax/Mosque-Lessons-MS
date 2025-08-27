import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { Division, SchoolRoom, Student, Session } from '../types';

interface DashboardProps {
  divisions: Division[];
  schoolRooms: SchoolRoom[];
  students: Student[];
  sessions: Session[];
}

const Dashboard: React.FC<DashboardProps> = ({ divisions, schoolRooms, students, sessions }) => {
  const activeDivisions = divisions.filter(d => !d.archived);
  const totalDivisions = activeDivisions.length;
  const totalSchoolRooms = schoolRooms.length;
  const totalStudents = students.length;
  const totalSessions = sessions.length;
  const averageAttendance = sessions.length > 0 
    ? sessions.reduce((acc, session) => {
        const attendanceCount = Object.values(session.attendance).filter(Boolean).length;
        const totalStudentsInSession = Object.keys(session.attendance).length;
        return acc + (totalStudentsInSession > 0 ? attendanceCount / totalStudentsInSession : 0);
      }, 0) / sessions.length * 100
    : 0;

  const recentSessions = sessions.slice(-3).reverse();
  const topPerformingSchoolRooms = schoolRooms.slice(0, 3);

  const statCards = [
    {
      title: 'إجمالي الدورات',
      value: totalDivisions,
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'الحلقات',
      value: totalSchoolRooms,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'إجمالي الطلاب',
      value: totalStudents,
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'متوسط الحضور',
      value: `${averageAttendance.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الرئيسية</h1>
        <p className="text-gray-600">مرحباً بك في نظام إدارة دروس المسجد</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الجلسات الأخيرة</h2>
          {recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد جلسات مسجلة بعد</p>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => {
                const sessionSchoolRoom = schoolRooms.find(sr => sr.id === session.schoolRoomId);
                const sessionDivision = divisions.find(d => d.id === session.divisionId);
                const attendanceCount = Object.values(session.attendance).filter(Boolean).length;
                const totalStudents = Object.keys(session.attendance).length;
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sessionDivision?.name} - {sessionSchoolRoom?.name}</p>
                      <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-emerald-600">{attendanceCount}/{totalStudents}</p>
                      <p className="text-xs text-gray-500">الحضور</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Rooms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الحلقات النشطة</h2>
          {schoolRooms.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد حلقات منشأة بعد</p>
          ) : (
            <div className="space-y-4">
              {topPerformingSchoolRooms.map((schoolRoom) => {
                const division = divisions.find(d => d.id === schoolRoom.divisionId);
                return (
                <div key={schoolRoom.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{schoolRoom.name}</p>
                    <p className="text-sm text-gray-600">{division?.name} - {schoolRoom.teacher.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">{schoolRoom.currentStudents}/{schoolRoom.maxStudents}</p>
                    <p className="text-xs text-gray-500">الطلاب</p>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;