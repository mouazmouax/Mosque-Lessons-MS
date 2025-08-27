import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Award, Filter } from 'lucide-react';
import { Division, SchoolRoom, Student, Session } from '../types';

interface AnalyticsProps {
  divisions: Division[];
  schoolRooms: SchoolRoom[];
  students: Student[];
  sessions: Session[];
}

const Analytics: React.FC<AnalyticsProps> = ({ divisions, schoolRooms, students, sessions }) => {
  const [filters, setFilters] = useState({
    divisionIds: [] as string[],
    schoolRoomIds: [] as string[],
    dateFrom: '',
    dateTo: '',
    dateAfter: '',
    dateBefore: ''
  });

  const [activeLevel, setActiveLevel] = useState<'attendance' | 'quran' | 'books'>('attendance');

  // Filter sessions based on selected filters
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const sessionDivision = divisions.find(d => d.id === session.divisionId);
      if (!sessionDivision || sessionDivision.archived) return false;

      // Division filter
      if (filters.divisionIds.length > 0 && !filters.divisionIds.includes(session.divisionId)) return false;

      // Room filter
      if (filters.schoolRoomIds.length > 0 && !filters.schoolRoomIds.includes(session.schoolRoomId)) return false;

      // Date filters
      const sessionDate = new Date(session.date);
      if (filters.dateFrom && sessionDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && sessionDate > new Date(filters.dateTo)) return false;
      if (filters.dateAfter && sessionDate <= new Date(filters.dateAfter)) return false;
      if (filters.dateBefore && sessionDate >= new Date(filters.dateBefore)) return false;

      return true;
    });
  }, [sessions, divisions, filters]);

  // Get active divisions and rooms
  const activeDivisions = divisions.filter(d => !d.archived);
  const activeSchoolRooms = schoolRooms.filter(sr => {
    const division = divisions.find(d => d.id === sr.divisionId);
    return division && !division.archived;
  });

  // Filter rooms based on selected divisions
  const availableRooms = filters.divisionIds.length > 0
    ? activeSchoolRooms.filter(sr => filters.divisionIds.includes(sr.divisionId))
    : activeSchoolRooms;

  // Calculate analytics for each level
  const analytics = useMemo(() => {
    const roomStats = new Map();
    const studentStats = new Map();
    const divisionStats = new Map();

    // Initialize stats for all active rooms, students, and divisions
    activeSchoolRooms.forEach(room => {
      roomStats.set(room.id, {
        room,
        attendance: { total: 0, present: 0, rate: 0 },
        quran: { total: 0, pages: 0, average: 0 },
        books: { total: 0, pages: 0, average: 0 },
        sessionsCount: 0
      });
    });

    students.filter(s => !s.archived).forEach(student => {
      studentStats.set(student.id, {
        student,
        attendance: { total: 0, present: 0, rate: 0 },
        quran: { total: 0, pages: 0, average: 0 },
        books: { total: 0, pages: 0, average: 0 },
        sessionsCount: 0
      });
    });

    activeDivisions.forEach(division => {
      divisionStats.set(division.id, {
        division,
        attendance: { total: 0, present: 0, rate: 0 },
        quran: { total: 0, pages: 0, average: 0 },
        books: { total: 0, pages: 0, average: 0 },
        sessionsCount: 0
      });
    });

    // Process filtered sessions
    filteredSessions.forEach(session => {
      const roomStat = roomStats.get(session.schoolRoomId);
      const divisionStat = divisionStats.get(session.divisionId);
      
      if (roomStat) {
        roomStat.sessionsCount++;
      }
      if (divisionStat) {
        divisionStat.sessionsCount++;
      }

      // Process attendance
      Object.entries(session.attendance || {}).forEach(([studentId, present]) => {
        const studentStat = studentStats.get(studentId);
        const roomStat = roomStats.get(session.schoolRoomId);
        const divisionStat = divisionStats.get(session.divisionId);

        if (studentStat) {
          studentStat.attendance.total++;
          if (present) studentStat.attendance.present++;
          studentStat.sessionsCount++;
        }

        if (roomStat) {
          roomStat.attendance.total++;
          if (present) roomStat.attendance.present++;
        }

        if (divisionStat) {
          divisionStat.attendance.total++;
          if (present) divisionStat.attendance.present++;
        }
      });

      // Process Quran recitation
      Object.entries(session.quranRecitation || {}).forEach(([studentId, recitation]) => {
        const studentStat = studentStats.get(studentId);
        const roomStat = roomStats.get(session.schoolRoomId);
        const divisionStat = divisionStats.get(session.divisionId);

        if (studentStat && recitation.pagesCount > 0) {
          studentStat.quran.total++;
          studentStat.quran.pages += recitation.pagesCount;
        }

        if (roomStat && recitation.pagesCount > 0) {
          roomStat.quran.total++;
          roomStat.quran.pages += recitation.pagesCount;
        }

        if (divisionStat && recitation.pagesCount > 0) {
          divisionStat.quran.total++;
          divisionStat.quran.pages += recitation.pagesCount;
        }
      });

      // Process book reading
      Object.entries(session.bookReading || {}).forEach(([studentId, reading]) => {
        const studentStat = studentStats.get(studentId);
        const roomStat = roomStats.get(session.schoolRoomId);
        const divisionStat = divisionStats.get(session.divisionId);

        if (studentStat && reading.pagesCount > 0) {
          studentStat.books.total++;
          studentStat.books.pages += reading.pagesCount;
        }

        if (roomStat && reading.pagesCount > 0) {
          roomStat.books.total++;
          roomStat.books.pages += reading.pagesCount;
        }

        if (divisionStat && reading.pagesCount > 0) {
          divisionStat.books.total++;
          divisionStat.books.pages += reading.pagesCount;
        }
      });
    });

    // Calculate rates and averages
    roomStats.forEach(stat => {
      stat.attendance.rate = stat.attendance.total > 0 ? (stat.attendance.present / stat.attendance.total) * 100 : 0;
      stat.quran.average = stat.quran.total > 0 ? stat.quran.pages / stat.quran.total : 0;
      stat.books.average = stat.books.total > 0 ? stat.books.pages / stat.books.total : 0;
    });

    studentStats.forEach(stat => {
      stat.attendance.rate = stat.attendance.total > 0 ? (stat.attendance.present / stat.attendance.total) * 100 : 0;
      stat.quran.average = stat.quran.total > 0 ? stat.quran.pages / stat.quran.total : 0;
      stat.books.average = stat.books.total > 0 ? stat.books.pages / stat.books.total : 0;
    });

    divisionStats.forEach(stat => {
      stat.attendance.rate = stat.attendance.total > 0 ? (stat.attendance.present / stat.attendance.total) * 100 : 0;
      stat.quran.average = stat.quran.total > 0 ? stat.quran.pages / stat.quran.total : 0;
      stat.books.average = stat.books.total > 0 ? stat.books.pages / stat.books.total : 0;
    });

    return { 
      roomStats: Array.from(roomStats.values()), 
      studentStats: Array.from(studentStats.values()),
      divisionStats: Array.from(divisionStats.values())
    };
  }, [filteredSessions, activeSchoolRooms, students, activeDivisions]);

  // Sort rooms and students based on active level
  const sortedRooms = useMemo(() => {
    return [...analytics.roomStats].sort((a, b) => {
      switch (activeLevel) {
        case 'attendance':
          return b.attendance.rate - a.attendance.rate;
        case 'quran':
          return b.quran.pages - a.quran.pages;
        case 'books':
          return b.books.pages - a.books.pages;
        default:
          return 0;
      }
    }).filter(stat => stat.sessionsCount > 0);
  }, [analytics.roomStats, activeLevel]);

  const sortedStudents = useMemo(() => {
    return [...analytics.studentStats].sort((a, b) => {
      switch (activeLevel) {
        case 'attendance':
          return b.attendance.rate - a.attendance.rate;
        case 'quran':
          return b.quran.pages - a.quran.pages;
        case 'books':
          return b.books.pages - a.books.pages;
        default:
          return 0;
      }
    }).filter(stat => stat.sessionsCount > 0);
  }, [analytics.studentStats, activeLevel]);

  const sortedDivisions = useMemo(() => {
    return [...analytics.divisionStats].sort((a, b) => {
      switch (activeLevel) {
        case 'attendance':
          return b.attendance.rate - a.attendance.rate;
        case 'quran':
          return b.quran.pages - a.quran.pages;
        case 'books':
          return b.books.pages - a.books.pages;
        default:
          return 0;
      }
    }).filter(stat => stat.sessionsCount > 0);
  }, [analytics.divisionStats, activeLevel]);

  // Get room students progress
  const getRoomStudentsProgress = (roomId: string) => {
    const roomStudents = students.filter(s => s.schoolRoomId === roomId && !s.archived);
    return roomStudents.map(student => {
      const stat = analytics.studentStats.find(s => s.student.id === student.id);
      return stat || {
        student,
        attendance: { total: 0, present: 0, rate: 0 },
        quran: { total: 0, pages: 0, average: 0 },
        books: { total: 0, pages: 0, average: 0 },
        sessionsCount: 0
      };
    });
  };

  const getLevelValue = (stat: any) => {
    switch (activeLevel) {
      case 'attendance':
        return `${stat.attendance.rate.toFixed(1)}%`;
      case 'quran':
        return `${stat.quran.pages} صفحة`;
      case 'books':
        return `${stat.books.pages} صفحة`;
      default:
        return '0';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'attendance':
        return 'emerald';
      case 'quran':
        return 'blue';
      case 'books':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleDivisionChange = (divisionId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        divisionIds: [...prev.divisionIds, divisionId],
        schoolRoomIds: [] // Clear room selection when division changes
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        divisionIds: prev.divisionIds.filter(id => id !== divisionId),
        schoolRoomIds: prev.schoolRoomIds.filter(roomId => {
          const room = schoolRooms.find(r => r.id === roomId);
          return room && room.divisionId !== divisionId;
        })
      }));
    }
  };

  const handleRoomChange = (roomId: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        schoolRoomIds: [...prev.schoolRoomIds, roomId]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        schoolRoomIds: prev.schoolRoomIds.filter(id => id !== roomId)
      }));
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">التحليلات</h1>
        <p className="text-gray-600">تحليل شامل للأداء والتقدم</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 ml-2 text-gray-600" />
          الفلاتر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الدورات</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {activeDivisions.map(division => (
                <label key={division.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.divisionIds.includes(division.id)}
                    onChange={(e) => handleDivisionChange(division.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{division.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحلقات</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {availableRooms.map(room => (
                <label key={room.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.schoolRoomIds.includes(room.id)}
                    onChange={(e) => handleRoomChange(room.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{room.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">بعد تاريخ</label>
            <input
              type="date"
              value={filters.dateAfter}
              onChange={(e) => setFilters({ ...filters, dateAfter: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">قبل تاريخ</label>
            <input
              type="date"
              value={filters.dateBefore}
              onChange={(e) => setFilters({ ...filters, dateBefore: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({
              divisionIds: [],
              schoolRoomIds: [],
              dateFrom: '',
              dateTo: '',
              dateAfter: '',
              dateBefore: ''
            })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>

      {/* Level Selection */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex space-x-2">
          {[
            { key: 'attendance', label: 'الحضور', icon: Users },
            { key: 'quran', label: 'كمية التسميع', icon: BookOpen },
            { key: 'books', label: 'كمية القراءة', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveLevel(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeLevel === key
                  ? `bg-${getLevelColor(key)}-100 text-${getLevelColor(key)}-700 shadow-sm`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Division Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 ml-2 text-blue-600" />
          مقارنة الدورات - {activeLevel === 'attendance' ? 'الحضور' : activeLevel === 'quran' ? 'كمية التسميع' : 'كمية القراءة'}
        </h2>
        {sortedDivisions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
        ) : (
          <div className="space-y-4">
            {sortedDivisions.map((stat, index) => {
              const maxValue = Math.max(...sortedDivisions.map(s => 
                activeLevel === 'attendance' ? s.attendance.rate : 
                activeLevel === 'quran' ? s.quran.pages : s.books.pages
              ));
              const currentValue = activeLevel === 'attendance' ? stat.attendance.rate : 
                                 activeLevel === 'quran' ? stat.quran.pages : stat.books.pages;
              const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
              
              return (
                <div key={stat.division.id} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-gray-900 text-right">
                    {stat.division.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`bg-${getLevelColor(activeLevel)}-500 h-6 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {getLevelValue(stat)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-16 text-left">
                    {stat.sessionsCount} جلسة
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Rooms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 ml-2 text-yellow-600" />
            أفضل الحلقات - {activeLevel === 'attendance' ? 'الحضور' : activeLevel === 'quran' ? 'كمية التسميع' : 'كمية القراءة'}
          </h2>
          {sortedRooms.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {sortedRooms.slice(0, 10).map((stat, index) => {
                const division = divisions.find(d => d.id === stat.room.divisionId);
                return (
                  <div key={stat.room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stat.room.name}</div>
                        <div className="text-xs text-gray-600">{division?.name} - {stat.room.teacher.name}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`font-bold text-${getLevelColor(activeLevel)}-600`}>
                        {getLevelValue(stat)}
                      </div>
                      <div className="text-xs text-gray-500">{stat.sessionsCount} جلسة</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Best Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 ml-2 text-purple-600" />
            أفضل الطلاب - {activeLevel === 'attendance' ? 'الحضور' : activeLevel === 'quran' ? 'كمية التسميع' : 'كمية القراءة'}
          </h2>
          {sortedStudents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {sortedStudents.slice(0, 10).map((stat, index) => {
                const schoolRoom = schoolRooms.find(sr => sr.id === stat.student.schoolRoomId);
                const division = divisions.find(d => d.id === schoolRoom?.divisionId);
                return (
                  <div key={stat.student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stat.student.name}</div>
                        <div className="text-xs text-gray-600">{division?.name} - {schoolRoom?.name}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`font-bold text-${getLevelColor(activeLevel)}-600`}>
                        {getLevelValue(stat)}
                      </div>
                      <div className="text-xs text-gray-500">{stat.sessionsCount} جلسة</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Room Students Progress Tables */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">تقدم طلاب كل حلقة</h2>
        {activeSchoolRooms.map(room => {
          const roomStudentsProgress = getRoomStudentsProgress(room.id);
          const division = divisions.find(d => d.id === room.divisionId);
          
          if (roomStudentsProgress.length === 0) return null;

          return (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {room.name} - {division?.name} - {room.teacher.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحضور</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">صفحات التسميع</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">صفحات القراءة</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الجلسات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roomStudentsProgress.map(stat => (
                      <tr key={stat.student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {stat.student.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stat.attendance.rate >= 80 ? 'bg-green-100 text-green-800' :
                            stat.attendance.rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stat.attendance.rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {stat.quran.pages} صفحة
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {stat.books.pages} صفحة
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {stat.sessionsCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;