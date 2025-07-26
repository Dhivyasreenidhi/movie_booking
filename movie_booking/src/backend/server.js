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

// Add a new movie
app.post('/api/movies', async (req, res) => {
  const { title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO movies (title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, genre, releaseDate, duration, director, cast, language, posterUrl, trailerUrl]
    );
    res.json({ id: result.insertId });
  } catch (err) {
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
