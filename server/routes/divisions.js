import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

// Get all divisions
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('divisions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create division
router.post('/', async (req, res) => {
  try {
    const { name, schedule } = req.body;
    
    const { data, error } = await supabase
      .from('divisions')
      .insert([{ name, schedule, archived: false }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update division
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('divisions')
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

// Delete division
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('divisions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Division deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;