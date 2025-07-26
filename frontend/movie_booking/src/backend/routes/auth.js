const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
const { JWT_SECRET } = require('../config');

// ✅ Signup Route: POST /api/signup
router.post('/signup', (req, res) => {
  const { emailOrPhone } = req.body;

  // Validation
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or Phone is required' });
  }

  // Insert into DB
  const query = 'INSERT IGNORE INTO users (email_or_phone) VALUES (?)';
  db.query(query, [emailOrPhone], (err, results) => {
    if (err) {
      console.error('❌ DB Insert Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // ✅ JWT Token Generation
    const payload = { emailOrPhone };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Send token & data back
    return res.status(200).json({
      message: 'Signup successful',
      token,
      emailOrPhone
    });
  });
});

module.exports = router;
