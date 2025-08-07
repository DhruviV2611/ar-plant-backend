const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        message: 'Invalid request body',
        error: 'Request body must be a valid JSON object'
      });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        message: 'Invalid email',
        error: 'Email is required and must be a string'
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Invalid password',
        error: 'Password is required and must be a string'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
        error: 'Please provide a valid email address'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ message: 'User registered successfully', token, userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // 1. Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate only accessToken
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    // ✅ Do not generate or store refreshToken
    // const refreshToken = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_REFRESH_SECRET,
    //   { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    // );

    res.json({
      token: accessToken,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};


exports.updateUserProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(updated);
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.logout = async (req, res) => {
  const { userId } = req.body;
  await User.findByIdAndUpdate(userId, { refreshToken: '' });
  res.json({ message: 'Logged out successfully' });
};