const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// This is a mock user - replace with your database logic
const mockUser = {
  email: 'test@example.com',
  password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8rQpZkQwZ0pniS3pSDOMkMt2rt7h2W'
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add your database validation here
    // This is just a mock validation
    if (email !== mockUser.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Add proper password comparison with your database
    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: mockUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
