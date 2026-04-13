'use strict';

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');
const User = require('../models/User');

const router = express.Router();

// POST /save: Save or update user progress
router.post('/save', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in token
    const { progressData } = req.body;
    try {
        // Upsert user progress
        await Progress.findOneAndUpdate({ user: userId }, { progress: progressData }, { upsert: true, new: true });
        // Upsert user profile
        await User.findOneAndUpdate({ _id: userId }, { lastUpdated: new Date() }, { upsert: true, new: true });
        res.status(200).json({ message: 'Progress saved successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress', error });
    }
});

// GET /load: Load user progress or create empty record
router.get('/load', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in token
    try {
        const userProgress = await Progress.findOne({ user: userId }) || { progress: {} }; // Creates empty record if new user
        res.status(200).json(userProgress);
    } catch (error) {
        res.status(500).json({ message: 'Error loading progress', error });
    }
});

// GET /user: Retrieve user profile info
router.get('/user', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in token
    try {
        const userProfile = await User.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
});

module.exports = router;