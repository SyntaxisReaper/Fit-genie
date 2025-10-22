const express = require('express');
const Database = require('../models/database');

const router = express.Router();
const db = new Database();

// GET /api/sensors - Get latest sensor data
router.get('/', async (req, res) => {
    try {
        const sensorData = await db.getLatestSensorData();
        
        res.json({
            success: true,
            data: sensorData || {
                temperature: 22,
                humidity: 45,
                items_detected: 52,
                door_status: 'closed',
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sensor data'
        });
    }
});

// POST /api/sensors - Add new sensor reading
router.post('/', async (req, res) => {
    try {
        const {
            wardrobe_id = 'main',
            temperature,
            humidity,
            items_detected,
            door_status = 'closed'
        } = req.body;
        
        const sensorData = {
            wardrobe_id,
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            items_detected: parseInt(items_detected),
            door_status
        };
        
        const result = await db.addSensorData(sensorData);
        
        res.status(201).json({
            success: true,
            data: result,
            message: 'Sensor data recorded successfully'
        });
        
    } catch (error) {
        console.error('Error recording sensor data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record sensor data'
        });
    }
});

module.exports = router;