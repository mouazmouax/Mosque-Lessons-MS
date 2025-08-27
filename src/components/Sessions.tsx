import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, X, Save, Eye, EyeOff } from 'lucide-react';
import { Session, Division, SchoolRoom, Student } from '../types';
import Modal from './Modal';

interface SessionsProps {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  divisions: Division[];
  schoolRooms: SchoolRoom[];
  students: Student[];
}

const Sessions: React.FC<SessionsProps> = ({ sessions, setSessions, divisions, schoolRooms, students }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordingSession, setRecordingSession] = useState<Session | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [recordingStep, setRecordingStep] = useState<'attendance' | 'quran' | 'books'>('attendance');

  const [newSession, setNewSession] = useState({
    divisionId: '',
    schoolRoomId: '',
    date: new Date().toISOString().split('T')[0],
    topic: ''
  });

  const [sessionRecord, setSessionRecord] = useState({
    attendance: {} as Record<string, boolean>,
    quranRecitation: {} as Record<string, {
      recitedText: string;
      pagesCount: number;
      evaluation: 'وسط' | 'جيد' | 'جيد جدا' | 'ممتاز';
    }>,
    bookReading: {} as Record<string, {
      bookNames: string;
      pagesCount: number;
      withSummary: boolean;
    }>
  });

  const activeDivisions = divisions.filter(d => !d.archived);
  const availableSchoolRooms = schoolRooms.filter(room => {
    const roomDivision = divisions.find(d => d.id === room.divisionId);
    return roomDivision && !roomDivision.archived;
  });

  const filteredSessions = sessions.filter(session => {
    const sessionDivision = divisions.find(d => d.id === session.divisionId);
    if (showArchived) {
      return sessionDivision?.archived;
    }
    return sessionDivision && !sessionDivision.archived;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session: Session = {
      id: Date.now().toString(),
      divisionId: newSession.divisionId,
      schoolRoomId: newSession.schoolRoomId,
      date: newSession.date,
      attendance: {},
      quranRecitation: {},
      bookReading: {}
    };

    setSessions([...sessions, session]);
    setNewSession({
      divisionId: '',
      schoolRoomId: '',
      date: new Date().toISOString().split('T')[0],
      topic: ''
    });
    setShowModal(false);
  };

  const handleRecordSession = (session: Session) => {
    setRecordingSession(session);
    setRecordingStep('attendance');
    
    // Get students for this session
    const sessionStudents = students.filter(student => {
      const studentRoom = schoolRooms.find(sr => sr.id === student.schoolRoomId);
      return studentRoom && studentRoom.divisionId === session.divisionId && !student.archived;
    });
    
    // Initialize session record with existing data or defaults
    const attendance = session.attendance || {};
    const quranRecitation = session.quranRecitation || {};
    const bookReading = session.bookReading || {};
    
    // Ensure all current students have entries
    sessionStudents.forEach(student => {
      if (!(student.id in attendance)) {
        attendance[student.id] = false;
      }
      if (!(student.id in quranRecitation)) {
        quranRecitation[student.id] = {
          recitedText: '',
          pagesCount: 0,
          evaluation: 'وسط'
        };
      }
      if (!(student.id in bookReading)) {
        bookReading[student.id] = {
          bookNames: '',
          pagesCount: 0,
          withSummary: false
        };
      }
    });
    
    setSessionRecord({
      attendance,
      quranRecitation,
      bookReading
    });
    
    setShowRecordModal(true);
  };

  const handleSaveRecord = () => {
    if (!recordingSession) return;
    
    const updatedSessions = sessions.map(session => 
      session.id === recordingSession.id 
        ? {
            ...session,
            attendance: sessionRecord.attendance,
            quranRecitation: sessionRecord.quranRecitation,
            bookReading: sessionRecord.bookReading
          }
        : session
    );
    
    setSessions(updatedSessions);
    setShowRecordModal(false);
    setRecordingSession(null);
    setRecordingStep('attendance');
  };

  const updateAttendance = (studentId: string, present: boolean) => {
    setSessionRecord(prev => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [studentId]: present
      }
    }));
  };

  const updateQuranRecitation = (studentId: string, field: string, value: any) => {
    setSessionRecord(prev => ({
      ...prev,
      quranRecitation: {
        ...prev.quranRecitation,
        [studentId]: {
          ...prev.quranRecitation[studentId],
          [field]: value
        }
      }
    }));
  };

  const updateBookReading = (studentId: string, field: string, value: any) => {
    setSessionRecord(prev => ({
      ...prev,
      bookReading: {
        ...prev.bookReading,
        [studentId]: {
          ...prev.bookReading[studentId],
          [field]: value
        }
      }
    }));
  };

  const goToNextStep = () => {
    if (recordingStep === 'attendance') {
      setRecordingStep('quran');
    } else if (recordingStep === 'quran') {
      setRecordingStep('books');
    }
  };

  const goToPreviousStep = () => {
    if (recordingStep === 'books') {
      setRecordingStep('quran');
    } else if (recordingStep === 'quran') {
      setRecordingStep('attendance');
    }
  };

  const getSessionStudents = (session: Session) => {
    return students.filter(student => {
      const studentRoom = schoolRooms.find(sr => sr.id === student.schoolRoomId);
      return studentRoom && studentRoom.divisionId === session.divisionId && !student.archived;
    });
  };

  const getDivisionName = (divisionId: string) => {
    const division = divisions.find(d => d.id === divisionId);
    return division ? `${division.name}${division.archived ? ' (مؤرشف)' : ''}` : 'غير معروف';
  };

  const getRoomName = (roomId: string) => {
    const room = schoolRooms.find(r => r.id === roomId);
    return room ? room.name : 'غير معروف';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">الجلسات</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showArchived 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showArchived ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showArchived ? 'إخفاء المؤرشف' : 'عرض المؤرشف'}
          </button>
          {!showArchived && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              جلسة جديدة
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const sessionStudents = getSessionStudents(session);
          const attendanceCount = Object.values(session.attendance || {}).filter(Boolean).length;
          const division = divisions.find(d => d.id === session.divisionId);
          
          return (
            <div 
              key={session.id} 
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                division?.archived ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{session.topic}</h3>
                  <p className="text-sm text-gray-600">{getDivisionName(session.divisionId)}</p>
                  {division?.archived && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mt-1">
                      مؤرشف
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>الحضور: {attendanceCount}/{sessionStudents.length}</span>
                </div>
                <div className="text-xs text-gray-500">
                  الغرفة: {getRoomName(session.schoolRoomId)}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleRecordSession(session)}
                  disabled={division?.archived}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    division?.archived
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  تسجيل الجلسة
                </button>
                <button
                  onClick={() => setSelectedSession(session)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Session Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="جلسة جديدة">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشعبة</label>
            <select
              value={newSession.divisionId}
              onChange={(e) => setNewSession({...newSession, divisionId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">اختر الشعبة</option>
              {activeDivisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الغرفة</label>
            <select
              value={newSession.schoolRoomId}
              onChange={(e) => setNewSession({...newSession, schoolRoomId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">اختر الغرفة</option>
              {availableSchoolRooms.map((schoolRoom) => (
                <option key={schoolRoom.id} value={schoolRoom.id}>
                  {schoolRoom.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
            <input
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({...newSession, date: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
            <input
              type="text"
              value={newSession.topic}
              onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="موضوع الجلسة"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إنشاء الجلسة
            </button>
          </div>
        </form>
      </Modal>

      {/* Session Details Modal */}
      {selectedSession && (
        <Modal 
          isOpen={!!selectedSession} 
          onClose={() => setSelectedSession(null)} 
          title="تفاصيل الجلسة"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">{selectedSession.topic}</h3>
              <p className="text-sm text-gray-600">{getDivisionName(selectedSession.divisionId)}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="font-medium">التاريخ:</span> {selectedSession.date}
              </div>
              <div>
                <span className="font-medium">الغرفة:</span> {getRoomName(selectedSession.schoolRoomId)}
              </div>
            </div>

            {/* Attendance Summary */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">الحضور</h4>
              <div className="space-y-1">
                {getSessionStudents(selectedSession).map(student => (
                  <div key={student.id} className="flex justify-between items-center text-sm">
                    <span>{student.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedSession.attendance?.[student.id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSession.attendance?.[student.id] ? 'حاضر' : 'غائب'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Session Modal */}
      {showRecordModal && recordingSession && (
        <Modal 
          isOpen={showRecordModal} 
          onClose={() => setShowRecordModal(false)} 
          title={`تسجيل جلسة: ${recordingSession.topic} - ${
            recordingStep === 'attendance' ? 'الحضور' :
            recordingStep === 'quran' ? 'تسميع القرآن' : 'قراءة الكتب'
          }`}
        >
          <div className="space-y-4">
            {/* Step Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  recordingStep === 'attendance' ? 'bg-blue-600 text-white' : 
                  recordingStep === 'quran' || recordingStep === 'books' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-sm ${recordingStep === 'attendance' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  الحضور
                </span>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  recordingStep === 'quran' ? 'bg-blue-600 text-white' : 
                  recordingStep === 'books' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm ${recordingStep === 'quran' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  تسميع القرآن
                </span>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  recordingStep === 'books' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`text-sm ${recordingStep === 'books' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  قراءة الكتب
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="max-h-96 overflow-y-auto">
              {recordingStep === 'attendance' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">تسجيل الحضور</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {getSessionStudents(recordingSession).map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{student.name}</span>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sessionRecord.attendance[student.id] || false}
                            onChange={(e) => updateAttendance(student.id, e.target.checked)}
                            className="w-5 h-5 rounded"
                          />
                          <span className={`text-sm font-medium ${
                            sessionRecord.attendance[student.id] ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {sessionRecord.attendance[student.id] ? 'حاضر' : 'غائب'}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recordingStep === 'quran' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">تسميع القرآن</h3>
                  {getSessionStudents(recordingSession).map(student => (
                    <div key={student.id} className="border rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-gray-800 mb-3">{student.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">المسمع (كتابة)</label>
                          <textarea
                            value={sessionRecord.quranRecitation[student.id]?.recitedText || ''}
                            onChange={(e) => updateQuranRecitation(student.id, 'recitedText', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                            placeholder="ما تم تسميعه من القرآن"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الصفحات</label>
                            <input
                              type="number"
                              min="0"
                              value={sessionRecord.quranRecitation[student.id]?.pagesCount || 0}
                              onChange={(e) => updateQuranRecitation(student.id, 'pagesCount', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تقييم التسميع</label>
                            <select
                              value={sessionRecord.quranRecitation[student.id]?.evaluation || 'وسط'}
                              onChange={(e) => updateQuranRecitation(student.id, 'evaluation', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="وسط">وسط</option>
                              <option value="جيد">جيد</option>
                              <option value="جيد جدا">جيد جدا</option>
                              <option value="ممتاز">ممتاز</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {recordingStep === 'books' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">قراءة الكتب</h3>
                  {getSessionStudents(recordingSession).map(student => (
                    <div key={student.id} className="border rounded-lg p-4 bg-green-50">
                      <h4 className="font-medium text-gray-800 mb-3">{student.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">أسماء الكتب</label>
                          <input
                            type="text"
                            value={sessionRecord.bookReading[student.id]?.bookNames || ''}
                            onChange={(e) => updateBookReading(student.id, 'bookNames', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="أسماء الكتب المقروءة"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الصفحات</label>
                            <input
                              type="number"
                              min="0"
                              value={sessionRecord.bookReading[student.id]?.pagesCount || 0}
                              onChange={(e) => updateBookReading(student.id, 'pagesCount', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                          <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={sessionRecord.bookReading[student.id]?.withSummary || false}
                                onChange={(e) => updateBookReading(student.id, 'withSummary', e.target.checked)}
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-sm font-medium">مع تلخيص</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {recordingStep !== 'attendance' && (
                <button
                  onClick={goToPreviousStep}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  السابق
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRecordModal(false);
                  setRecordingStep('attendance');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                إلغاء
              </button>
              
              {recordingStep === 'books' ? (
                <button
                  onClick={handleSaveRecord}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  حفظ التسجيل
                </button>
              ) : (
                <button
                  onClick={goToNextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  التالي
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sessions;