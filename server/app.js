const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes and models
const wardrobeRoutes = require('./routes/wardrobe');
const outfitRoutes = require('./routes/outfits');
const analyticsRoutes = require('./routes/analytics');
const sensorRoutes = require('./routes/sensors');
const Database = require('./models/database');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files now served by React development server in frontend folder

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    if (error.message === 'Invalid file type. Only images are allowed.') {
        return res.status(400).json({
            error: error.message
        });
    }
    
    next(error);
});

// API Routes
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sensors', sensorRoutes);

// File upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            message: 'File uploaded successfully',
            filename: req.file.filename,
            url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Weather API simulation
app.get('/api/weather', async (req, res) => {
    try {
        // In a real app, you'd call a weather API like OpenWeatherMap
        const weatherData = {
            temperature: Math.round(15 + Math.random() * 20), // 15-35°C
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
            humidity: Math.round(30 + Math.random() * 50),
            uvIndex: Math.round(1 + Math.random() * 10),
            location: 'Current Location',
            timestamp: new Date().toISOString()
        };
        
        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// AI Recommendations endpoint
app.get('/api/recommendations', async (req, res) => {
    try {
        // Get user preferences and weather data
        const { occasion, weather, userId } = req.query;
        
        // Simulate AI recommendation logic
        const recommendations = [
            {
                id: 1,
                name: 'Smart Casual Professional',
                items: [
                    { type: 'top', name: 'Navy Blazer', color: 'navy' },
                    { type: 'bottom', name: 'Dark Jeans', color: 'dark blue' },
                    { type: 'shoes', name: 'Brown Leather Loafers', color: 'brown' }
                ],
                score: 94,
                suitability: 'Perfect for office meetings',
                colors: ['navy', 'dark blue', 'brown'],
                tags: ['professional', 'versatile', 'classic']
            },
            {
                id: 2,
                name: 'Casual Weekend Comfort',
                items: [
                    { type: 'top', name: 'Cotton T-Shirt', color: 'white' },
                    { type: 'bottom', name: 'Khaki Shorts', color: 'khaki' },
                    { type: 'shoes', name: 'White Sneakers', color: 'white' }
                ],
                score: 89,
                suitability: 'Great for relaxed activities',
                colors: ['white', 'khaki'],
                tags: ['casual', 'comfortable', 'weekend']
            },
            {
                id: 3,
                name: 'Evening Elegant',
                items: [
                    { type: 'top', name: 'Silk Blouse', color: 'cream' },
                    { type: 'bottom', name: 'Black Trousers', color: 'black' },
                    { type: 'shoes', name: 'Heeled Boots', color: 'black' }
                ],
                score: 92,
                suitability: 'Perfect for dinner dates',
                colors: ['cream', 'black'],
                tags: ['elegant', 'evening', 'sophisticated']
            }
        ];
        
        res.json(recommendations);
    } catch (error) {
        console.error('Recommendations API error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send welcome message
    socket.emit('connected', { 
        message: 'Connected to Fit Genie server',
        id: socket.id,
        timestamp: new Date().toISOString()
    });
    
    // Handle sensor data updates
    socket.on('sensor-update', (data) => {
        console.log('Sensor data received:', data);
        // Broadcast to all clients
        io.emit('sensor-data', data);
    });
    
    // Handle wardrobe status updates
    socket.on('wardrobe-status', (data) => {
        console.log('Wardrobe status:', data);
        io.emit('wardrobe-update', data);
    });
    
    // Handle outfit selections
    socket.on('outfit-selected', (data) => {
        console.log('Outfit selected:', data);
        // Update analytics or trigger mirror display
        io.emit('outfit-display', data);
    });
    
    // Handle mirror interactions
    socket.on('mirror-interaction', (data) => {
        console.log('Mirror interaction:', data);
        io.emit('mirror-update', data);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simulate sensor data for demo purposes
function simulateSensorData() {
    const sensorData = {
        temperature: (20 + Math.random() * 10).toFixed(1),
        humidity: (40 + Math.random() * 20).toFixed(0),
        itemsDetected: Math.floor(50 + Math.random() * 20),
        doorOpen: Math.random() > 0.8,
        lastUpdate: new Date().toISOString()
    };
    
    io.emit('sensor-data', sensorData);
}

// Start sensor simulation
setInterval(simulateSensorData, 30000); // Every 30 seconds

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Catch 404 and forward to error handler
app.use('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.status(404).json({ error: 'Frontend is served separately on React dev server' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Fit Genie API server running on port ${PORT}`);
    console.log(`🔌 WebSocket server ready for IoT connections`);
    console.log(`🎯 API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`📱 Frontend: Run 'npm start' in the frontend folder`);
    console.log(`📁 File uploads: http://localhost:${PORT}/uploads`);
});

module.exports = app;