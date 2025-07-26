import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const secret = 'pmrUBrwglq2Myq5Q+4xdCMf4ebb8aD4CR2IReMPpYO8=';

export const login = async (req, res) => {
  const { emailOrPhone } = req.body;

  const [rows] = await db.query('SELECT * FROM users WHERE email = ? OR phone = ?', [emailOrPhone, emailOrPhone]);
  const user = rows[0];

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Generate token
  const token = jwt.sign({ id: user.id, emailOrPhone }, secret, { expiresIn: '1h' });
  res.json({ token });
};

export const protectedRoute = (req, res) => {
  res.send('Access granted to protected route');
};
