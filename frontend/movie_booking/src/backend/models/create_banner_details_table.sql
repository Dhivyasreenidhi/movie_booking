-- Table for more info details for each banner
CREATE TABLE IF NOT EXISTS banner_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  banner_id INT,
  year VARCHAR(10),
  duration VARCHAR(20),
  rating VARCHAR(10),
  topCast TEXT, -- store as JSON array of strings
  storyLine TEXT,
  FOREIGN KEY (banner_id) REFERENCES homepage_banner(id) ON DELETE CASCADE
);
