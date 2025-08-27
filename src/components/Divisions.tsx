import React, { useState } from 'react';
import { Plus, Edit2, Clock, BookOpen, Archive, ArchiveRestore } from 'lucide-react';
import { Division } from '../types';
import Modal from './Modal';

interface DivisionsProps {
  divisions: Division[];
  onAddDivision: (divisionData: Omit<Division, 'id'>) => void;
  onUpdateDivision: (id: string, divisionData: Partial<Division>) => void;
}

const Divisions: React.FC<DivisionsProps> = ({ divisions, onAddDivision, onUpdateDivision }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    schedule: ''
  });

  const activeDivisions = divisions.filter(d => !d.archived);
  const archivedDivisions = divisions.filter(d => d.archived);
  const displayedDivisions = showArchived ? archivedDivisions : activeDivisions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const divisionData = {
      ...formData,
      archived: false
    };

    if (editingDivision) {
      onUpdateDivision(editingDivision.id, divisionData);
    } else {
      onAddDivision(divisionData);
    }

    setIsModalOpen(false);
    setEditingDivision(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      schedule: ''
    });
  };

  const handleEdit = (division: Division) => {
    setEditingDivision(division);
    setFormData({
      name: division.name,
      schedule: division.schedule
    });
    setIsModalOpen(true);
  };

  const handleArchive = (division: Division) => {
    onUpdateDivision(division.id, { archived: !division.archived });
  };

  const handleAddNew = () => {
    setEditingDivision(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الدورات</h1>
          <p className="text-gray-600 mt-1">إدارة الدورات التعليمية وجداولها الزمنية</p>
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
            {showArchived ? 'إظهار النشطة' : 'إظهار المؤرشفة'}
          </button>
          {!showArchived && (
            <button
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة دورة</span>
            </button>
          )}
        </div>
      </div>

      {displayedDivisions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showArchived ? 'لا توجد دورات مؤرشفة' : 'لا توجد دورات بعد'}
          </h3>
          <p className="text-gray-500 mb-6">
            {showArchived ? 'لا توجد دورات تم أرشفتها' : 'ابدأ بإنشاء دورتك الأولى'}
          </p>
          {!showArchived && (
            <button
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              إنشاء أول دورة
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDivisions.map((division) => (
            <div key={division.id} className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${
              division.archived ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-semibold ${division.archived ? 'text-gray-600' : 'text-gray-900'}`}>
                    {division.name}
                  </h3>
                  {division.archived && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">مؤرشفة</span>
                  )}
                </div>
                <div className="flex space-x-1">
                  {!division.archived && (
                    <button
                      onClick={() => handleEdit(division)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(division)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      division.archived
                        ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={division.archived ? 'استعادة الدورة' : 'أرشفة الدورة'}
                  >
                    {division.archived ? (
                      <ArchiveRestore className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center space-x-2 text-sm ${division.archived ? 'text-gray-500' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{division.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDivision(null);
        }}
        title={editingDivision ? 'Edit Division' : 'Add New Division'}
      >
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدورة</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: ابتدائي، متوسط، متقدم"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الجدول الزمني</label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="مثال: الاثنين والأربعاء 7:00 - 8:00 مساءً"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDivision(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              {editingDivision ? 'تحديث الدورة' : 'إنشاء الدورة'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Divisions;