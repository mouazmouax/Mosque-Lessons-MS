import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school_rooms (
          id,
          name,
          teacher_name,
          divisions (
            id,
            name,
            archived
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      birthday, 
      father_name, 
      phone, 
      father_phone, 
      mother_phone, 
      school_room_id, 
      latest_quran_part 
    } = req.body;
    
    const { data, error } = await supabase
      .from('students')
      .insert([{ 
        name, 
        birthday, 
        father_name, 
        phone, 
        father_phone, 
        mother_phone, 
        school_room_id, 
        latest_quran_part,
        archived: false,
        join_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Update school room student count
    await supabase.rpc('increment_room_students', { 
      room_id: school_room_id 
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get student info before deletion
    const { data: student } = await supabase
      .from('students')
      .select('school_room_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update school room student count
    if (student) {
      await supabase.rpc('decrement_room_students', { 
        room_id: student.school_room_id 
      });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;