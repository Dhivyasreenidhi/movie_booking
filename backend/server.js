// --- LOGIN/SIGNUP ENDPOINTS ---
// ...existing code...
const express = require('express');
const pool = require('./config/db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// Get all offers
app.get('/api/offers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM offers');
    // Parse categories from TEXT to array if present
    const offers = rows.map(offer => {
      let categories = [];
      try {
        categories = offer.categories ? JSON.parse(offer.categories) : [];
      } catch (parseErr) {
        console.error('Error parsing categories for offer:', offer, parseErr);
      }
      return { ...offer, categories };
    });
    res.json(offers);
  } catch (err) {
    console.error('Error in /api/offers:', err);
    res.status(500).json({ error: err.message });
  }
});
// ...existing code...
// Get offer by ID
app.get('/api/offers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM offers WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Offer not found' });
    let offer = rows[0];
    try {
      offer.categories = offer.categories ? JSON.parse(offer.categories) : [];
    } catch (parseErr) {
      offer.categories = [];
    }
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add offer
app.post('/api/offers', async (req, res) => {
  const { code, description, discountType, discountValue, minPurchase, validFrom, validTo, isActive, applicableOn, categories, maxDiscount, usageLimit, usedCount } = req.body;
  let categoriesStr = Array.isArray(categories) ? JSON.stringify(categories) : categories;
  try {
    const [result] = await pool.query(
      'INSERT INTO offers (code, description, discountType, discountValue, minPurchase, validFrom, validTo, isActive, applicableOn, categories, maxDiscount, usageLimit, usedCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [code, description, discountType, discountValue, minPurchase, validFrom, validTo, isActive, applicableOn, categoriesStr, maxDiscount, usageLimit, usedCount]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/offers/:id', async (req, res) => {
  const { id } = req.params;
  const { code, description, discountType, discountValue, minPurchase, validFrom, validTo, isActive, applicableOn, categories, maxDiscount, usageLimit, usedCount } = req.body;
  let categoriesStr = Array.isArray(categories) ? JSON.stringify(categories) : categories;
  try {
    await pool.query(
      'UPDATE offers SET code=?, description=?, discountType=?, discountValue=?, minPurchase=?, validFrom=?, validTo=?, isActive=?, applicableOn=?, categories=?, maxDiscount=?, usageLimit=?, usedCount=? WHERE id=?',
      [code, description, discountType, discountValue, minPurchase, validFrom, validTo, isActive, applicableOn, categoriesStr, maxDiscount, usageLimit, usedCount, id]
    );
    res.json({ message: 'Offer updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add a new movie
// Get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    console.error('Error in GET /api/movies:', err);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/movies', async (req, res) => {
  const { title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO movies (title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error in POST /api/movies:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a movie
app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl } = req.body;
  try {
    await pool.query(
      'UPDATE movies SET title=?, description=?, genre=?, releaseDate=?, duration=?, director=?, cast=?, language=?, posterUrl=?, trailerUrl=? WHERE id=?',
      [title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl, id]
    );
    res.json({ message: 'Movie updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get a single movie by ID
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a movie
// Delete an offer
app.delete('/api/offers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM offers WHERE id=?', [id]);
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});
app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM movies WHERE id=?', [id]);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Backend started. Listening for requests...');
});
// --- USERS ENDPOINTS ---
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { email_or_phone } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (email_or_phone) VALUES (?)', [email_or_phone]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email_or_phone } = req.body;
  try {
    await pool.query('UPDATE users SET email_or_phone=? WHERE id=?', [email_or_phone, id]);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id=?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SHOWTIMES ENDPOINTS ---
app.get('/api/showtimes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.movie_id, s.show_date, s.show_time, s.screen, s.total_seats, s.available_seats, s.createdAt, s.updatedAt
      FROM showtimes s
      ORDER BY s.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/showtimes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM showtimes WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Showtime not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/showtimes', async (req, res) => {
  const { movie_id, show_date, show_time, screen, total_seats, available_seats } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO showtimes (movie_id, show_date, show_time, screen, total_seats, available_seats) VALUES (?, ?, ?, ?, ?, ?)',
      [movie_id, show_date, show_time, screen, total_seats, available_seats]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error in POST /api/showtimes:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/showtimes/:id', async (req, res) => {
  const { id } = req.params;
  const { movie_id, show_date, show_time, screen, total_seats, available_seats } = req.body;
  try {
    await pool.query(
      'UPDATE showtimes SET movie_id=?, show_date=?, show_time=?, screen=?, total_seats=?, available_seats=? WHERE id=?',
      [movie_id, show_date, show_time, screen, total_seats, available_seats, id]
    );
    res.json({ message: 'Showtime updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/showtimes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM showtimes WHERE id=?', [id]);
    res.json({ message: 'Showtime deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BANNER DETAILS ENDPOINTS ---
app.get('/api/banner-details', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banner_details');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/banner-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM banner_details WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Banner details not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/banner-details', async (req, res) => {
  const { banner_id, year, duration, rating, topCast, storyLine } = req.body;
  try {
    console.log('POST /api/banner-details body:', req.body);
    const [result] = await pool.query(
      'INSERT INTO banner_details (banner_id, year, duration, rating, topCast, storyLine) VALUES (?, ?, ?, ?, ?, ?)',
      [banner_id, year, duration, rating, topCast, storyLine]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error in POST /api/banner-details:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/banner-details/:id', async (req, res) => {
  const { id } = req.params;
  const { banner_id, topCast, awards, summary } = req.body;
  try {
    await pool.query('UPDATE banner_details SET banner_id=?, topCast=?, awards=?, summary=? WHERE id=?', [banner_id, topCast, awards, summary, id]);
    res.json({ message: 'Banner details updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HOMEPAGE BANNER ENDPOINTS ---
// Get all banners
app.get('/api/homepage-banner', async (req, res) => {
  try {
    const [banners] = await pool.query('SELECT * FROM homepage_banner');
    if (!banners || banners.length === 0) {
      return res.json([]);
    }
    // Fetch all banner details
    const [details] = await pool.query('SELECT * FROM banner_details');
    // Map details by banner_id for quick lookup
    const detailsMap = {};
    details.forEach(d => { detailsMap[d.banner_id] = d; });
    // Attach details to each banner
    const merged = banners.map(banner => ({
      ...banner,
      details: detailsMap[banner.id] || null
    }));
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OTP UTILS ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// --- In-memory OTP store (for demo, not for production) ---
const otpStore = {};

// --- SIGNUP ENDPOINT (send OTP, do not store in DB) ---
// NOTE: For development/testing, the OTP is returned in the response as { otp: ... }.
// Display this OTP in your frontend for easy testing.
app.post('/api/signup', async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }
  const otp = generateOTP();
  otpStore[emailOrPhone] = otp;
  try {
    // Insert user if not exists
    let [rows] = await pool.query('SELECT * FROM users WHERE email_or_phone=?', [emailOrPhone]);
    if (rows.length === 0) {
      await pool.query('INSERT INTO users (email_or_phone) VALUES (?)', [emailOrPhone]);
    }
    // In production, send OTP via SMS/email here
    res.json({ message: 'OTP sent', otp }); // For demo, return OTP
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});


// --- VERIFY OTP ENDPOINT (in-memory, one-time) ---
app.post('/api/verify-otp', async (req, res) => {
  const { emailOrPhone, otp } = req.body;
  if (!emailOrPhone || !otp) {
    return res.status(400).json({ message: 'Email/phone and OTP are required' });
  }
  try {
    if (!otpStore[emailOrPhone] || otpStore[emailOrPhone] !== otp) {
      return res.status(401).json({ message: 'Invalid OTP. Please try again.', success: false });
    }
    // OTP is valid, remove it (one-time)
    delete otpStore[emailOrPhone];
    const [rows] = await pool.query('SELECT * FROM users WHERE email_or_phone=?', [emailOrPhone]);
    res.json({ message: 'OTP verified', success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify OTP', error: err.message });
  }
});

// Get banner by ID
app.get('/api/homepage-banner/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch banner by ID
    const [bannerRows] = await pool.query('SELECT * FROM homepage_banner WHERE id=?', [id]);
    if (!bannerRows || bannerRows.length === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    const banner = bannerRows[0];
    // Fetch banner details by banner_id
    const [detailsRows] = await pool.query('SELECT * FROM banner_details WHERE banner_id=?', [id]);
    let details = null;
    if (detailsRows && detailsRows.length > 0) {
      const d = detailsRows[0];
      let topCastArr = [];
      if (d.topCast) {
        if (Array.isArray(d.topCast)) {
          topCastArr = d.topCast;
        } else if (typeof d.topCast === 'string') {
          try {
            // Try to parse as JSON array
            topCastArr = JSON.parse(d.topCast);
            if (!Array.isArray(topCastArr)) {
              // If not an array, fallback to split by comma
              topCastArr = d.topCast.split(',').map(s => s.trim()).filter(Boolean);
            }
          } catch {
            // If not JSON, fallback to split by comma
            topCastArr = d.topCast.split(',').map(s => s.trim()).filter(Boolean);
          }
        }
      }
      details = {
        year: d.year,
        duration: d.duration,
        rating: d.rating,
        topCast: topCastArr,
        storyLine: d.storyLine
      };
    }
    // Return merged structure for consistency with all-banners endpoint
    res.json({ ...banner, details });
  } catch (err) {
    console.error('Error fetching banner and details:', err);
    res.status(500).json({ error: 'Failed to fetch banner and details' });
  }
});

// Add banner
app.post('/api/homepage-banner', async (req, res) => {
  const { genre, title, director, description, status, trailerUrl, posterImage, bannerImages } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO homepage_banner (genre, title, director, description, status, trailerUrl, posterImage, bannerImages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [genre, title, director, description, status, trailerUrl, posterImage, bannerImages]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error in POST /api/homepage-banner:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update banner
app.put('/api/homepage-banner/:id', async (req, res) => {
  const { id } = req.params;
  const { genre, title, director, description, status, trailerUrl, posterImage, bannerImages } = req.body;
  try {
    await pool.query(
      'UPDATE homepage_banner SET genre=?, title=?, director=?, description=?, status=?, trailerUrl=?, posterImage=?, bannerImages=? WHERE id=?',
      [genre, title, director, description, status, trailerUrl, posterImage, bannerImages, id]
    );
    res.json({ message: 'Banner updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete banner
app.delete('/api/homepage-banner/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM homepage_banner WHERE id=?', [id]);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN/SIGNUP ENDPOINTS ---

// --- LOGIN ENDPOINT (send OTP for login, in-memory only) ---
// NOTE: For development/testing, the OTP is returned in the response as { otp: ... }.
// Display this OTP in your frontend for easy testing.
app.post('/api/login', async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }
  const otp = generateOTP();
  try {
    let [rows] = await pool.query('SELECT * FROM users WHERE email_or_phone=?', [emailOrPhone]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    otpStore[emailOrPhone] = otp;
    // In production, send OTP via SMS/email here
    res.json({ message: 'OTP sent', otp }); // For demo, return OTP
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

