const db = require('../config/database');

exports.submitFeedback = async (req, res) => {
  try {
    const { service_id, user_id, rating, comment } = req.body;
    
    const query = `
      INSERT INTO feedback (service_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [service_id, user_id, rating, comment]);
    
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = `
      SELECT 
        f.id,
        f.service_id,
        f.user_id,
        f.rating,
        f.comment,
        f.created_at,
        s.title as service_title,
        u.full_name as provider_name
      FROM feedback f
      LEFT JOIN services s ON f.service_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;

    console.log('Executing query for user ID:', userId); // Debug log

    const [feedback] = await db.execute(query, [userId]);
    
    console.log('Retrieved feedback:', feedback); // Debug log

    if (!feedback || feedback.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No feedback found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback',
      details: error.message
    });
  }
};