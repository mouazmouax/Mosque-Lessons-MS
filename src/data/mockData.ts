import { Division, SchoolRoom, Student, Session } from '../types';

// Mock data for the application
export const mockDivisions: Division[] = [
  {
    id: '1',
    name: 'دورة المبتدئين',
    schedule: 'الاثنين والأربعاء 7:00 - 8:00 مساءً',
    archived: false
  },
  {
    id: '2',
    name: 'دورة المتوسطين',
    schedule: 'الثلاثاء والخميس 7:00 - 8:00 مساءً',
    archived: false
  },
  {
    id: '3',
    name: 'دورة المتقدمين',
    schedule: 'السبت والأحد 6:00 - 7:00 مساءً',
    archived: false
  }
];

export const mockSchoolRooms: SchoolRoom[] = [
  {
    id: '1',
    name: 'الحلقة الأولى',
    teacher: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567'
    },
    divisionId: '1',
    maxStudents: 15,
    currentStudents: 8
  },
  {
    id: '2',
    name: 'الحلقة الثانية',
    teacher: {
      id: '2',
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '+966507654321'
    },
    divisionId: '1',
    maxStudents: 12,
    currentStudents: 10
  },
  {
    id: '3',
    name: 'حلقة المتوسطين أ',
    teacher: {
      id: '3',
      name: 'عبدالله أحمد',
      email: 'abdullah@example.com',
      phone: '+966509876543'
    },
    divisionId: '2',
    maxStudents: 20,
    currentStudents: 15
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'عبدالرحمن أحمد',
    birthday: '2010',
    fatherName: 'أحمد محمد',
    phone: '+966501111111',
    fatherPhone: '+966502222222',
    motherPhone: '+966503333333',
    schoolRoomId: '1',
    joinDate: '2024-01-15T00:00:00.000Z',
    latestQuranPart: 'جزء عم',
    archived: false
  },
  {
    id: '2',
    name: 'محمد عبدالله',
    birthday: '2009',
    fatherName: 'عبدالله علي',
    phone: '+966504444444',
    fatherPhone: '+966505555555',
    schoolRoomId: '1',
    joinDate: '2024-02-01T00:00:00.000Z',
    latestQuranPart: 'جزء تبارك',
    archived: false
  },
  {
    id: '3',
    name: 'يوسف محمد',
    birthday: '2008',
    fatherName: 'محمد يوسف',
    phone: '+966506666666',
    fatherPhone: '+966507777777',
    motherPhone: '+966508888888',
    schoolRoomId: '2',
    joinDate: '2024-01-20T00:00:00.000Z',
    latestQuranPart: 'جزء 1',
    archived: false
  },
  {
    id: '4',
    name: 'عمر سالم',
    birthday: '2007',
    fatherName: 'سالم عمر',
    phone: '+966509999999',
    fatherPhone: '+966500000000',
    schoolRoomId: '3',
    joinDate: '2024-03-01T00:00:00.000Z',
    latestQuranPart: 'جزء 2',
    archived: false
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    divisionId: '1',
    schoolRoomId: '1',
    date: '2024-12-20',
    topic: 'تلاوة سورة الفاتحة',
    attendance: {
      '1': true,
      '2': true
    },
    quranRecitation: {
      '1': {
        recitedText: 'سورة الفاتحة كاملة',
        pagesCount: 1,
        evaluation: 'جيد جدا'
      },
      '2': {
        recitedText: 'سورة الفاتحة مع البسملة',
        pagesCount: 1,
        evaluation: 'ممتاز'
      }
    },
    bookReading: {
      '1': {
        bookNames: 'كتاب التوحيد',
        pagesCount: 5,
        withSummary: true
      },
      '2': {
        bookNames: 'كتاب الطهارة',
        pagesCount: 3,
        withSummary: false
      }
    }
  },
  {
    id: '2',
    divisionId: '2',
    schoolRoomId: '3',
    date: '2024-12-19',
    topic: 'أحكام الوضوء',
    attendance: {
      '4': true
    },
    quranRecitation: {
      '4': {
        recitedText: 'سورة البقرة الآيات 1-10',
        pagesCount: 2,
        evaluation: 'جيد'
      }
    },
    bookReading: {
      '4': {
        bookNames: 'فقه العبادات',
        pagesCount: 8,
        withSummary: true
      }
    }
  }
];