/*
  # إنشاء جداول نظام إدارة دروس المسجد

  1. الجداول الجديدة
    - `divisions` (الدورات)
      - `id` (uuid, primary key)
      - `name` (text) - اسم الدورة
      - `schedule` (text) - الجدول الزمني
      - `archived` (boolean) - مؤرشفة أم لا
      - `created_at` (timestamp)
      
    - `school_rooms` (الحلقات)
      - `id` (uuid, primary key)
      - `name` (text) - اسم الحلقة
      - `teacher_name` (text) - اسم المعلم
      - `division_id` (uuid, foreign key) - معرف الدورة
      - `max_students` (integer) - الحد الأقصى للطلاب
      - `current_students` (integer) - عدد الطلاب الحالي
      - `created_at` (timestamp)
      
    - `students` (الطلاب)
      - `id` (uuid, primary key)
      - `name` (text) - اسم الطالب
      - `birthday` (text) - سنة الميلاد
      - `father_name` (text) - اسم الوالد
      - `phone` (text) - هاتف الطالب
      - `father_phone` (text) - هاتف الوالد
      - `mother_phone` (text) - هاتف الوالدة
      - `school_room_id` (uuid, foreign key) - معرف الحلقة
      - `join_date` (timestamp) - تاريخ الانضمام
      - `latest_quran_part` (text) - آخر جزء من القرآن
      - `archived` (boolean) - مؤرشف أم لا
      - `created_at` (timestamp)
      
    - `sessions` (الجلسات)
      - `id` (uuid, primary key)
      - `division_id` (uuid, foreign key) - معرف الدورة
      - `school_room_id` (uuid, foreign key) - معرف الحلقة
      - `date` (date) - تاريخ الجلسة
      - `topic` (text) - موضوع الجلسة
      - `attendance` (jsonb) - سجل الحضور
      - `quran_recitation` (jsonb) - سجل تسميع القرآن
      - `book_reading` (jsonb) - سجل قراءة الكتب
      - `created_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات للمستخدمين المصرح لهم

  3. الدوال المساعدة
    - دوال لزيادة وتقليل عدد الطلاب في الحلقات
*/

-- إنشاء جدول الدورات
CREATE TABLE IF NOT EXISTS divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  schedule text NOT NULL,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الحلقات
CREATE TABLE IF NOT EXISTS school_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  teacher_name text NOT NULL,
  division_id uuid REFERENCES divisions(id) ON DELETE CASCADE,
  max_students integer DEFAULT 20,
  current_students integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الطلاب
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birthday text NOT NULL,
  father_name text,
  phone text,
  father_phone text,
  mother_phone text,
  school_room_id uuid REFERENCES school_rooms(id) ON DELETE CASCADE,
  join_date timestamptz DEFAULT now(),
  latest_quran_part text DEFAULT 'جزء عم',
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الجلسات
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id uuid REFERENCES divisions(id) ON DELETE CASCADE,
  school_room_id uuid REFERENCES school_rooms(id) ON DELETE CASCADE,
  date date NOT NULL,
  topic text NOT NULL,
  attendance jsonb DEFAULT '{}',
  quran_recitation jsonb DEFAULT '{}',
  book_reading jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان (للمستخدمين المصرح لهم)
CREATE POLICY "Enable all operations for authenticated users" ON divisions
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON school_rooms
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON students
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON sessions
  FOR ALL TO authenticated USING (true);

-- دوال مساعدة لإدارة عدد الطلاب في الحلقات
CREATE OR REPLACE FUNCTION increment_room_students(room_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE school_rooms 
  SET current_students = current_students + 1 
  WHERE id = room_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_room_students(room_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE school_rooms 
  SET current_students = GREATEST(0, current_students - 1) 
  WHERE id = room_id;
END;
$$ LANGUAGE plpgsql;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_school_rooms_division_id ON school_rooms(division_id);
CREATE INDEX IF NOT EXISTS idx_students_school_room_id ON students(school_room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_division_id ON sessions(division_id);
CREATE INDEX IF NOT EXISTS idx_sessions_school_room_id ON sessions(school_room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);