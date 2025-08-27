import React, { ReactNode } from 'react';
import { BookOpen, Users, Calendar, BarChart3, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'divisions', label: 'الدورات', icon: BookOpen },
    { id: 'schoolrooms', label: 'الحلقات', icon: Users },
    { id: 'students', label: 'الطلاب', icon: Calendar },
    { id: 'sessions', label: 'الجلسات', icon: BarChart3 },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <nav className="bg-white shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-800">دروس المسجد</h1>
            </div>
            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden border-t border-emerald-100">
          <div className="grid grid-cols-5 gap-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;