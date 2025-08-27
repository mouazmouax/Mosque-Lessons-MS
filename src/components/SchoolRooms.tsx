import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, User, Building2 } from 'lucide-react';
import { SchoolRoom, Division } from '../types';
import Modal from './Modal';

interface SchoolRoomsProps {
  schoolRooms: SchoolRoom[];
  divisions: Division[];
  onAddSchoolRoom: (schoolRoomData: Omit<SchoolRoom, 'id'>) => void;
  onUpdateSchoolRoom: (id: string, schoolRoomData: Partial<SchoolRoom>) => void;
}

const SchoolRooms: React.FC<SchoolRoomsProps> = ({ 
  schoolRooms, 
  divisions, 
  onAddSchoolRoom, 
  onUpdateSchoolRoom 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<SchoolRoom | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [showArchived, setShowArchived] = useState(false);

  // Filter active divisions and rooms
  const activeDivisions = divisions.filter(d => !d.archived);
  const archivedDivisions = divisions.filter(d => d.archived);
  const displayedDivisions = showArchived ? [...activeDivisions, ...archivedDivisions] : activeDivisions;
  const displayedSchoolRooms = schoolRooms.filter(sr => {
    const division = divisions.find(d => d.id === sr.divisionId);
    return showArchived ? division : (division && !division.archived);
  });
  const filteredRooms = selectedDivision 
    ? displayedSchoolRooms.filter(sr => sr.divisionId === selectedDivision)
    : displayedSchoolRooms;

  const [formData, setFormData] = useState({
    name: '',
    teacher: { name: '' },
    divisionId: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      teacher: { name: '' },
      divisionId: ''
    });
    setEditingRoom(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const schoolRoomData = {
      ...formData,
      teacher: { ...formData.teacher, id: Date.now().toString() },
      maxStudents: 20,
      currentStudents: 0
    };

    if (editingRoom) {
      onUpdateSchoolRoom(editingRoom.id, schoolRoomData);
    } else {
      onAddSchoolRoom(schoolRoomData);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (room: SchoolRoom) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      teacher: { name: room.teacher.name },
      divisionId: room.divisionId
    });
    setIsModalOpen(true);
  };

  const handleDelete = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      // Note: You may want to implement a delete function in the parent component
    }
  };

  const getDivisionName = (divisionId: string) => {
    const division = divisions.find(d => d.id === divisionId);
    return division ? `${division.name}${division.archived ? ' (Archived)' : ''}` : 'Unknown Division';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الحلقات</h1>
          <p className="text-gray-600 mt-1">إدارة الحلقات التعليمية ومعلميها</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              showArchived 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {showArchived ? 'إخفاء المؤرشفة' : 'إظهار المؤرشفة'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            إضافة حلقة
          </button>
        </div>
      </div>

      {/* Division Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تصفية حسب الدورة
        </label>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">جميع الدورات</option>
          {displayedDivisions.map(division => (
            <option key={division.id} value={division.id}>
              {division.name}{division.archived ? ' (مؤرشفة)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
            divisions.find(d => d.id === room.divisionId)?.archived 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-emerald-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600">الدورة: {getDivisionName(room.divisionId)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!divisions.find(d => d.id === room.divisionId)?.archived && (
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>المعلم: {room.teacher.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{room.currentStudents} طالب</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حلقات</h3>
          <p className="text-gray-600 mb-4">
            {selectedDivision ? 'لا توجد حلقات في الدورة المحددة.' : 'ابدأ بإنشاء حلقتك الأولى.'}
          </p>
          {!selectedDivision && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              إضافة حلقة
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدورة *
            </label>
            <select
              value={formData.divisionId}
              onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">اختر الدورة</option>
              {displayedDivisions.filter(d => !d.archived).map(division => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم الحلقة *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="مثال: الحلقة أ، القاعة الرئيسية"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المعلم *
            </label>
            <input
              type="text"
              value={formData.teacher.name}
              onChange={(e) => setFormData({ ...formData, teacher: { name: e.target.value } })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="الاسم الكامل للمعلم"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {editingRoom ? 'تحديث الحلقة' : 'إضافة الحلقة'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchoolRooms;