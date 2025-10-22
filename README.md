# Fit Genie - AI Smart Wardrobe Web Application

A modern, responsive web application for managing your smart wardrobe with AI-powered outfit recommendations, real-time IoT integration, and comprehensive analytics.

## 🌟 Features

### 🎨 **Frontend Features**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glassmorphism UI**: Modern, elegant design with blur effects and transparency
- **Camera Integration**: Native camera access for adding clothing items
- **Interactive Dashboard**: Real-time wardrobe statistics and AI recommendations
- **Drag & Drop Outfit Builder**: Visual outfit creation interface
- **Real-time Analytics**: Usage patterns, sustainability metrics, and insights

### 🔧 **Backend Features**
- **RESTful API**: Complete CRUD operations for wardrobe management
- **Real-time Communication**: WebSocket support for IoT device integration
- **Database Management**: SQLite database with comprehensive data models
- **File Upload**: Secure image upload and storage system
- **Analytics Engine**: Advanced wardrobe analytics and sustainability scoring

### 🏠 **IoT Integration**
- **Sensor Data**: Temperature, humidity, and item detection
- **Smart Mirror Support**: Real-time wardrobe status updates
- **RFID Integration**: Automatic clothing item tracking
- **WebSocket Communication**: Live updates from hardware devices

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic, accessible markup
- **CSS3**: Custom styles with Tailwind CSS
- **JavaScript ES6+**: Modern JavaScript with classes and modules
- **Chart.js**: Data visualization and analytics
- **Lucide Icons**: Beautiful, consistent iconography
- **WebRTC**: Camera access and media handling

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **SQLite**: Lightweight, serverless database
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
Stylin/
├── public/                 # Frontend files
│   ├── css/
│   │   └── styles.css     # Custom CSS with glassmorphism
│   ├── js/
│   │   ├── app.js         # Main application logic
│   │   ├── camera.js      # Camera management
│   │   └── charts.js      # Analytics and charts
│   ├── images/            # Static images
│   └── index.html         # Main HTML file
├── server/                # Backend files
│   ├── routes/            # API routes
│   │   ├── wardrobe.js    # Wardrobe management
│   │   ├── outfits.js     # Outfit management
│   │   ├── analytics.js   # Analytics endpoints
│   │   └── sensors.js     # IoT sensor data
│   ├── models/
│   │   └── database.js    # Database management
│   └── app.js            # Express server
├── data/                 # Database files (auto-created)
├── .env                  # Environment configuration
├── package.json          # Project dependencies
└── README.md            # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- Modern web browser with camera support

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Stylin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
The `.env` file is already configured for development. For production, update the following:
- `NODE_ENV=production`
- `SESSION_SECRET=your-secure-secret`
- `JWT_SECRET=your-jwt-secret`

### 4. Start the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Frontend Only (for testing)
```bash
npm run client
```

#### Full Development (Backend + Frontend)
```bash
npm run dev-full
```

### 5. Access the Application
- **Frontend**: http://localhost:3000 (or the port shown in terminal)
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📱 Usage Guide

### Adding Clothing Items
1. Click the camera button or "Add Item" 
2. Grant camera permissions when prompted
3. Capture a photo of your clothing item
4. The item will be automatically categorized (you can edit details)
5. Save to add it to your virtual wardrobe

### Creating Outfits
1. Navigate to the "AI Stylist" section
2. Use the drag-and-drop outfit builder
3. Drag items from your closet to the outfit zones
4. View the AI coordination score
5. Save successful combinations

### Viewing Analytics
1. Go to the "Analytics" section
2. View usage patterns, color analysis, and sustainability metrics
3. Get personalized recommendations for better wardrobe utilization
4. Track your environmental impact

### Smart Mirror Integration
1. Navigate to "Smart Mirror" section
2. Connect your IoT devices via WebSocket
3. View real-time sensor data
4. Monitor wardrobe conditions and item detection

## 🔧 API Endpoints

### Wardrobe Management
- `GET /api/wardrobe` - Get all wardrobe items
- `POST /api/wardrobe` - Add new clothing item
- `PUT /api/wardrobe/:id` - Update existing item
- `DELETE /api/wardrobe/:id` - Remove item
- `POST /api/wardrobe/:id/wear` - Mark item as worn

### Analytics
- `GET /api/analytics/dashboard` - Comprehensive analytics
- `GET /api/analytics/sustainability` - Sustainability metrics
- `GET /api/wardrobe/stats/usage` - Usage statistics

### Outfits
- `GET /api/outfits` - Get all saved outfits
- `POST /api/outfits` - Create new outfit

### IoT Integration
- `GET /api/sensors` - Latest sensor data
- `POST /api/sensors` - Record sensor reading
- `GET /api/weather` - Weather information

### Utilities
- `POST /api/upload` - Upload images
- `GET /api/health` - Server health check
- `GET /api/recommendations` - AI outfit suggestions

## 🎯 Key Features Explained

### Camera Integration
- **Multi-device Support**: Works on desktop webcams and mobile cameras
- **Front/Back Camera Switching**: Toggle between available cameras
- **Image Capture**: High-quality photo capture for clothing items
- **Permission Handling**: Graceful camera permission requests

### Real-time Updates
- **WebSocket Connection**: Live communication with IoT devices
- **Sensor Monitoring**: Temperature, humidity, and item detection
- **Status Updates**: Real-time wardrobe status in the dashboard

### AI Recommendations
- **Weather-based Suggestions**: Outfits based on current weather
- **Color Coordination**: AI scoring for color combinations
- **Usage Analytics**: Recommendations based on wearing patterns
- **Sustainability Tips**: Eco-friendly wardrobe management advice

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Progressive Enhancement**: Works across all device capabilities
- **Glassmorphism Effects**: Modern visual design with backdrop blur

## 🔒 Security Features

- **Input Validation**: All API inputs are validated and sanitized
- **File Type Restrictions**: Only image files allowed for uploads
- **Size Limits**: Maximum 10MB file upload limit
- **CORS Protection**: Configured cross-origin request handling
- **Error Handling**: Comprehensive error responses without sensitive data exposure

## 🌱 Sustainability Features

- **Usage Tracking**: Monitor how often you wear each item
- **Efficiency Scoring**: Rate your wardrobe utilization
- **Environmental Impact**: Calculate carbon footprint and savings
- **Donation Suggestions**: Identify items for donation
- **Reuse Encouragement**: Promote wearing existing items

## 🔮 Future Enhancements

- **Machine Learning**: Advanced outfit recommendation algorithms
- **Voice Control**: "Hey Genie, what should I wear today?"
- **Social Sharing**: Share outfits with friends
- **Shopping Integration**: Smart purchase recommendations
- **AR Try-On**: Virtual reality clothing trials
- **Weather API**: Real-time weather integration
- **Mobile App**: Native iOS and Android applications

## 🐛 Troubleshooting

### Camera Issues
- **Permission Denied**: Ensure camera permissions are granted in browser settings
- **No Camera Found**: Check if camera is available and not used by other applications
- **Poor Image Quality**: Ensure good lighting when capturing images

### Connection Issues
- **WebSocket Errors**: Check if the server is running on the correct port
- **API Failures**: Verify backend server is accessible at http://localhost:3001
- **Database Errors**: Ensure write permissions in the project directory

### Performance Issues
- **Slow Loading**: Check network connection and reduce image sizes
- **Memory Issues**: Clear browser cache and restart the application
- **Browser Compatibility**: Use modern browsers (Chrome 80+, Firefox 75+, Safari 13+)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Fit Genie** - Making wardrobe management intelligent, sustainable, and effortless! 🌟👗👔