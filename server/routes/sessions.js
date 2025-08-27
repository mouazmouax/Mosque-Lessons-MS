import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        divisions (
          id,
          name,
          archived
        ),
        school_rooms (
          id,
          name,
          teacher_name
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create session
router.post('/', async (req, res) => {
  try {
    const { division_id, school_room_id, date, topic } = req.body;
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ 
        division_id, 
        school_room_id, 
        date, 
        topic,
        attendance: {},
        quran_recitation: {},
        book_reading: {}
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('sessions')
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

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;