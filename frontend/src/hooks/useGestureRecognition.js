import { useState, useRef, useCallback, useEffect } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export const useGestureRecognition = () => {
  const [isHandsLoaded, setIsHandsLoaded] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [handLandmarks, setHandLandmarks] = useState([]);
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const gestureTimeoutRef = useRef(null);
  const lastGestureTimeRef = useRef(0);
  
  // Gesture detection parameters
  const GESTURE_COOLDOWN = 1500; // 1.5 seconds between gestures
  const CONFIDENCE_THRESHOLD = 0.8;
  const GESTURE_HOLD_TIME = 800; // Hold gesture for 800ms to trigger
  
  // Initialize MediaPipe Hands
  const initializeHands = useCallback(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandsResults);
    handsRef.current = hands;
    setIsHandsLoaded(true);
    
    return hands;
  }, []);
  
  // Process hand detection results
  const onHandsResults = useCallback((results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setHandLandmarks([]);
      setDetectedGesture(null);
      setGestureConfidence(0);
      return;
    }
    
    const landmarks = results.multiHandLandmarks[0];
    setHandLandmarks(landmarks);
    
    // Analyze gesture
    const gesture = analyzeGesture(landmarks);
    if (gesture) {
      handleGestureDetection(gesture);
    }
  }, []);
  
  // Analyze hand landmarks to detect gestures
  const analyzeGesture = (landmarks) => {
    if (!landmarks || landmarks.length < 21) return null;
    
    // Get key landmark positions
    const thumb_tip = landmarks[4];
    const thumb_mcp = landmarks[2];
    const index_tip = landmarks[8];
    const index_pip = landmarks[6];
    const middle_tip = landmarks[12];
    const middle_pip = landmarks[10];
    const ring_tip = landmarks[16];
    const ring_pip = landmarks[14];
    const pinky_tip = landmarks[20];
    const pinky_pip = landmarks[18];
    const wrist = landmarks[0];
    
    // Calculate distances and angles for gesture recognition
    const gestures = {
      // Point gesture (index finger extended, others closed)
      point: isFingerExtended(index_tip, index_pip, wrist) &&
             !isFingerExtended(middle_tip, middle_pip, wrist) &&
             !isFingerExtended(ring_tip, ring_pip, wrist) &&
             !isFingerExtended(pinky_tip, pinky_pip, wrist),
      
      // Open palm (all fingers extended)
      open_palm: isFingerExtended(index_tip, index_pip, wrist) &&
                 isFingerExtended(middle_tip, middle_pip, wrist) &&
                 isFingerExtended(ring_tip, ring_pip, wrist) &&
                 isFingerExtended(pinky_tip, pinky_pip, wrist),
      
      // Fist (all fingers closed)
      fist: !isFingerExtended(index_tip, index_pip, wrist) &&
            !isFingerExtended(middle_tip, middle_pip, wrist) &&
            !isFingerExtended(ring_tip, ring_pip, wrist) &&
            !isFingerExtended(pinky_tip, pinky_pip, wrist),
      
      // Peace/Victory sign (index and middle extended)
      peace: isFingerExtended(index_tip, index_pip, wrist) &&
             isFingerExtended(middle_tip, middle_pip, wrist) &&
             !isFingerExtended(ring_tip, ring_pip, wrist) &&
             !isFingerExtended(pinky_tip, pinky_pip, wrist),
      
      // Thumbs up
      thumbs_up: isThumbUp(thumb_tip, thumb_mcp, wrist) &&
                 !isFingerExtended(index_tip, index_pip, wrist) &&
                 !isFingerExtended(middle_tip, middle_pip, wrist),
      
      // Thumbs down  
      thumbs_down: isThumbDown(thumb_tip, thumb_mcp, wrist) &&
                   !isFingerExtended(index_tip, index_pip, wrist) &&
                   !isFingerExtended(middle_tip, middle_pip, wrist)
    };
    
    // Return the detected gesture with highest confidence
    for (const [gesture, detected] of Object.entries(gestures)) {
      if (detected) {
        return {
          name: gesture,
          confidence: calculateGestureConfidence(landmarks, gesture),
          landmarks: landmarks
        };
      }
    }
    
    return null;
  };
  
  // Helper function to check if finger is extended
  const isFingerExtended = (tip, pip, wrist) => {
    const tipDistance = Math.sqrt(
      Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2)
    );
    const pipDistance = Math.sqrt(
      Math.pow(pip.x - wrist.x, 2) + Math.pow(pip.y - wrist.y, 2)
    );
    return tipDistance > pipDistance * 1.2;
  };
  
  // Helper function to check thumbs up
  const isThumbUp = (thumb_tip, thumb_mcp, wrist) => {
    return thumb_tip.y < thumb_mcp.y && thumb_tip.y < wrist.y;
  };
  
  // Helper function to check thumbs down
  const isThumbDown = (thumb_tip, thumb_mcp, wrist) => {
    return thumb_tip.y > thumb_mcp.y && thumb_tip.y > wrist.y;
  };
  
  // Calculate gesture confidence score
  const calculateGestureConfidence = (landmarks, gesture) => {
    // Simple confidence calculation based on landmark clarity
    let confidence = 0.7;
    
    // Add bonus for stable landmarks
    if (landmarks.every(point => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1)) {
      confidence += 0.2;
    }
    
    // Gesture-specific confidence adjustments
    switch (gesture) {
      case 'point':
      case 'peace':
        confidence += 0.1;
        break;
      case 'thumbs_up':
      case 'thumbs_down':
        confidence += 0.15;
        break;
      default:
        break;
    }
    
    return Math.min(confidence, 1.0);
  };
  
  // Handle gesture detection with cooldown and confirmation
  const handleGestureDetection = (gesture) => {
    const currentTime = Date.now();
    
    // Check cooldown period
    if (currentTime - lastGestureTimeRef.current < GESTURE_COOLDOWN) {
      return;
    }
    
    // Check confidence threshold
    if (gesture.confidence < CONFIDENCE_THRESHOLD) {
      return;
    }
    
    // Clear any existing timeout
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }
    
    // Set gesture hold timer
    gestureTimeoutRef.current = setTimeout(() => {
      setDetectedGesture(gesture.name);
      setGestureConfidence(gesture.confidence);
      lastGestureTimeRef.current = currentTime;
      
      // Clear gesture after brief display
      setTimeout(() => {
        setDetectedGesture(null);
        setGestureConfidence(0);
      }, 1000);
    }, GESTURE_HOLD_TIME);
  };
  
  // Start gesture recognition with video element
  const startGestureRecognition = useCallback((videoElement) => {
    if (!videoElement || !handsRef.current) return;
    
    setIsGestureActive(true);
    
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (handsRef.current) {
          await handsRef.current.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });
    
    cameraRef.current = camera;
    camera.start();
  }, []);
  
  // Stop gesture recognition
  const stopGestureRecognition = useCallback(() => {
    setIsGestureActive(false);
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }
    setDetectedGesture(null);
    setHandLandmarks([]);
    setGestureConfidence(0);
  }, []);
  
  // Draw hand landmarks on canvas
  const drawHandOverlay = useCallback((canvas, landmarks) => {
    if (!canvas || !landmarks) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2
    });
    
    // Draw landmarks
    drawLandmarks(ctx, landmarks, {
      color: '#FF0000',
      lineWidth: 1,
      radius: 3
    });
  }, []);
  
  // Get gesture action mapping
  const getGestureAction = (gesture) => {
    const actionMap = {
      'point': 'SELECT',
      'open_palm': 'NEXT',
      'fist': 'BACK', 
      'peace': 'PHOTO',
      'thumbs_up': 'APPROVE',
      'thumbs_down': 'REJECT'
    };
    
    return actionMap[gesture] || null;
  };
  
  // Initialize on mount
  useEffect(() => {
    initializeHands();
    
    return () => {
      stopGestureRecognition();
    };
  }, [initializeHands, stopGestureRecognition]);
  
  return {
    isHandsLoaded,
    detectedGesture,
    handLandmarks,
    gestureConfidence,
    isGestureActive,
    startGestureRecognition,
    stopGestureRecognition,
    drawHandOverlay,
    getGestureAction
  };
};