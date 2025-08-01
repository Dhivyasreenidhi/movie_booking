const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
const { JWT_SECRET } = require('../config');


// Helper to generate tokens
function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

// Signup Route: POST /api/signup
router.post('/signup', (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or Phone is required' });
  }

  // Insert user if not exists
  const userQuery = 'INSERT IGNORE INTO users (email_or_phone) VALUES (?)';
  db.query(userQuery, [emailOrPhone], (err, results) => {
    if (err) {
      console.error('❌ DB Insert Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Get user_id
    const getUserIdQuery = 'SELECT id FROM users WHERE email_or_phone = ?';
    db.query(getUserIdQuery, [emailOrPhone], (err, userRows) => {
      if (err || !userRows.length) {
        return res.status(500).json({ message: 'User lookup failed' });
      }
      const userId = userRows[0].id;

      // Generate tokens
      const payload = { userId, emailOrPhone };
      const { accessToken, refreshToken } = generateTokens(payload);

      // Store tokens in user_sessions
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
      const sessionQuery = `
        INSERT INTO user_sessions (user_id, access_token, refresh_token, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(sessionQuery, [userId, accessToken, refreshToken, now, expiresAt], (err) => {
        if (err) {
          console.error('❌ Session Insert Error:', err);
          return res.status(500).json({ message: 'Session DB error' });
        }

        // Return tokens to frontend
        return res.status(200).json({
          message: 'Signup successful',
          access_token: accessToken,
          refresh_token: refreshToken,
          user_id: userId,
          emailOrPhone
        });
      });
    });
  });
});

module.exports = router;
