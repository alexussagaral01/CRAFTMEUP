const db = require('../config/database');

exports.submitReport = async (req, res) => {
  try {
    const { reported_user_id, reporter_id, reason, description } = req.body;
    
    const query = `
      INSERT INTO reports 
      (reported_user_id, reporter_id, reason, description)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      reported_user_id,
      reporter_id,
      reason,
      description
    ]);
    
    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Report submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.*,
        u1.name as reported_user_name,
        u2.name as reporter_name
      FROM reports r
      LEFT JOIN users u1 ON r.reported_user_id = u1.id
      LEFT JOIN users u2 ON r.reporter_id = u2.id
      ORDER BY r.created_at DESC
    `;
    
    const [reports] = await db.execute(query);
    console.log('Reports fetched from DB:', reports); // Debug log
    
    if (!reports || !Array.isArray(reports)) {
      throw new Error('Invalid data format from database');
    }

    // Transform dates to ISO strings for consistent formatting
    const formattedReports = reports.map(report => ({
      ...report,
      created_at: new Date(report.created_at).toISOString(),
      updated_at: report.updated_at ? new Date(report.updated_at).toISOString() : null,
      status: report.status || 'pending' // Provide default status if null
    }));

    res.json(formattedReports);
  } catch (error) {
    console.error('Error in getAllReports:', error);
    res.status(500).json({ 
      error: 'Failed to get reports',
      details: error.message 
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const query = `
      UPDATE reports
      SET status = ?
      WHERE id = ?
    `;
    
    await db.execute(query, [status, id]);
    res.json({ message: 'Report status updated successfully' });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
};