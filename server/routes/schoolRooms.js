import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

// Get all school rooms
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('school_rooms')
      .select('id, name, teacher_name, division_id, max_students, current_students')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to match frontend interface
    const transformedData = data.map(room => ({
      id: room.id,
      name: room.name,
      teacher: {
        id: room.teacher_name, // Using teacher_name as id for now
        name: room.teacher_name
      },
      divisionId: room.division_id,
      maxStudents: room.max_students,
      currentStudents: room.current_students
    }));
    
    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create school room
router.post('/', async (req, res) => {
  try {
    const { name, teacher_name, division_id, max_students = 20 } = req.body;
    
    const { data, error } = await supabase
      .from('school_rooms')
      .insert([{ 
        name, 
        teacher_name, 
        division_id, 
        max_students,
        current_students: 0 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update school room
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('school_rooms')
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

// Delete school room
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('school_rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'School room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;