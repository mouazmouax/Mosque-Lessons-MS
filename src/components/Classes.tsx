import React, { useState } from 'react';
import { Plus, Edit2, Users, Clock, BookOpen } from 'lucide-react';
import { Class, Teacher } from '../types';
import Modal from './Modal';

interface ClassesProps {
  classes: Class[];
  onAddClass: (classData: Omit<Class, 'id'>) => void;
  onUpdateClass: (id: string, classData: Partial<Class>) => void;
}

const Classes: React.FC<ClassesProps> = ({ classes, onAddClass, onUpdateClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    maxStudents: 20,
    teacher: {
      name: '',
      email: '',
      phone: '',
      specialization: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classData = {
      ...formData,
      teacher: { ...formData.teacher, id: Date.now().toString() },
      currentStudents: editingClass?.currentStudents || 0
    };

    if (editingClass) {
      onUpdateClass(editingClass.id, classData);
    } else {
      onAddClass(classData);
    }

    setIsModalOpen(false);
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      schedule: '',
      maxStudents: 20,
      teacher: { name: '', email: '', phone: '', specialization: '' }
    });
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description,
      schedule: classItem.schedule,
      maxStudents: classItem.maxStudents,
      teacher: classItem.teacher
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      schedule: '',
      maxStudents: 20,
      teacher: { name: '', email: '', phone: '', specialization: '' }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage mosque classes and their teachers</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first class</p>
          <button
            onClick={handleAddNew}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                <button
                  onClick={() => handleEdit(classItem)}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Teacher: {classItem.teacher.name}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{classItem.schedule}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Students</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {classItem.currentStudents}/{classItem.maxStudents}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(classItem.currentStudents / classItem.maxStudents) * 100}%` }}
                  />
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
          setEditingClass(null);
        }}
        title={editingClass ? 'Edit Class' : 'Add New Class'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="e.g., Mon & Wed 7:00 PM - 8:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Students</label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Teacher Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
              <input
                type="text"
                value={formData.teacher.name}
                onChange={(e) => setFormData({
                  ...formData,
                  teacher: { ...formData.teacher, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.teacher.email}
                onChange={(e) => setFormData({
                  ...formData,
                  teacher: { ...formData.teacher, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.teacher.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  teacher: { ...formData.teacher, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                value={formData.teacher.specialization}
                onChange={(e) => setFormData({
                  ...formData,
                  teacher: { ...formData.teacher, specialization: e.target.value }
                })}
                placeholder="e.g., Quran Recitation, Islamic Studies"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingClass(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;