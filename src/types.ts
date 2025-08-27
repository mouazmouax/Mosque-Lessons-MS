export interface Teacher {
  id: string;
  name: string;
}

export interface SchoolRoom {
  id: string;
  name: string;
  teacher: Teacher;
  divisionId: string;
  maxStudents: number;
  currentStudents: number;
}

export interface Division {
  id: string;
  name: string;
  schedule: string;
  archived: boolean;
}

export interface Student {
  id: string;
  name: string;
  birthday: string; // Year only (e.g., "2010")
  fatherName?: string;
  phone?: string;
  fatherPhone?: string;
  motherPhone?: string;
  schoolRoomId: string;
  joinDate: string;
  latestQuranPart: string; // جزء من القرآن (عم، تبارك، 1-28)
  archived: boolean;
}

export interface Session {
  id: string;
  divisionId: string;
  schoolRoomId: string;
  date: string;
  attendance: Record<string, boolean>;
  quranRecitation: Record<string, {
    recitedText: string; // المسمع (كتابة)
    pagesCount: number; // المسمع (رقم يعبر عن عدد الصفحات)
    evaluation: 'وسط' | 'جيد' | 'جيد جدا' | 'ممتاز'; // تقييم التسميع
  }>;
  bookReading: Record<string, {
    bookNames: string; // أسماء الكتب
    pagesCount: number; // عدد الصفحات
    withSummary: boolean; // مع تلخيص أو بدون
  }>;
}

export interface BookProgress {
  studentId: string;
  bookName: string;
  totalPages: number;
  pagesCompleted: number;
  startDate: string;
  lastUpdated: string;
}