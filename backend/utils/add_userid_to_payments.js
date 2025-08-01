const pool = require('../config/db');

async function addUserIdColumnAndUpdatePayments() {
  // 1. Add user_id column if not exists
  try {
    await pool.query('ALTER TABLE payments ADD COLUMN user_id INT NOT NULL DEFAULT 1');
    console.log('user_id column added to payments table.');
  } catch (err) {
    if (err.message.includes('Duplicate column name')) {
      console.log('user_id column already exists.');
    } else {
      console.error('Error adding user_id column:', err.message);
      return;
    }
  }

  // 2. Update all existing payments to user_id = 1 (or your logic)
  try {
    await pool.query('UPDATE payments SET user_id = 1 WHERE user_id IS NULL OR user_id = 0');
    console.log('All existing payments updated to user_id = 1.');
  } catch (err) {
    console.error('Error updating payments:', err.message);
  }
}

addUserIdColumnAndUpdatePayments();
