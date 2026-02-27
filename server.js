const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- API ENDPOINTS ---

// Get all members for the Admin Page
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Transaction Alert Logic
app.post('/api/transfer', async (req, res) => {
  const { senderId, amount } = req.body;
  if (amount > 5000) {
    console.log(`[SECURITY ALERT] Large transfer of $${amount} by User ${senderId}`);
    // Add logic here to notify admin via email/dashboard
  }
  // (Add transfer DB logic here)
  res.json({ success: true });
});

// Fallback: Send index.html for any unknown routes (Essential for SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`BlueCredit Live on port ${PORT}`));