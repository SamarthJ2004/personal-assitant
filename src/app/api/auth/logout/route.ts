export default (req, res) => {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
  res.status(200).json({ message: 'Logout successful' });
};