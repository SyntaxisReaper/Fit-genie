import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import PWAPrompt from './components/PWAPrompt';
import Dashboard from './pages/Dashboard';
import Closet from './pages/Closet';
import Stylist from './pages/Stylist';
import Mirror from './pages/Mirror';
import Analytics from './pages/Analytics';
import SharedOutfit from './pages/SharedOutfit';
import Contact from './pages/Contact';
import SimpleFooter from './components/SimpleFooter';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Navbar />
          <PWAPrompt />
          
          {/* Main content area */}
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/closet" element={<Closet />} />
              <Route path="/stylist" element={<Stylist />} />
              <Route path="/mirror" element={<Mirror />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/shared/:shareId" element={<SharedOutfit />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <SimpleFooter />
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
