const express = require('express');
const Database = require('../models/database');

const router = express.Router();
const db = new Database();

// GET /api/outfits - Get all outfits
router.get('/', async (req, res) => {
    try {
        const { userId = 1 } = req.query;
        const outfits = await db.getAllOutfits(userId);
        
        res.json({
            success: true,
            data: outfits,
            total: outfits.length
        });
        
    } catch (error) {
        console.error('Error fetching outfits:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch outfits'
        });
    }
});

// POST /api/outfits - Create new outfit
router.post('/', async (req, res) => {
    try {
        const {
            name,
            items,
            rating = 0,
            weather_condition,
            occasion,
            user_id = 1
        } = req.body;
        
        // Validate required fields
        if (!name || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Name and items array are required'
            });
        }
        
        const outfitData = {
            user_id,
            name: name.trim(),
            items,
            rating: parseInt(rating) || 0,
            weather_condition: weather_condition || '',
            occasion: occasion || ''
        };
        
        const newOutfit = await db.addOutfit(outfitData);
        
        // Log outfit creation
        await db.logUsage(user_id, 'outfit_created', { 
            outfit_id: newOutfit.id, 
            outfit_name: name,
            item_count: items.length
        });
        
        res.status(201).json({
            success: true,
            data: newOutfit,
            message: 'Outfit created successfully'
        });
        
    } catch (error) {
        console.error('Error creating outfit:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create outfit'
        });
    }
});

module.exports = router;