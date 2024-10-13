require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const verifyToken = require('../middlewares/verify-token');



const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username,email, password } = req.body;
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = User.create({ username: username,email: email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid input', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// User Login
router.post('/login',  async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by username
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid user credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Generate JWT token
        const token = jwt.sign({ email, password}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful",token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
});

// Get User Preferences
router.get('/preferences', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
});

// Update User Preferences
router.put('/preferences', verifyToken, async (req, res) => {
    try {
        const { preferences } = req.body;

        // Find user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Update preferences
        user.preferences = preferences;
        await user.save();

        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
});

// Delete User
router.delete('/delete', verifyToken, async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await user.remove();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
});

module.exports = router;