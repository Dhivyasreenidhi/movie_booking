CREATE TABLE offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  discountType ENUM('percentage', 'fixed') NOT NULL,
  discountValue DECIMAL(10,2) NOT NULL,
  minPurchase DECIMAL(10,2),
  validFrom DATE NOT NULL,
  validTo DATE NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  applicableOn ENUM('all', 'specific', 'category') NOT NULL,
  categories TEXT,
  maxDiscount DECIMAL(10,2),
  usageLimit INT,
  usedCount INT DEFAULT 0
);
