-- Create homepage_banner table for storing banner movies as JSON
CREATE TABLE IF NOT EXISTS homepage_banner (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movies JSON NOT NULL
);
