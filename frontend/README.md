# Fit Genie - AI Smart Wardrobe Frontend

A modern React-based frontend for the Fit Genie AI-powered smart wardrobe management system.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and functional components
- **State Management**: Context API with useReducer for predictable state updates
- **Smooth Animations**: Framer Motion for beautiful page transitions and interactions
- **Responsive Design**: Tailwind CSS with mobile-first responsive design
- **Real-time Updates**: Socket.IO integration for live sensor data
- **Glassmorphism UI**: Modern glass-effect design with backdrop blur
- **Smart Routing**: React Router for seamless navigation
- **Comprehensive Pages**: Dashboard, Closet, AI Stylist, Smart Mirror, and Analytics

## 🛠️ Technology Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Modern icon library

## 📦 Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components (Navbar, etc.)
│   └── UI/            # UI components (Notifications, etc.)
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Closet.tsx     # Wardrobe management
│   ├── Stylist.tsx    # AI recommendations
│   ├── Mirror.tsx     # Smart mirror integration
│   └── Analytics.tsx  # Analytics and insights
├── context/           # React Context for state management
├── styles/           # Global styles and Tailwind config
└── types/           # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: `#8B8CFF` (Accent purple)
- **Secondary**: `#FFD580` (Highlight orange)
- **Glass**: `rgba(255, 255, 255, 0.25)` (Glassmorphism)

### Components
- **Glass Cards**: Translucent cards with backdrop blur
- **Buttons**: Primary, secondary, and outline variants
- **Inputs**: Glass-effect form controls
- **Notifications**: Toast-style notifications with animations

## 🔌 Backend Integration

The frontend expects the backend server to be running on `http://localhost:3001`. Make sure to start the backend server before running the frontend.

### API Endpoints
- `GET /api/wardrobe` - Fetch clothing items
- `POST /api/wardrobe` - Add new clothing item
- `PUT /api/wardrobe/:id` - Update clothing item
- `DELETE /api/wardrobe/:id` - Delete clothing item
- `GET /api/weather` - Get weather data
- `GET /api/analytics` - Get analytics data

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🌟 Key Features

### Dashboard
- Weather integration
- AI outfit recommendations
- Quick stats and metrics
- Recent activity feed

### My Closet
- Clothing item grid with search and filtering
- Category-based organization
- Favorite items functionality
- Add new items with camera integration

### AI Stylist
- Personalized outfit recommendations
- Style preference settings
- Weather-based suggestions
- Outfit coordination scoring

### Smart Mirror
- Virtual mirror integration
- Real-time camera feed
- Style analysis and scoring
- Environmental sensor data

### Analytics
- Wardrobe usage statistics
- Sustainability metrics
- Cost per wear analysis
- Trend insights

## 🔧 Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation in `Navbar.tsx`

### State Management
- Use the `useFitGenie` hook to access global state
- Actions are available for common operations
- Real-time updates via Socket.IO

### Styling
- Use Tailwind utility classes
- Custom components in `globals.css`
- Responsive design with mobile-first approach

## 📱 Mobile Responsive

The app is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎭 Animations

Framer Motion provides:
- Page transitions
- Component hover effects
- Loading states
- Notification animations

## 🚦 Getting Started

1. Ensure the backend server is running on port 3001
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000)

The app will automatically reload when you make changes, and you'll see the live clothing items and sensor data if the backend is connected.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Fit Genie smart wardrobe system.