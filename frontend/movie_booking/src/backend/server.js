// Get a single movie by ID (all fields, empty if missing)
app.get('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM movies WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const row = results[0];
    // Ensure all fields are present for the movie
    const movie = {
      id: row.id,
      title: row.title || '',
      description: row.description || '',
      genre: row.genre || '',
      releaseDate: row.releaseDate ? row.releaseDate.toISOString().split('T')[0] : '',
      duration: row.duration || 0,
      director: row.director || '',
      cast: row.cast || '',
      language: row.language || '',
      posterUrl: row.posterUrl || '',
      trailerUrl: row.trailerUrl || '',
      userRating: row.userRating || 0,
      votes: row.votes || 0,
      createdAt: row.createdAt || null,
      updatedAt: row.updatedAt || null
    };
    res.json(movie);
  });
});
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

// ✅ MySQL DB Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
// NOTE: Use only this backend (movie_booking/src/backend/server.js) for your movie_booking app. Do not run the other backend/server.js.
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL DB connection failed:', err.message);
  } else {
    console.log('✅ MySQL DB connected successfully!');
  }
});

// --- ADD OFFER API ENDPOINT ---
app.post('/api/offers', (req, res) => {
  const {
    code, description, discountType, discountValue, minPurchase,
    validFrom, validTo, isActive, applicableOn, categories,
    maxDiscount, usageLimit, usedCount
  } = req.body;

  // Validate applicableOn ENUM
  const allowedApplicableOn = ['all', 'specific', 'category'];
  if (!allowedApplicableOn.includes(applicableOn)) {
    return res.status(400).json({ error: `Invalid applicableOn value. Allowed: ${allowedApplicableOn.join(', ')}` });
  }

  // Ensure categories is stored as JSON string
  let categoriesStr = '[]';
  if (Array.isArray(categories)) {
    categoriesStr = JSON.stringify(categories);
  } else if (typeof categories === 'string') {
    categoriesStr = categories;
  }

  const query = `
    INSERT INTO offers (
      code, description, discountType, discountValue, minPurchase,
      validFrom, validTo, isActive, applicableOn, categories,
      maxDiscount, usageLimit, usedCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    code, description, discountType, discountValue, minPurchase,
    validFrom, validTo, isActive, applicableOn, categoriesStr,
    maxDiscount, usageLimit, usedCount
  ], (err, result) => {
    if (err) {
      console.error('Error adding offer:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, message: 'Offer added successfully' });
  });
});

// --- OFFERS API ENDPOINT ---
app.get('/api/offers', (req, res) => {
  db.query('SELECT * FROM offers', (err, results) => {
    if (err) {
      console.error('DB error in /api/offers:', err);
      return res.status(500).json({ error: err.message });
    }
    // Parse categories from TEXT to array if present, with error handling
    const offers = results.map(offer => {
      let categories = [];
      if (offer.categories) {
        try {
          categories = JSON.parse(offer.categories);
        } catch (parseErr) {
          console.error('Error parsing categories for offer:', offer, parseErr);
        }
      }
      return { ...offer, categories };
    });
    res.json(offers);
  });
});

// --- SIMPLE IN-MEMORY OTP STORE (for demo) ---
const otpStore = {};

// --- LOGIN ENDPOINT: Check user by email or phone and generate OTP ---
app.post('/api/login', (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }
  // Only check email_or_phone column
  const query = 'SELECT * FROM users WHERE email_or_phone = ?';
  db.query(query, [emailOrPhone], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[emailOrPhone] = otp;
    // For demo, return OTP in response (in real app, send via email/SMS)
    return res.json({ message: 'OTP sent', otp });
  });
});

// --- VERIFY OTP ENDPOINT ---
app.post('/api/verify-otp', (req, res) => {
  const { emailOrPhone, otp } = req.body;
  if (!emailOrPhone || !otp) {
    return res.status(400).json({ message: 'Email/phone and OTP required' });
  }
  if (otpStore[emailOrPhone] && otpStore[emailOrPhone] === otp) {
    delete otpStore[emailOrPhone];
    return res.json({ message: 'OTP verified', success: true });
  } else {
    return res.status(401).json({ message: 'Invalid OTP', success: false });
  }
});

// ✅ API to Save Email/Phone to DB
// Signup: only generate OTP, do not insert user yet
app.post('/api/signup', (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[emailOrPhone] = otp;
  res.status(200).json({ message: 'OTP sent', otp });
});

// Verify signup OTP and insert user if OTP is correct
app.post('/api/verify-signup-otp', (req, res) => {
  const { email_or_phone, otp } = req.body;
  if (!email_or_phone || !otp) {
    return res.status(400).json({ message: 'Email or phone and OTP required' });
  }
  const key = email_or_phone;
  if (otpStore[key] && otpStore[key] === otp) {
    // Insert user only if OTP is correct
    const query = `INSERT INTO users (email_or_phone) VALUES (?)`;
    db.query(query, [email_or_phone], (err, results) => {
      delete otpStore[key];
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'This email or phone is already registered.' });
        }
        return res.status(500).json({ message: 'Server error' });
      }
      return res.json({ message: 'Signup successful', userId: results.insertId, success: true });
    });
  } else {
    return res.status(401).json({ message: 'Invalid OTP', success: false });
  }
});

// --- USER CRUD API ENDPOINTS ---

// Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Map results to match frontend expectations
    const users = results.map(row => ({
      id: row.id,
      email_or_phone: row.email_or_phone,
      created_at: row.created_at
    }));
    res.json(users);
  });
});

// Get all movies (ensure all fields are present, even if null)
app.get('/api/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Ensure all fields are present for each movie
    const movies = results.map(row => ({
      id: row.id,
      title: row.title || '',
      description: row.description || '',
      genre: row.genre || '',
      releaseDate: row.releaseDate ? row.releaseDate.toISOString().split('T')[0] : '',
      duration: row.duration || 0,
      director: row.director || '',
      cast: row.cast || '',
      language: row.language || '',
      posterUrl: row.posterUrl || '',
      trailerUrl: row.trailerUrl || '',
      userRating: row.userRating || 0,
      votes: row.votes || 0,
      createdAt: row.createdAt || null,
      updatedAt: row.updatedAt || null
    }));
    res.json(movies);
  });
});

// Add a new movie (handle missing/optional fields)
app.post('/api/movies', (req, res) => {
  const {
    title = '',
    description = '',
    genre = '',
    releaseDate = null,
    duration = 0,
    director = '',
    cast = '',
    language = '',
    posterUrl = '',
    trailerUrl = '',
    userRating = 0,
    votes = 0
  } = req.body;
  const query = 'INSERT INTO movies (title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl, userRating, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl, userRating, votes], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId });
  });
});

// Update a movie
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl, userRating, votes } = req.body;
  const query = 'UPDATE movies SET title=?, description=?, genre=?, releaseDate=?, duration=?, director=?, cast=?, language=?, posterUrl=?, trailerUrl=?, userRating=?, votes=? WHERE id=?';
  db.query(query, [title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl, userRating, votes, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Movie updated' });
  });
});

// Delete a movie
// Delete an offer
app.delete('/api/offers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM offers WHERE id=?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Offer deleted' });
  });
});
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM movies WHERE id=?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Movie deleted' });
  });
});

// --- SHOWTIMES API ---
const showtimesRoutes = require('./showtimes.routes');
app.use('/api/showtimes', showtimesRoutes);

// Start Server


// --- HOMEPAGE BANNER CONTENT MANAGEMENT ---
// Table: homepage_banner (id INT PRIMARY KEY, genre, title, director, description, status, trailerUrl, posterImage, bannerImages)

// POST: Add or update a banner movie
app.post('/api/homepage-banner', (req, res) => {
  const {
    id,
    genre = '',
    title = '',
    director = '',
    description = '',
    status = '',
    trailerUrl = '',
    posterImage = '',
    bannerImages = '' // Accept JSON string or comma-separated
  } = req.body;
  if (id) {
    // Update existing banner
    const query = `UPDATE homepage_banner SET genre=?, title=?, director=?, description=?, status=?, trailerUrl=?, posterImage=?, bannerImages=? WHERE id=?`;
    db.query(query, [genre, title, director, description, status, trailerUrl, posterImage, bannerImages, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, message: 'Banner movie updated.' });
    });
  } else {
    // Insert new banner
    const query = `INSERT INTO homepage_banner (genre, title, director, description, status, trailerUrl, posterImage, bannerImages)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [genre, title, director, description, status, trailerUrl, posterImage, bannerImages], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Banner movie added.' });
    });
  }
});

// PUT: Update a banner movie by id
app.put('/api/homepage-banner/:id', (req, res) => {
  const { id } = req.params;
  const {
    genre = '',
    title = '',
    director = '',
    description = '',
    status = '',
    trailerUrl = '',
    posterImage = '',
    bannerImages = ''
  } = req.body;
  const query = `UPDATE homepage_banner SET genre=?, title=?, director=?, description=?, status=?, trailerUrl=?, posterImage=?, bannerImages=? WHERE id=?`;
  db.query(query, [genre, title, director, description, status, trailerUrl, posterImage, bannerImages, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, message: 'Banner movie updated.' });
  });
});

// DELETE: Remove a banner movie by id
app.delete('/api/homepage-banner/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM homepage_banner WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Banner movie deleted.' });
  });
});

// GET: Fetch all banner movies for carousel
app.get('/api/homepage-banner', (req, res) => {
  db.query('SELECT * FROM homepage_banner', async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // For each banner, fetch details
    const banners = await Promise.all(results.map(async row => {
      let details = null;
      try {
        details = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM banner_details WHERE banner_id=?', [row.id], (err2, res2) => {
            if (err2) return resolve(null);
            if (res2.length === 0) return resolve(null);
            let d = res2[0];
            try {
              d.topCast = JSON.parse(d.topCast);
            } catch {
              d.topCast = d.topCast ? d.topCast.split(',').map(s => s.trim()) : [];
            }
            resolve(d);
          });
        });
      } catch {}
      return {
        ...row,
        bannerImages: (() => {
          if (!row.bannerImages) return [];
          try {
            return JSON.parse(row.bannerImages);
          } catch {
            return row.bannerImages.split(',').map(s => s.trim()).filter(Boolean);
          }
        })(),
        details
      };
    }));
    res.json(banners);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
