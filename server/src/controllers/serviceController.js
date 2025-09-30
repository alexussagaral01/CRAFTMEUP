const pool = require('../config/database');

exports.getAllServices = async (req, res) => {
    try {
        const [services] = await pool.execute(`
            SELECT s.*, u.full_name as user_full_name, u.id as user_id 
            FROM services s
            JOIN users u ON s.user_id = u.id
            WHERE s.status = "active"
        `);
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Failed to fetch services' });
    }
};

exports.createService = async (req, res) => {
    try {
        const { userId, title, description, price, availability } = req.body;
        
        const [result] = await pool.execute(
            `INSERT INTO services (user_id, title, description, price, availability) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, title, description, price, availability]
        );

        res.status(201).json({
            message: 'Service created successfully',
            serviceId: result.insertId
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Failed to create service' });
    }
};

exports.getUserServices = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const [services] = await pool.execute(
            'SELECT * FROM services WHERE user_id = ?',
            [userId]
        );
        
        res.json(services);
    } catch (error) {
        console.error('Error fetching user services:', error);
        res.status(500).json({ message: 'Failed to fetch services' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, price, availability, status } = req.body;

        const [result] = await pool.execute(
            `UPDATE services 
             SET title = ?, description = ?, price = ?, 
                 availability = ?, status = ?
             WHERE id = ?`,
            [title, description, price, availability, status, serviceId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Failed to update service' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM services WHERE id = ?',
            [serviceId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Failed to delete service' });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { userId, serviceId, status } = req.body;
        
        const [result] = await pool.execute(
            `INSERT INTO transactions (user_id, service_id, type, status, amount) 
             SELECT ?, ?, 'booking', ?, price
             FROM services WHERE id = ?`,
            [userId, serviceId, status || 'pending', serviceId]
        );

        const [booking] = await pool.execute(
            `SELECT t.*, s.title, s.description, s.price, u.full_name as provider_name
             FROM transactions t 
             JOIN services s ON t.service_id = s.id 
             JOIN users u ON s.user_id = u.id 
             WHERE t.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Booking created successfully',
            booking: booking[0]
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get bookings for both service provider and requester
        const [bookings] = await pool.execute(`
            SELECT 
                t.*,
                s.title as service_title,
                s.description,
                s.price,
                s.availability,
                s.user_id as provider_id,
                provider.full_name as provider_name,
                requester.full_name as requester_name,
                CASE 
                    WHEN s.user_id = ? THEN true
                    ELSE false
                END as is_provider
            FROM transactions t
            JOIN services s ON t.service_id = s.id
            JOIN users provider ON s.user_id = provider.id
            JOIN users requester ON t.user_id = requester.id
            WHERE t.user_id = ? OR s.user_id = ?
            ORDER BY t.created_at DESC
        `, [userId, userId, userId]);

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get transactions where user is either the learner or provider
        const [transactions] = await pool.execute(`
            SELECT 
                t.*,
                s.title as service_title,
                s.description as service_description,
                s.user_id as provider_id,
                provider.full_name as provider_name,
                learner.full_name as learner_name,
                CASE 
                    WHEN s.user_id = ? THEN true
                    ELSE false
                END as is_provider
            FROM transactions t
            JOIN services s ON t.service_id = s.id
            JOIN users provider ON s.user_id = provider.id
            JOIN users learner ON t.user_id = learner.id
            WHERE t.user_id = ? OR s.user_id = ?
            ORDER BY t.created_at DESC
        `, [userId, userId, userId]);

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'ongoing', 'ready', 'completed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update transaction status
        await pool.execute(
            'UPDATE transactions SET status = ? WHERE id = ?',
            [status, id]
        );

        // Get updated transaction
        const [transactions] = await pool.execute(`
            SELECT t.*, 
                s.title as service_title,
                s.description,
                s.user_id as provider_id,
                provider.full_name as provider_name,
                requester.full_name as requester_name,
                CASE 
                    WHEN s.user_id = t.user_id THEN true
                    ELSE false
                END as is_provider
            FROM transactions t
            JOIN services s ON t.service_id = s.id
            JOIN users provider ON s.user_id = provider.id
            JOIN users requester ON t.user_id = requester.id
            WHERE t.id = ?
        `, [id]);

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({
            message: 'Status updated successfully',
            transaction: transactions[0]
        });

    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

exports.createFeedback = async (req, res) => {
    try {
        const { serviceId, userId, rating, comment } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO feedback (service_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [serviceId, userId, rating, comment]
        );

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedbackId: result.insertId
        });
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
};

exports.getWalletBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const [wallet] = await pool.execute(
            'SELECT balance FROM wallet WHERE user_id = ?',
            [userId]
        );

        if (wallet.length === 0) {
            // Create wallet if it doesn't exist
            await pool.execute(
                'INSERT INTO wallet (user_id, balance) VALUES (?, 50.00)',
                [userId]
            );
            return res.json({ balance: 50.00 });
        }

        res.json({ balance: parseFloat(wallet[0].balance) });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ message: 'Failed to fetch wallet balance' });
    }
};

exports.transferFunds = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { fromUserId, toUserId, amount, bookingId } = req.body;
        
        console.log('Transfer request:', { fromUserId, toUserId, amount, bookingId });

        // Validate inputs
        if (!fromUserId || !toUserId || !amount || !bookingId) {
            connection.release();
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { fromUserId, toUserId, amount, bookingId }
            });
        }

        // Validate user IDs are different
        if (parseInt(fromUserId) === parseInt(toUserId)) {
            connection.release();
            return res.status(400).json({ message: 'Cannot transfer to yourself' });
        }

        // Parse amount to ensure it's a number
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            connection.release();
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Start transaction
        await connection.beginTransaction();

        // Check if learner has sufficient balance
        const [learnerWallet] = await connection.execute(
            'SELECT balance FROM wallet WHERE user_id = ?',
            [fromUserId]
        );

        console.log('Learner wallet:', learnerWallet[0]);

        if (learnerWallet.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: 'Learner wallet not found' });
        }

        const currentBalance = parseFloat(learnerWallet[0].balance);
        if (currentBalance < transferAmount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ 
                message: `Insufficient balance. Required: ${transferAmount}, Available: ${currentBalance}`
            });
        }

        // Ensure provider wallet exists
        const [providerWallet] = await connection.execute(
            'SELECT * FROM wallet WHERE user_id = ?',
            [toUserId]
        );

        if (providerWallet.length === 0) {
            await connection.execute(
                'INSERT INTO wallet (user_id, balance) VALUES (?, 50.00)',
                [toUserId]
            );
        }

        // Deduct from learner's wallet
        const [deductResult] = await connection.execute(
            'UPDATE wallet SET balance = balance - ? WHERE user_id = ?',
            [transferAmount, fromUserId]
        );

        console.log('Deduct result:', deductResult);

        // Add to provider's wallet
        const [addResult] = await connection.execute(
            'UPDATE wallet SET balance = balance + ? WHERE user_id = ?',
            [transferAmount, toUserId]
        );

        console.log('Add result:', addResult);

        // Update booking status to completed
        const [updateResult] = await connection.execute(
            'UPDATE transactions SET status = ? WHERE id = ?',
            ['completed', bookingId]
        );

        console.log('Update booking result:', updateResult);

        // Commit transaction
        await connection.commit();

        // Get updated wallet balance
        const [updatedWallet] = await connection.execute(
            'SELECT balance FROM wallet WHERE user_id = ?',
            [fromUserId]
        );

        connection.release();

        res.json({
            message: 'Payment completed successfully',
            newBalance: parseFloat(updatedWallet[0].balance)
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error('Transfer error:', error);
        res.status(500).json({ 
            message: 'Failed to process payment',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};