import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import divisionsRouter from './routes/divisions.js';
import schoolRoomsRouter from './routes/schoolRooms.js';
import studentsRouter from './routes/students.js';
import sessionsRouter from './routes/sessions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/divisions', divisionsRouter);
app.use('/api/school-rooms', schoolRoomsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { supabase };