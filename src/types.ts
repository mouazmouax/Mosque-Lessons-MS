export interface Division {
  id: string;
  name: string;
  schedule: string;
  archived: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
}

export interface SchoolRoom {
  id: string;
  name: string;
  teacher: Teacher;
  divisionId: string;
  maxStudents: number;
  currentStudents: number;
}

export interface Student {
  id: string;
  name: string;
  birthday: string;
  fatherName?: string;
  phone?: string;
  fatherPhone?: string;
  motherPhone?: string;
  schoolRoomId: string;
  joinDate: string;
  latestQuranPart: string;
  archived: boolean;
}

export interface Session {
  id: string;
  divisionId: string;
  schoolRoomId: string;
  date: string;
  topic: string;
  attendance: Record<string, boolean>;
  quranRecitation: Record<string, {
    recitedText: string;
    pagesCount: number;
    evaluation: 'وسط' | 'جيد' | 'جيد جدا' | 'ممتاز';
  }>;
  bookReading: Record<string, {
    bookNames: string;
    pagesCount: number;
    withSummary: boolean;
  }>;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  teacher: Teacher;
}