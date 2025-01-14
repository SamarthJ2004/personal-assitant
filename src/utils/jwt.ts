import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const signToken = (payload : object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, SECRET_KEY);
//   } catch (error) {
//     return null;
//   }
// };