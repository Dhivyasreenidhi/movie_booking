
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = require('./db');

// Get all showtimes with movie title and camelCase keys
router.get('/', (req, res) => {
  const query = `
    SELECT s.id, s.movie_id, s.show_date, s.show_time, s.screen, s.total_seats, s.available_seats, s.createdAt, s.updatedAt, m.title AS movieTitle
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // Map DB fields to camelCase for frontend
    const showtimes = results.map(row => ({
      id: row.id,
      movieId: row.movie_id,
      movieTitle: row.movieTitle,
      screen: row.screen,
      showDate: row.show_date,
      showTime: row.show_time,
      totalSeats: row.total_seats,
      seatsAvailable: row.available_seats,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
    res.json(showtimes);
  });
});

// Get all showtimes for a movie
router.get('/movie/:movieId', (req, res) => {
  const { movieId } = req.params;
  db.query('SELECT * FROM showtimes WHERE movie_id = ?', [movieId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single showtime
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM showtimes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
});

// Add a new showtime
router.post('/', (req, res) => {
  const { movie_id, show_date, show_time, screen, total_seats, available_seats } = req.body;
  const query = 'INSERT INTO showtimes (movie_id, show_date, show_time, screen, total_seats, available_seats) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [movie_id, show_date, show_time, screen, total_seats, available_seats], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Update a showtime
router.put('/:id', (req, res) => {
  const { show_date, show_time, screen, total_seats, available_seats } = req.body;
  const query = 'UPDATE showtimes SET show_date=?, show_time=?, screen=?, total_seats=?, available_seats=? WHERE id=?';
  db.query(query, [show_date, show_time, screen, total_seats, available_seats, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Showtime updated' });
  });
});

// Delete a showtime
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM showtimes WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Showtime deleted' });
  });
});

module.exports = router;
