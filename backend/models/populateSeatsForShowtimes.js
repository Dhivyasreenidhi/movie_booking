const pool = require('../config/db');

async function populateSeatsForShowtimes() {
  // Get all showtimes
  const [showtimes] = await pool.query('SELECT id, total_seats FROM showtimes');
  for (const showtime of showtimes) {
    // Check if seats already exist for this showtime
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM seats WHERE showtime_id = ?', [showtime.id]);
    if (existing[0].count > 0) {
      console.log(`Showtime ${showtime.id}: seats already exist, skipping.`);
      continue;
    }
    // Insert seats for this showtime
    const seatRows = [];
    for (let i = 1; i <= showtime.total_seats; i++) {
      seatRows.push([showtime.id, i, 'available']);
    }
    await pool.query('INSERT INTO seats (showtime_id, seat_number, status) VALUES ?', [seatRows]);
    console.log(`Showtime ${showtime.id}: inserted ${showtime.total_seats} seats.`);
  }
  console.log('Done populating seats for all showtimes.');
  process.exit(0);
}

populateSeatsForShowtimes().catch(err => {
  console.error('Error populating seats:', err);
  process.exit(1);
});
