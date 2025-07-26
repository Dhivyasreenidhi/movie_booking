import jwt from 'jsonwebtoken';

const secret = 'pmrUBrwglq2Myq5Q+4xdCMf4ebb8aD4CR2IReMPpYO8=';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized!' });

    req.userId = decoded.id;
    next();
  });
};
