const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'craftmeup'
});

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        course: user.course,
        year: user.year,
        verified: user.verification_status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    console.log('Files received:', req.files);

    const { 
      fullName, 
      email, 
      password,
      course,
      year,
      role 
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['fullName', 'email', 'password', 'role']
      });
    }

    // Update file paths to use URL-friendly format
    const studentIdFile = req.files?.studentId ? 
      '/uploads/' + path.basename(req.files.studentId[0].path) : null;
    const studyLoadFile = req.files?.studyLoad ? 
      '/uploads/' + path.basename(req.files.studyLoad[0].path) : null;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Insert new user with file paths
      const [result] = await pool.execute(
        `INSERT INTO users (
          full_name, email, password, course, year, role, 
          student_id_file, study_load_file
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fullName, email, hashedPassword, course || null, year || null, role,
          studentIdFile, studyLoadFile
        ]
      );

      const token = jwt.sign(
        { userId: result.insertId, email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: result.insertId,
          email,
          fullName,
          role,
          course,
          year
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        message: 'Database error during registration',
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// New controller methods

exports.getUnverifiedUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, full_name, email, course, year, student_id_file, study_load_file FROM users WHERE verified = 0'
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching unverified users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE users SET verified = ?, verification_status = ? WHERE id = ?',
      [status === 'approved' ? 1 : 0, status, id]
    );

    res.json({ message: 'User verification status updated' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token in database
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
      [resetToken, user[0].id]
    );

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({ 
      message: 'Password reset token generated',
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const [user] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user[0].id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, course, year } = req.body;

    // Update user data
    await pool.execute(
      `UPDATE users 
       SET full_name = ?, course = ?, year = ?
       WHERE id = ?`,
      [full_name, course, year, id]
    );

    // Fetch updated user data
    const [users] = await pool.execute(
      `SELECT id, full_name, email, course, year, role, 
              verified, verification_status, profile_image
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      ...users[0],
      verified: users[0].verified === 1
    };

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.execute(
      `SELECT id, full_name, email, course, year, role, 
              verified, verification_status, profile_image
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      ...users[0],
      verified: users[0].verified === 1
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

exports.updateProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photoPath = req.photoPath;

    if (!photoPath) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    // Update user profile photo
    await pool.execute(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [photoPath, id]
    );

    // Get updated user data including the new photo path
    const [updatedUser] = await pool.execute(
      'SELECT id, email, full_name, course, year, role, verified, verification_status, profile_image FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Profile photo updated successfully',
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        fullName: updatedUser[0].full_name,
        course: updatedUser[0].course,
        year: updatedUser[0].year,
        role: updatedUser[0].role,
        verified: updatedUser[0].verified,
        verification_status: updatedUser[0].verification_status,
        profileImage: updatedUser[0].profile_image
      }
    });
  } catch (error) {
    console.error('Profile photo update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In server/src/controllers/authController.js

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const [user] = await pool.execute(
      'SELECT id, full_name, role, email FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};