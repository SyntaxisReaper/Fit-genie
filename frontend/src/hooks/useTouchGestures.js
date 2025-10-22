import { useState, useEffect, useRef } from 'react';

export const useTouchGestures = (elementRef) => {
  const [gestures, setGestures] = useState({
    swipeDirection: null,
    isSwipe: false,
    isPinch: false,
    pinchScale: 1,
    doubleTap: false
  });

  const touchStartRef = useRef({});
  const touchEndRef = useRef({});
  const lastTapRef = useRef(0);
  const pinchStartDistance = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getDistance = (touch1, touch2) => {
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      
      if (e.touches.length === 2) {
        // Pinch gesture start
        pinchStartDistance.current = getDistance(e.touches[0], e.touches[1]);
        setGestures(prev => ({ ...prev, isPinch: true }));
      } else {
        // Single touch start
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
        
        // Check for double tap
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          setGestures(prev => ({ ...prev, doubleTap: true }));
          setTimeout(() => {
            setGestures(prev => ({ ...prev, doubleTap: false }));
          }, 100);
        }
        lastTapRef.current = now;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && pinchStartDistance.current > 0) {
        // Pinch gesture
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / pinchStartDistance.current;
        setGestures(prev => ({ ...prev, pinchScale: scale }));
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1 && touchStartRef.current.x !== undefined) {
        const touch = e.changedTouches[0];
        touchEndRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };

        // Calculate swipe
        const deltaX = touchEndRef.current.x - touchStartRef.current.x;
        const deltaY = touchEndRef.current.y - touchStartRef.current.y;
        const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
        
        const minSwipeDistance = 50;
        const maxSwipeTime = 300;
        
        if (deltaTime < maxSwipeTime && 
           (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance)) {
          
          let direction = null;
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }
          
          setGestures(prev => ({
            ...prev,
            swipeDirection: direction,
            isSwipe: true
          }));
          
          // Reset swipe after a short delay
          setTimeout(() => {
            setGestures(prev => ({
              ...prev,
              swipeDirection: null,
              isSwipe: false
            }));
          }, 200);
        }
      }
      
      // Reset pinch
      if (e.touches.length < 2) {
        setGestures(prev => ({
          ...prev,
          isPinch: false,
          pinchScale: 1
        }));
        pinchStartDistance.current = 0;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef]);

  return gestures;
};

export const useMobileCamera = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' or 'environment'
  const [supportsCameraSwitch, setSupportsCameraSwitch] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobile(mobile);

    // Check camera switching support
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setSupportsCameraSwitch(videoDevices.length > 1);
        })
        .catch(console.error);
    }
  }, []);

  const switchCamera = () => {
    if (supportsCameraSwitch) {
      setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
      return cameraFacing === 'user' ? 'environment' : 'user';
    }
    return cameraFacing;
  };

  const getMobileConstraints = () => ({
    video: {
      facingMode: cameraFacing,
      width: { ideal: isMobile ? 720 : 1280 },
      height: { ideal: isMobile ? 1280 : 720 }
    },
    audio: false
  });

  return {
    isMobile,
    cameraFacing,
    supportsCameraSwitch,
    switchCamera,
    getMobileConstraints
  };
};

export const useVibration = () => {
  const vibrate = (pattern = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibratePattern = (pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Predefined vibration patterns
  const vibrationPatterns = {
    tap: 50,
    doubleTap: [50, 50, 50],
    longPress: 200,
    success: [100, 50, 100],
    error: [200, 100, 200, 100, 200],
    notification: [100, 50, 100, 50, 100]
  };

  return {
    vibrate,
    vibratePattern,
    patterns: vibrationPatterns
  };
};