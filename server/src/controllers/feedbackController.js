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
        f.*,
        s.title as service_title,
        u.name as provider_name
      FROM feedback f
      JOIN services s ON f.service_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE f.user_id = ?
    `;
    
    const [feedbacks] = await db.execute(query, [userId]);
    res.json({ data: feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};