import React, { useState, useRef, useEffect } from 'react';
import apiService from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { useTouchGestures, useMobileCamera, useVibration } from '../hooks/useTouchGestures';
import { useBodyAnalysis } from '../hooks/useBodyAnalysis';
import { useGestureRecognition } from '../hooks/useGestureRecognition';
import TestShareModal from '../components/TestShareModal';

const Mirror = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [mirrorMode, setMirrorMode] = useState('virtual-try-on');
  const [stream, setStream] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [aiSuggestions] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bodyMeasurements, setBodyMeasurements] = useState(null);
  const [outfitOverlay, setOutfitOverlay] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const poseCanvasRef = useRef(null);
  const gestureCanvasRef = useRef(null);
  const mirrorContainerRef = useRef(null);
  
  // Gesture control state
  const [gestureControlEnabled, setGestureControlEnabled] = useState(false);
  const [lastGestureAction, setLastGestureAction] = useState(null);
  
  // Social sharing state
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPhotoBlob] = useState(null);
  const { showSuccess, showError, showInfo } = useNotification();
  
  // Mobile and gesture features
  const { isMobile, cameraFacing, supportsCameraSwitch, switchCamera, getMobileConstraints } = useMobileCamera();
  const gestures = useTouchGestures(mirrorContainerRef);
  const { vibrate, patterns } = useVibration();
  
  // AI Body Analysis
  const {
    isModelLoaded,
    isAnalyzing: isAIAnalyzing,
    poseData,
    bodyMeasurements: aiBodyMeasurements,
    analyzeVideo,
    drawPoseOverlay
  } = useBodyAnalysis();
  
  // Gesture Recognition
  const {
    isHandsLoaded,
    detectedGesture,
    handLandmarks,
    gestureConfidence,
    startGestureRecognition,
    stopGestureRecognition,
    drawHandOverlay,
    getGestureAction
  } = useGestureRecognition();

  const [outfitsToTry, setOutfitsToTry] = useState([
    {
      id: 1,
      name: 'Business Casual',
      items: ['Navy Blazer', 'White Shirt', 'Dark Jeans'],
      thumbnail: 'https://via.placeholder.com/120x150/1e40af/ffffff?text=Business+Casual',
      weatherSuitable: true,
      confidence: 92
    },
    {
      id: 2,
      name: 'Weekend Comfort',
      items: ['Casual T-shirt', 'Blue Jeans', 'Sneakers'],
      thumbnail: 'https://via.placeholder.com/120x150/059669/ffffff?text=Weekend',
      weatherSuitable: true,
      confidence: 88
    },
    {
      id: 3,
      name: 'Date Night',
      items: ['Red Dress', 'Black Heels', 'Gold Accessories'],
      thumbnail: 'https://via.placeholder.com/120x150/dc2626/ffffff?text=Date+Night',
      weatherSuitable: false,
      confidence: 95
    },
    {
      id: 4,
      name: 'Gym Ready',
      items: ['Sports Bra', 'Leggings', 'Running Shoes'],
      thumbnail: 'https://via.placeholder.com/120x150/7c3aed/ffffff?text=Gym',
      weatherSuitable: true,
      confidence: 90
    }
  ]);

  const mirrorModes = [
    { id: 'virtual-try-on', name: 'Virtual Try-On', icon: '👗' },
    { id: 'fit-analysis', name: 'Fit Analysis', icon: '📐' },
    { id: 'color-match', name: 'Color Matching', icon: '🎨' },
    { id: 'style-tips', name: 'Style Tips', icon: '💡' }
  ];

  const sensorData = [
    { name: 'Camera', status: 'connected', icon: '📷' },
    { name: 'Depth Sensor', status: 'connected', icon: '📡' },
    { name: 'Motion Detector', status: 'active', icon: '🏃' },
    { name: 'Color Sensor', status: 'calibrated', icon: '🌈' }
  ];

  // Camera access functions with mobile optimization
  const startCamera = async () => {
    try {
      const constraints = getMobileConstraints();
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(`Unable to access camera: ${error.message}. Please check permissions.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const takePhoto = (openShareModal = false) => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    // Add outfit overlay if active
    if (selectedOutfit && outfitOverlay) {
      drawOutfitOverlay(context, video.videoWidth, video.videoHeight);
    }
    
    // Convert to blob and handle
    canvas.toBlob((blob) => {
      setCurrentPhotoBlob(blob);
      
      if (openShareModal && selectedOutfit) {
        // Open share modal instead of auto-downloading
        setShowShareModal(true);
        showSuccess('Photo captured! Ready to share.');
      } else {
        // Original download behavior
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outfit-photo-${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        
        showSuccess('Photo saved with outfit overlay!');
      }
      
      // Save to session history
      saveToSessionHistory({
        outfit: selectedOutfit,
        timestamp: new Date(),
        photoUrl: blob ? URL.createObjectURL(blob) : null,
        method: openShareModal ? 'share' : 'download'
      });
    }, 'image/jpeg', 0.8);
  };

  // Advanced AI and AR Features
  const loadWeatherData = async () => {
    try {
      const weather = await apiService.getCurrentWeather();
      setWeatherData(weather);
      
      // Update outfit suggestions based on weather
      updateWeatherBasedSuggestions(weather);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const loadAISuggestions = async () => {
    try {
      const suggestions = await apiService.generateOutfitRecommendations({
        occasion: 'casual',
        weather: weatherData?.condition || 'sunny'
      });
      setAiSuggestions(suggestions);
      setOutfitsToTry(prev => [...prev, ...suggestions.slice(0, 2)]);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    }
  };

  const analyzeBodyMeasurements = async () => {
    if (!videoRef.current || !isModelLoaded) {
      showError('AI models not loaded. Please wait and try again.');
      return;
    }
    
    setIsAnalyzing(true);
    showInfo('Running AI body analysis...');
    vibrate(patterns.tap);
    
    try {
      const analysisResult = await analyzeVideo(videoRef.current);
      
      if (analysisResult && analysisResult.measurements) {
        if (analysisResult.measurements.error) {
          showError(analysisResult.measurements.error);
          setBodyMeasurements(null);
        } else {
          setBodyMeasurements(analysisResult.measurements);
          showSuccess(`Body analysis complete! Confidence: ${analysisResult.measurements.confidence}%`);
          vibrate(patterns.success);
          
          // Draw pose overlay
          if (poseCanvasRef.current && analysisResult.pose) {
            drawPoseOverlay(poseCanvasRef.current, analysisResult.pose, videoRef.current);
          }
        }
      } else {
        showError('Could not detect pose. Please ensure your full body is visible.');
        setBodyMeasurements(null);
      }
    } catch (error) {
      console.error('Body analysis error:', error);
      showError('Analysis failed. Please try again.');
      setBodyMeasurements(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const drawOutfitOverlay = (context, width, height) => {
    if (!selectedOutfit || !outfitOverlay) return;
    
    // Simple overlay simulation - in real app would use proper AR positioning
    context.save();
    context.globalAlpha = 0.7;
    
    // Draw outfit items overlay
    const overlayWidth = width * 0.3;
    const overlayHeight = height * 0.5;
    const overlayX = width * 0.35;
    const overlayY = height * 0.25;
    
    // Create gradient overlay
    const gradient = context.createLinearGradient(overlayX, overlayY, overlayX, overlayY + overlayHeight);
    gradient.addColorStop(0, 'rgba(139, 69, 19, 0.3)'); // Brown for tops
    gradient.addColorStop(0.6, 'rgba(25, 25, 112, 0.3)'); // Navy for bottoms
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)'); // Black for shoes
    
    context.fillStyle = gradient;
    context.fillRect(overlayX, overlayY, overlayWidth, overlayHeight);
    
    // Add outfit text
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(selectedOutfit.name, overlayX + overlayWidth/2, overlayY - 10);
    
    context.restore();
  };

  const updateWeatherBasedSuggestions = (weather) => {
    setOutfitsToTry(prev => prev.map(outfit => ({
      ...outfit,
      weatherSuitable: checkWeatherSuitability(outfit, weather)
    })));
  };

  const checkWeatherSuitability = (outfit, weather) => {
    if (!weather) return true;
    
    const temp = weather.temperature || 20;
    const condition = weather.condition?.toLowerCase() || 'sunny';
    
    // Convert items array to string for checking
    const itemsText = Array.isArray(outfit.items) ? outfit.items.join(' ') : outfit.items || '';
    
    // Simple weather logic
    if (temp < 15 && itemsText.includes('Dress')) return false;
    if (temp > 25 && itemsText.includes('Blazer')) return false;
    if (condition.includes('rain') && itemsText.includes('Leather')) return false;
    
    return true;
  };

  const selectOutfit = (outfit) => {
    setSelectedOutfit(outfit);
    setOutfitOverlay(outfit);
    showInfo(`Selected ${outfit.name} - ${outfit.confidence}% match`);
    
    // Save to session history
    saveToSessionHistory({
      outfit,
      timestamp: new Date(),
      action: 'selected'
    });
  };

  const saveToSessionHistory = (entry) => {
    setSessionHistory(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const startMirrorSession = async () => {
    showInfo('Starting Smart Mirror session...');
    vibrate(patterns.tap);
    await loadWeatherData();
    await loadAISuggestions();
    startCamera();
  };

  const handleCameraSwitch = () => {
    if (supportsCameraSwitch) {
      const newFacing = switchCamera();
      stopCamera();
      setTimeout(() => startCamera(), 100);
      showInfo(`Switched to ${newFacing === 'user' ? 'front' : 'back'} camera`);
      vibrate(patterns.success);
    }
  };
  
  // Handle gesture-based actions
  const handleGestureAction = (gesture) => {
    const action = getGestureAction(gesture);
    if (!action || !gestureControlEnabled) return;
    
    setLastGestureAction(action);
    vibrate(patterns.tap);
    
    switch (action) {
      case 'SELECT':
        // Select current outfit or trigger analysis
        if (mirrorMode === 'virtual-try-on' && outfitsToTry.length > 0) {
          const randomOutfit = outfitsToTry[Math.floor(Math.random() * outfitsToTry.length)];
          selectOutfit(randomOutfit);
          showSuccess(`Selected ${randomOutfit.name} via gesture!`);
        } else if (mirrorMode === 'fit-analysis') {
          analyzeBodyMeasurements();
        }
        break;
        
      case 'NEXT':
        // Next outfit
        if (outfitsToTry.length > 0) {
          const currentIndex = selectedOutfit ? 
            outfitsToTry.findIndex(o => o.id === selectedOutfit.id) : -1;
          const nextIndex = (currentIndex + 1) % outfitsToTry.length;
          selectOutfit(outfitsToTry[nextIndex]);
          showInfo('Next outfit via gesture');
        }
        break;
        
      case 'BACK':
        // Previous outfit
        if (outfitsToTry.length > 0) {
          const currentIndex = selectedOutfit ? 
            outfitsToTry.findIndex(o => o.id === selectedOutfit.id) : 0;
          const prevIndex = (currentIndex - 1 + outfitsToTry.length) % outfitsToTry.length;
          selectOutfit(outfitsToTry[prevIndex]);
          showInfo('Previous outfit via gesture');
        }
        break;
        
      case 'PHOTO':
        // Take photo with share option
        if (selectedOutfit) {
          takePhoto(true); // Open share modal
          showSuccess('Photo captured for sharing!');
        }
        break;
        
      case 'APPROVE':
        // Save current look
        if (selectedOutfit) {
          saveToSessionHistory({
            outfit: selectedOutfit,
            timestamp: new Date(),
            action: 'approved',
            method: 'gesture'
          });
          showSuccess(`${selectedOutfit.name} saved to favorites!`);
        }
        break;
        
      case 'REJECT':
        // Remove current outfit
        setSelectedOutfit(null);
        setOutfitOverlay(null);
        showInfo('Outfit removed via gesture');
        break;
        
      default:
        break;
    }
    
    // Clear action after a delay
    setTimeout(() => setLastGestureAction(null), 2000);
  };
  
  // Toggle gesture controls
  const toggleGestureControls = async () => {
    if (gestureControlEnabled) {
      stopGestureRecognition();
      setGestureControlEnabled(false);
      showInfo('Gesture controls disabled');
    } else {
      if (videoRef.current && isHandsLoaded) {
        await startGestureRecognition(videoRef.current);
        setGestureControlEnabled(true);
        showSuccess('Gesture controls enabled! Wave to start.');
      } else {
        showError('Camera or gesture models not ready');
      }
    }
  };

  // Set video stream when both stream and video element are available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      
      const videoElement = videoRef.current;
      
      const handleLoadedMetadata = () => {
        videoElement.play()
          .catch(e => console.error('Error playing video:', e));
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Cleanup function
      return () => {
        if (videoElement) {
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [stream]);

  // Initialize mirror session on mount
  useEffect(() => {
    loadWeatherData();
    console.log('Mirror component loaded', { showSuccess, showError, showInfo });
  }, []);

  // Update outfit overlay when selected outfit changes
  useEffect(() => {
    if (selectedOutfit && overlayCanvasRef.current && videoRef.current) {
      drawOutfitOverlayOnCanvas();
    }
  }, [selectedOutfit, outfitOverlay]);

  // Draw outfit overlay on dedicated canvas
  const drawOutfitOverlayOnCanvas = () => {
    if (!overlayCanvasRef.current || !videoRef.current || !selectedOutfit) return;
    
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Clear previous overlay
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the outfit overlay
    drawOutfitOverlay(context, canvas.width, canvas.height);
  };

  // Handle gesture interactions
  useEffect(() => {
    if (gestures.swipeDirection) {
      vibrate(patterns.tap);
      
      switch (gestures.swipeDirection) {
        case 'left':
          // Next outfit
          const currentIndex = outfitsToTry.findIndex(o => o.id === selectedOutfit?.id);
          const nextIndex = (currentIndex + 1) % outfitsToTry.length;
          selectOutfit(outfitsToTry[nextIndex]);
          showInfo('Next outfit');
          break;
        case 'right':
          // Previous outfit
          const currentIdx = outfitsToTry.findIndex(o => o.id === selectedOutfit?.id);
          const prevIdx = (currentIdx - 1 + outfitsToTry.length) % outfitsToTry.length;
          selectOutfit(outfitsToTry[prevIdx]);
          showInfo('Previous outfit');
          break;
        case 'up':
          // Take photo
          if (selectedOutfit) {
            takePhoto();
          }
          break;
        case 'down':
          // Switch camera (if mobile)
          if (isMobile && supportsCameraSwitch) {
            handleCameraSwitch();
          }
          break;
        default:
          break;
      }
    }
  }, [gestures.swipeDirection]);

  useEffect(() => {
    if (gestures.doubleTap) {
      vibrate(patterns.doubleTap);
      if (isCameraOn) {
        takePhoto();
      } else {
        startCamera();
      }
    }
  }, [gestures.doubleTap]);

  // Handle detected gestures
  useEffect(() => {
    if (detectedGesture && gestureControlEnabled) {
      handleGestureAction(detectedGesture);
    }
  }, [detectedGesture, gestureControlEnabled]);
  
  // Update hand overlay when hand landmarks change
  useEffect(() => {
    if (handLandmarks && gestureCanvasRef.current && gestureControlEnabled) {
      drawHandOverlay(gestureCanvasRef.current, handLandmarks);
    }
  }, [handLandmarks, gestureControlEnabled, drawHandOverlay]);
  
  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopGestureRecognition();
    };
  }, [stream, stopGestureRecognition]);

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Smart Mirror 🪞</h1>
          <p className="text-gray-300">Virtual try-on and style analysis powered by AI</p>
        </div>

        {/* Status & Weather Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sensor Status */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {sensorData.map((sensor) => (
                <div key={sensor.name} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <span className="text-lg">{sensor.icon}</span>
                  <div>
                    <div className="text-white font-medium text-xs">{sensor.name}</div>
                    <div className="text-green-400 text-xs capitalize">{sensor.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather & Context */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-white">Smart Context</h2>
              <button 
                onClick={loadWeatherData}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs transition-all"
              >
                🔄 Refresh
              </button>
            </div>
            {weatherData ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌤️</span>
                  <div>
                    <div className="text-white font-medium">{weatherData.temperature}°C, {weatherData.condition}</div>
                    <div className="text-gray-200 text-xs">Outfit suggestions updated</div>
                  </div>
                </div>
                
                {/* AI Model Status */}
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-white text-xs font-medium mb-1 flex items-center space-x-2">
                    <span>🤖</span>
                    <span>AI Models</span>
                    <div className={`w-2 h-2 rounded-full ${
                      isModelLoaded ? 'bg-green-400 animate-pulse' : 'bg-orange-400'
                    }`}></div>
                  </div>
                  <div className="text-gray-200 text-xs">
                    Status: {isModelLoaded ? 'Ready for analysis' : 'Loading...'}
                  </div>
                  {isAIAnalyzing && (
                    <div className="text-blue-400 text-xs mt-1 flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-2 w-2 border-b border-blue-400"></div>
                      <span>Analyzing pose...</span>
                    </div>
                  )}
                </div>
                {(bodyMeasurements || aiBodyMeasurements) && (
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="text-white text-xs font-medium mb-1 flex items-center space-x-2">
                      <span>🤖 AI Body Analysis</span>
                      <span className="bg-gradient-to-r from-green-400 to-blue-400 px-2 py-1 rounded text-xs">
                        {(bodyMeasurements || aiBodyMeasurements)?.confidence}% confidence
                      </span>
                    </div>
                    <div className="text-gray-200 text-xs">
                      Height: {(bodyMeasurements || aiBodyMeasurements)?.height} • 
                      Chest: {(bodyMeasurements || aiBodyMeasurements)?.chest} • 
                      Waist: {(bodyMeasurements || aiBodyMeasurements)?.waist}
                    </div>
                    <div className="text-gray-300 text-xs mt-1">
                      Shoulders: {(bodyMeasurements || aiBodyMeasurements)?.shoulders} • 
                      Hips: {(bodyMeasurements || aiBodyMeasurements)?.hips}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-300 text-sm">Loading weather data...</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Mirror Modes */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Mirror Modes</h2>
              <div className="space-y-2">
                {mirrorModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setMirrorMode(mode.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
                      mirrorMode === mode.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span className="font-medium">{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Controls */}
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Smart Controls</h2>
              <div className="space-y-3">
                <button
                  onClick={startMirrorSession}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 shadow-lg hover:scale-105"
                >
                  <span>✨</span>
                  <span>Start AI Session</span>
                </button>
                
                <button
                  onClick={toggleCamera}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    isCameraOn
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <span>{isCameraOn ? '📷' : '🔴'}</span>
                  <span>{isCameraOn ? 'Stop Camera' : 'Start Camera'}</span>
                </button>
                
                {isCameraOn && (
                  <div className="space-y-2">
                    <button 
                      onClick={takePhoto}
                      disabled={!selectedOutfit}
                      className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      📸 Save Outfit Photo
                    </button>
                    
                    {/* Mobile Camera Switch */}
                    {isMobile && supportsCameraSwitch && (
                      <button 
                        onClick={handleCameraSwitch}
                        className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <span>🔄</span>
                        <span>Switch Camera ({cameraFacing === 'user' ? 'Front' : 'Back'})</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={analyzeBodyMeasurements}
                      disabled={isAnalyzing}
                      className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>📐</span>
                          <span>Analyze Body</span>
                        </>
                      )}
                    </button>
                    
                    {/* Gesture Controls */}
                    <button 
                      onClick={toggleGestureControls}
                      disabled={!isHandsLoaded || !isCameraOn}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${
                        gestureControlEnabled
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      <span>🖐️</span>
                      <span>{gestureControlEnabled ? 'Disable Gestures' : 'Enable Gestures'}</span>
                      {!isHandsLoaded && (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Outfit Suggestions */}
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
                <button 
                  onClick={loadAISuggestions}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs transition-all"
                >
                  🔄
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {outfitsToTry.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => selectOutfit(outfit)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      selectedOutfit?.id === outfit.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-gray-200 hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={outfit.thumbnail} 
                      alt={outfit.name}
                      className="w-12 h-15 rounded object-cover border border-white/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-sm">{outfit.name}</div>
                        {!outfit.weatherSuitable && (
                          <span className="text-orange-400 text-xs">⚠️</span>
                        )}
                      </div>
                      <div className="text-xs opacity-75 mb-1">
                        {outfit.items.slice(0, 2).join(' • ')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs bg-white/20 px-2 py-1 rounded">
                          {outfit.confidence}% match
                        </div>
                        {outfit.weatherSuitable && (
                          <div className="text-xs text-green-400">☀️ Weather OK</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Session History */}
            {sessionHistory.length > 0 && (
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Session History</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sessionHistory.slice(0, 5).map((entry, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">👗</span>
                        <div className="flex-1">
                          <div className="text-white text-xs font-medium">
                            {entry.outfit?.name || 'Unknown Outfit'}
                          </div>
                          <div className="text-gray-300 text-xs">
                            {entry.action} • {new Date(entry.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mirror Display */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl" ref={mirrorContainerRef}>
              {/* Mirror Header */}
              <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isCameraOn ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-white font-medium">
                    {mirrorModes.find(m => m.id === mirrorMode)?.name}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  {isCameraOn ? 'Live Feed' : 'Camera Off'}
                </div>
              </div>

              {/* Mirror Content - Fixed YouTube-like dimensions */}
              <div className="p-4">
                <div className={`${isMobile ? 'w-full max-w-[400px] h-[225px]' : 'w-full max-w-[640px] h-[360px]'} mx-auto bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden rounded-lg`}>
                {isCameraOn ? (
                  <>
                    {/* Real Camera Feed */}
                    <video 
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ 
                        transform: 'scaleX(-1)',
                        minHeight: '100%',
                        minWidth: '100%'
                      }}
                    />
                    
                    {/* Virtual Outfit Overlay Canvas */}
                    {selectedOutfit && outfitOverlay && (
                      <canvas 
                        ref={overlayCanvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    )}
                    
                    {/* AI Pose Detection Canvas */}
                    {(mirrorMode === 'fit-analysis' && poseData) && (
                      <canvas 
                        ref={poseCanvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    )}
                    
                    {/* Hand Gesture Recognition Canvas */}
                    {gestureControlEnabled && (
                      <canvas 
                        ref={gestureCanvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none z-20"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    )}
                    
                    {/* Hidden canvas for photo capture */}
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Camera status indicator */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center z-10">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      LIVE
                    </div>

                    {/* Mobile Gesture Instructions */}
                    {isMobile && (
                      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-black/80 to-gray-800/80 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs border border-white/20">
                        <div className="text-xs font-medium mb-1">👆 Touch Gestures:</div>
                        <div className="text-xs opacity-75 space-y-1">
                          <div>←→ Swipe: Change outfit</div>
                          <div>↑ Swipe up: Take photo</div>
                          <div>↓ Swipe down: Switch camera</div>
                          <div>👆👆 Double tap: Quick photo</div>
                        </div>
                      </div>
                    )}

                    {/* Gesture feedback */}
                    {gestures.isSwipe && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl border border-white/20 font-medium animate-pulse">
                          {gestures.swipeDirection === 'left' && '← Next Outfit'}
                          {gestures.swipeDirection === 'right' && '→ Previous Outfit'}
                          {gestures.swipeDirection === 'up' && '↑ Taking Photo'}
                          {gestures.swipeDirection === 'down' && '↓ Switching Camera'}
                        </div>
                      </div>
                    )}
                    
                    

                    {/* Enhanced Overlay Elements */}
                    {selectedOutfit && (
                      <div className="absolute top-4 left-4 bg-gradient-to-br from-black/80 to-gray-800/80 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-xl shadow-2xl">
                        <div className="text-sm font-medium flex items-center space-x-2">
                          <span>✨</span>
                          <span>{selectedOutfit.name}</span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">AR Try-On Active • {selectedOutfit.confidence}% Match</div>
                        <div className="text-xs text-green-400 mt-1">
                          {selectedOutfit.weatherSuitable ? '☀️ Weather Suitable' : '⚠️ Check Weather'}
                        </div>
                      </div>
                    )}

                    {/* Weather Warning */}
                    {selectedOutfit && !selectedOutfit.weatherSuitable && (
                      <div className="absolute top-4 right-16 bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs border border-white/20">
                        <div className="flex items-center space-x-1">
                          <span>⚠️</span>
                          <span>Weather Alert</span>
                        </div>
                        <div className="text-xs mt-1">Not ideal for current weather</div>
                      </div>
                    )}
                    
                    {/* Gesture Control Status */}
                    {gestureControlEnabled && (
                      <div className="absolute top-20 right-4 bg-gradient-to-r from-green-500/95 to-blue-500/95 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 text-xs">
                        <div className="font-medium mb-2 flex items-center space-x-2">
                          <span>🖐️</span>
                          <span>Gesture Controls Active</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {detectedGesture && (
                          <div className="bg-white/20 rounded-lg p-2 mb-2">
                            <div className="text-xs font-medium text-yellow-200 mb-1">
                              Detected: {detectedGesture.toUpperCase()}
                            </div>
                            <div className="text-xs opacity-90">
                              Action: {getGestureAction(detectedGesture)} • {Math.round(gestureConfidence * 100)}%
                            </div>
                          </div>
                        )}
                        
                        {lastGestureAction && (
                          <div className="bg-green-400/20 rounded-lg p-2 mb-2">
                            <div className="text-xs font-medium text-green-200">
                              ✓ {lastGestureAction} executed
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs opacity-75 space-y-1">
                          <div>👉 Point: Select</div>
                          <div>✋ Palm: Next outfit</div>
                          <div>✊ Fist: Previous</div>
                          <div>✌️ Peace: Photo</div>
                          <div>👍 Thumbs up: Save</div>
                        </div>
                      </div>
                    )}

                    {mirrorMode === 'fit-analysis' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {!poseData && (
                          <div className="absolute inset-4 border-2 border-cyan-400 border-dashed opacity-60 animate-pulse"></div>
                        )}
                        
                        {/* AI Body Analysis Results */}
                        {(bodyMeasurements || aiBodyMeasurements) && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500/95 to-blue-500/95 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/20 text-xs max-w-xs">
                            <div className="font-medium mb-2 flex items-center space-x-2">
                              <span>🤖</span>
                              <span>AI Body Analysis</span>
                              <div className="bg-green-400 text-black px-2 py-1 rounded text-xs">
                                {(bodyMeasurements || aiBodyMeasurements)?.confidence}%
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div>Height: {(bodyMeasurements || aiBodyMeasurements)?.height}</div>
                              <div>Chest: {(bodyMeasurements || aiBodyMeasurements)?.chest} • Waist: {(bodyMeasurements || aiBodyMeasurements)?.waist}</div>
                              <div>Shoulders: {(bodyMeasurements || aiBodyMeasurements)?.shoulders} • Hips: {(bodyMeasurements || aiBodyMeasurements)?.hips}</div>
                            </div>
                            
                            {poseData?.quality && (
                              <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="text-xs font-medium mb-1">Pose Quality:</div>
                                <div className="text-xs opacity-90">
                                  Confidence: {poseData.quality.averageConfidence}% • 
                                  Alignment: {poseData.quality.alignment}
                                </div>
                                {poseData.quality.recommendations?.[0] && (
                                  <div className="text-xs text-yellow-200 mt-1">
                                    💡 {poseData.quality.recommendations[0]}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Analysis Status */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm border border-white/20">
                          <div className="flex items-center space-x-2">
                            {isAnalyzing || isAIAnalyzing ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Analyzing...</span>
                              </>
                            ) : poseData ? (
                              <>
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span>Analysis Complete</span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span>Ready to Analyze</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {mirrorMode === 'color-match' && (
                      <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md text-white p-4 rounded-xl border border-white/20">
                        <div className="text-sm font-medium mb-3 flex items-center space-x-2">
                          <span>🎨</span>
                          <span>Color Harmony Analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white/50 shadow-lg"></div>
                            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white/50 shadow-lg"></div>
                            <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white/50 shadow-lg"></div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">Perfect color harmony detected!</div>
                            <div className="text-xs opacity-75">These colors complement your skin tone beautifully</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">95%</div>
                            <div className="text-xs opacity-75">Match</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">📷</div>
                    <h3 className="text-xl font-semibold mb-2">Camera is Off</h3>
                    <p className="mb-4">Turn on the camera to start virtual try-on</p>
                    <button
                      onClick={toggleCamera}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
                </div>
              </div>

              {/* Mirror Footer */}
              <div className="bg-gray-800 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                  <div className="flex space-x-2">
                    {/* Body Analysis Trigger */}
                    {mirrorMode === 'fit-analysis' && (
                      <button 
                        onClick={analyzeBodyMeasurements}
                        disabled={isAIAnalyzing || !isModelLoaded}
                        className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
                      >
                        {isAIAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <span>🔬</span>
                            <span>{isModelLoaded ? 'Analyze Body' : 'Loading AI...'}</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        console.log('Capture & Share clicked', { selectedOutfit, isCameraOn });
                        try {
                          if (selectedOutfit && isCameraOn) {
                            takePhoto(true);
                          } else {
                            if (!selectedOutfit) {
                              console.log('No outfit selected');
                              showError('Please select an outfit first');
                            }
                            if (!isCameraOn) {
                              console.log('Camera not on');
                              showError('Please start the camera first');
                            }
                          }
                        } catch (error) {
                          console.error('Capture & Share error:', error);
                          showError('Failed to capture photo');
                        }
                      }}
                      disabled={!selectedOutfit || !isCameraOn}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                    >
                      <span>📷</span>
                      <span>Capture & Share</span>
                    </button>
                    
                    {/* Always Visible Test Share Button */}
                    <button 
                      onClick={() => {
                        console.log('TEST SHARE CLICKED!');
                        alert('Test share button clicked!');
                        setShowShareModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                    >
                      🧪 TEST SHARE
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Share Look clicked', { selectedOutfit, showShareModal });
                        setShowShareModal(true);
                        console.log('Modal should be open now');
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                    >
                      <span>📤</span>
                      <span>Share Look (Test)</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Save Look clicked', { selectedOutfit });
                        if (selectedOutfit) {
                          try {
                            saveToSessionHistory({
                              outfit: selectedOutfit,
                              timestamp: new Date(),
                              action: 'saved'
                            });
                            showSuccess(`${selectedOutfit.name} saved to favorites!`);
                          } catch (error) {
                            console.error('Error saving outfit:', error);
                            showError('Failed to save outfit');
                          }
                        } else {
                          showError('Please select an outfit to save');
                        }
                      }}
                      disabled={!selectedOutfit}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                    >
                      <span>♥️</span>
                      <span>Save Look</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {isCameraOn && (
              <div className="mt-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Style Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-medium">Fit Score</div>
                    <div className="text-2xl font-bold text-white">92%</div>
                    <div className="text-gray-300 text-sm">Excellent fit</div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium">Color Harmony</div>
                    <div className="text-2xl font-bold text-white">88%</div>
                    <div className="text-gray-300 text-sm">Great match</div>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="text-purple-400 text-sm font-medium">Style Rating</div>
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-gray-300 text-sm">Perfect style</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Test Share Modal */}
      <TestShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        outfitData={selectedOutfit}
      />
    </div>
  );
};

export default Mirror;
