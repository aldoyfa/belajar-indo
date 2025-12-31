module.exports = (req, res) => {
  res.status(200).json({ status: 'OK', message: 'BelajarIndo API is running (vercel function)', timestamp: Date.now() });
};
