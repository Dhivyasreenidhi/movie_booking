-- SQL to create the movies table for manage movies
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(255),
  releaseDate DATE,
  duration INT,
  director VARCHAR(255),
  cast TEXT,
  language VARCHAR(100),
  posterUrl VARCHAR(500),
  trailerUrl VARCHAR(500),
  userRating FLOAT DEFAULT 0,
  votes INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
