import React, { useState } from 'react';
import { Plus, Edit2, Phone, Calendar, BookOpen, Grid3X3, List, Archive, ArchiveRestore } from 'lucide-react';
import { Student, SchoolRoom, Division } from '../types';
import Modal from './Modal';

interface StudentsProps {
  students: Student[];
  schoolRooms: SchoolRoom[];
  divisions: Division[];
  onAddStudent: (studentData: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, studentData: Partial<Student>) => void;
  onUpdateSchoolRoomStudentCount: (schoolRoomId: string, increment: number) => void;
}

const Students: React.FC<StudentsProps> = ({ 
  students, 
  schoolRooms,
  divisions,
  onAddStudent, 
  onUpdateStudent,
  onUpdateSchoolRoomStudentCount 
}) => {
  const activeDivisions = divisions.filter(d => !d.archived);
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Filter students based on archive status
  const displayedStudents = showArchived 
    ? students.filter(s => s.archived)
    : students.filter(s => !s.archived);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    fatherName: '',
    phone: '',
    fatherPhone: '',
    motherPhone: '',
    schoolRoomId: '',
    latestQuranPart: 'جزء عم'
  });

  const availableSchoolRooms = schoolRooms.filter(sr => sr.divisionId === selectedDivisionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      ...formData,
      joinDate: editingStudent?.joinDate || new Date().toISOString(),
      archived: false
    };

    if (editingStudent) {
      // If school room changed, update student counts
      if (editingStudent.schoolRoomId !== formData.schoolRoomId) {
        onUpdateSchoolRoomStudentCount(editingStudent.schoolRoomId, -1);
        onUpdateSchoolRoomStudentCount(formData.schoolRoomId, 1);
      }
      onUpdateStudent(editingStudent.id, studentData);
    } else {
      onAddStudent(studentData);
      onUpdateSchoolRoomStudentCount(formData.schoolRoomId, 1);
    }

    setIsModalOpen(false);
    setEditingStudent(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      birthday: '',
      fatherName: '',
      phone: '',
      fatherPhone: '',
      motherPhone: '',
      schoolRoomId: '',
      latestQuranPart: 1
    });
    setSelectedDivisionId('');
  };

  const handleEdit = (student: Student) => {
    const schoolRoom = schoolRooms.find(sr => sr.id === student.schoolRoomId);
    setEditingStudent(student);
    setSelectedDivisionId(schoolRoom?.divisionId || '');
    setFormData({
      name: student.name,
      birthday: student.birthday,
      fatherName: student.fatherName || '',
      phone: student.phone || '',
      fatherPhone: student.fatherPhone || '',
      motherPhone: student.motherPhone || '',
      schoolRoomId: student.schoolRoomId,
      latestQuranPart: student.latestQuranPart
    });
    setIsModalOpen(true);
  };

  const handleArchive = (student: Student) => {
    onUpdateStudent(student.id, { archived: !student.archived });
    if (!student.archived) {
      // If archiving, decrease room student count
      onUpdateSchoolRoomStudentCount(student.schoolRoomId, -1);
    } else {
      // If restoring, increase room student count
      onUpdateSchoolRoomStudentCount(student.schoolRoomId, 1);
    }
  };
  const handleAddNew = () => {
    setEditingStudent(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getSchoolRoomInfo = (schoolRoomId: string) => {
    const schoolRoom = schoolRooms.find(sr => sr.id === schoolRoomId);
    const division = divisions.find(d => d.id === schoolRoom?.divisionId);
    return {
      roomName: schoolRoom?.name || 'Unknown Room',
      divisionName: division?.name || 'Unknown Division',
      teacherName: schoolRoom?.teacher.name || 'Unknown Teacher'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الطلاب</h1>
          <p className="text-gray-600 mt-1">إدارة ملفات الطلاب وتسجيلهم في الحلقات</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'table' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              showArchived 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {showArchived ? 'إظهار النشطين' : 'إظهار المؤرشفين'}
          </button>
          {!showArchived && (
            <button
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طالب</span>
            </button>
          )}
        </div>
      </div>

      {displayedStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showArchived ? 'لا يوجد طلاب مؤرشفون' : 'لا يوجد طلاب بعد'}
          </h3>
          <p className="text-gray-500 mb-6">
            {showArchived ? 'لا يوجد طلاب تم أرشفتهم' : 'ابدأ بتسجيل طالبك الأول'}
          </p>
          {!showArchived && (
            <button
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              تسجيل أول طالب
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStudents.map((student) => (
            <div key={student.id} className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${
              student.archived ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-semibold ${student.archived ? 'text-gray-600' : 'text-gray-900'}`}>
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    مولود: {student.birthday}
                  </p>
                  {student.archived && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full mt-1 inline-block">مؤرشف</span>
                  )}
                </div>
                <div className="flex space-x-1">
                  {!student.archived && (
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(student)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      student.archived
                        ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={student.archived ? 'استعادة الطالب' : 'أرشفة الطالب'}
                  >
                    {student.archived ? (
                      <ArchiveRestore className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(() => {
                  const roomInfo = getSchoolRoomInfo(student.schoolRoomId);
                  const division = divisions.find(d => d.id === schoolRooms.find(sr => sr.id === student.schoolRoomId)?.divisionId);
                  const isArchived = division?.archived;
                  return (
                    <>
                      <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <span>الدورة: {roomInfo.divisionName} {isArchived && <span className="text-xs bg-gray-200 text-gray-600 px-1 py-0.5 rounded ml-1">مؤرشفة</span>}</span>
                      </div>
                      <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>الحلقة: {roomInfo.roomName}</span>
                      </div>
                      <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        <Phone className="w-4 h-4 text-purple-500" />
                        <span>المعلم: {roomInfo.teacherName}</span>
                      </div>
                    </>
                  );
                })()}

                <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>الوالد: {student.fatherName || 'غير محدد'}</span>
                </div>

                {student.phone && (
                  <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>الهاتف: {student.phone}</span>
                  </div>
                )}

                <div className={`flex items-center space-x-2 text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>تاريخ الانضمام: {new Date(student.joinDate).toLocaleDateString('ar-SA')}</span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${student.archived ? 'text-gray-600' : 'text-gray-700'}`}>آخر جزء من القرآن</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {student.latestQuranPart}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سنة الميلاد</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدورة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحلقة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوالد</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">جزء القرآن</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedStudents.map((student) => {
                  const roomInfo = getSchoolRoomInfo(student.schoolRoomId);
                  const division = divisions.find(d => d.id === schoolRooms.find(sr => sr.id === student.schoolRoomId)?.divisionId);
                  const isDivisionArchived = division?.archived;
                  return (
                    <tr key={student.id} className={student.archived ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className={`text-sm font-medium ${student.archived ? 'text-gray-600' : 'text-gray-900'}`}>
                              {student.name}
                            </div>
                            {student.archived && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">مؤرشف</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        {student.birthday}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        {roomInfo.divisionName}
                        {isDivisionArchived && <span className="text-xs bg-gray-200 text-gray-600 px-1 py-0.5 rounded ml-1">مؤرشفة</span>}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        {roomInfo.roomName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        {student.fatherName || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${student.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                        {student.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {student.latestQuranPart}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!student.archived && (
                            <button
                              onClick={() => handleEdit(student)}
                              className="text-emerald-600 hover:text-emerald-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleArchive(student)}
                            className={student.archived ? 'text-emerald-600 hover:text-emerald-900' : 'text-red-600 hover:text-red-900'}
                            title={student.archived ? 'استعادة الطالب' : 'أرشفة الطالب'}
                          >
                            {student.archived ? (
                              <ArchiveRestore className="w-4 h-4" />
                            ) : (
                              <Archive className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الطالب</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سنة الميلاد</label>
            <input
              type="number"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              min="1900"
              max={new Date().getFullYear()}
              placeholder="مثال: 2010"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدورة</label>
            <select
              value={selectedDivisionId}
              onChange={(e) => {
                setSelectedDivisionId(e.target.value);
                setFormData({ ...formData, schoolRoomId: '' });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">اختر الدورة</option>
              {activeDivisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name} - {division.schedule}
                </option>
              ))}
              {divisions.filter(d => d.archived).map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name} - {division.schedule} (مؤرشفة)
                </option>
              ))}
            </select>
          </div>

          {selectedDivisionId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحلقة</label>
              <select
                value={formData.schoolRoomId}
                onChange={(e) => setFormData({ ...formData, schoolRoomId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">اختر الحلقة</option>
                {availableSchoolRooms.map((schoolRoom) => (
                  <option key={schoolRoom.id} value={schoolRoom.id}>
                    {schoolRoom.name} - {schoolRoom.teacher.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوالد (اختياري)</label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هاتف الطالب (اختياري)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هاتف الوالد (اختياري)</label>
            <input
              type="tel"
              value={formData.fatherPhone}
              onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />

        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هاتف الوالدة (اختياري)</label>
            <input
              type="tel"
              value={formData.motherPhone}
              onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">آخر جزء من القرآن</label>
            <select
              value={formData.latestQuranPart}
              onChange={(e) => setFormData({ ...formData, latestQuranPart: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="جزء عم">جزء عم</option>
              <option value="جزء تبارك">جزء تبارك</option>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(part => (
                <option key={part} value={`جزء ${part}`}>جزء {part}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingStudent(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!formData.schoolRoomId}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {editingStudent ? 'تحديث الطالب' : 'إضافة الطالب'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;