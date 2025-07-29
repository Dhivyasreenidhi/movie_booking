CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  seat_number INT NOT NULL,
  status ENUM('available', 'booked') DEFAULT 'available',
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);
