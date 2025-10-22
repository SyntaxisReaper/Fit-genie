import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as bodyPix from '@tensorflow-models/body-pix';

export const useBodyAnalysis = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [poseData, setPoseData] = useState(null);
  const [bodyMeasurements, setBodyMeasurements] = useState(null);
  const [segmentationMask, setSegmentationMask] = useState(null);
  
  const poseDetectorRef = useRef(null);
  const bodyPixModelRef = useRef(null);
  const analysisCanvasRef = useRef(null);

  // Initialize TensorFlow.js models
  useEffect(() => {
    initializeModels();
    return () => {
      // Cleanup models when component unmounts
      if (poseDetectorRef.current) {
        poseDetectorRef.current.dispose?.();
      }
      if (bodyPixModelRef.current) {
        bodyPixModelRef.current.dispose?.();
      }
    };
  }, []);

  const initializeModels = async () => {
    try {
      console.log('Loading TensorFlow.js models...');
      
      // Set backend to webgl for better performance
      await tf.setBackend('webgl');
      await tf.ready();

      // Load pose detection model
      const poseModel = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
      };
      
      poseDetectorRef.current = await poseDetection.createDetector(poseModel, detectorConfig);

      // Load body segmentation model  
      const bodyPixConfig = {
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      };
      
      bodyPixModelRef.current = await bodyPix.load(bodyPixConfig);
      
      setIsModelLoaded(true);
      console.log('TensorFlow.js models loaded successfully');
    } catch (error) {
      console.error('Error loading TensorFlow.js models:', error);
      setIsModelLoaded(false);
    }
  };

  const analyzeVideo = async (videoElement) => {
    if (!isModelLoaded || !videoElement || !poseDetectorRef.current || !bodyPixModelRef.current) {
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      // Run pose detection
      const poses = await poseDetectorRef.current.estimatePoses(videoElement);
      const pose = poses[0]; // Get the first detected pose
      
      // Run body segmentation
      const segmentation = await bodyPixModelRef.current.segmentPerson(videoElement, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });

      if (pose && pose.keypoints) {
        const measurements = calculateBodyMeasurements(pose.keypoints, videoElement);
        const poseAnalysis = analyzePoseQuality(pose);
        
        setPoseData({
          ...pose,
          quality: poseAnalysis
        });
        
        setBodyMeasurements(measurements);
        setSegmentationMask(segmentation);
        
        return {
          pose: pose,
          measurements: measurements,
          segmentation: segmentation,
          quality: poseAnalysis
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing video:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateBodyMeasurements = (keypoints, videoElement) => {
    // Get video dimensions for scaling
    const videoWidth = videoElement.videoWidth || videoElement.width;
    const videoHeight = videoElement.videoHeight || videoElement.height;
    
    // Key body points
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
    const nose = keypoints.find(kp => kp.name === 'nose');

    // Only proceed if we have high-confidence key points
    const minConfidence = 0.5;
    const validPoints = [leftShoulder, rightShoulder, leftHip, rightHip, leftAnkle, rightAnkle, nose]
      .filter(point => point && point.score > minConfidence);
    
    if (validPoints.length < 5) {
      return {
        error: 'Insufficient pose detection quality',
        confidence: 0,
        suggestions: ['Stand directly facing the camera', 'Ensure good lighting', 'Keep full body visible']
      };
    }

    // Calculate measurements in pixels, then convert to relative measurements
    const measurements = {};

    // Shoulder width
    if (leftShoulder && rightShoulder && leftShoulder.score > minConfidence && rightShoulder.score > minConfidence) {
      const shoulderDistance = Math.sqrt(
        Math.pow(rightShoulder.x - leftShoulder.x, 2) + 
        Math.pow(rightShoulder.y - leftShoulder.y, 2)
      );
      measurements.shoulderWidth = shoulderDistance;
    }

    // Hip width
    if (leftHip && rightHip && leftHip.score > minConfidence && rightHip.score > minConfidence) {
      const hipDistance = Math.sqrt(
        Math.pow(rightHip.x - leftHip.x, 2) + 
        Math.pow(rightHip.y - leftHip.y, 2)
      );
      measurements.hipWidth = hipDistance;
    }

    // Torso length (shoulder to hip)
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
      };
      const hipMidpoint = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2
      };
      
      measurements.torsoLength = Math.sqrt(
        Math.pow(hipMidpoint.x - shoulderMidpoint.x, 2) + 
        Math.pow(hipMidpoint.y - shoulderMidpoint.y, 2)
      );
    }

    // Height approximation (head to ankle)
    if (nose && ((leftAnkle && leftAnkle.score > minConfidence) || (rightAnkle && rightAnkle.score > minConfidence))) {
      const ankle = leftAnkle?.score > (rightAnkle?.score || 0) ? leftAnkle : rightAnkle;
      measurements.approximateHeight = Math.abs(ankle.y - nose.y);
    }

    // Convert to human-readable measurements (approximate)
    const pixelsPerInch = videoHeight / 72; // Rough approximation
    const convertedMeasurements = {
      shoulders: measurements.shoulderWidth ? `${Math.round(measurements.shoulderWidth / pixelsPerInch * 2.5)}"` : 'N/A',
      chest: measurements.shoulderWidth ? `${Math.round(measurements.shoulderWidth / pixelsPerInch * 2.8)}"` : 'N/A',
      waist: measurements.hipWidth ? `${Math.round(measurements.hipWidth / pixelsPerInch * 1.8)}"` : 'N/A',
      hips: measurements.hipWidth ? `${Math.round(measurements.hipWidth / pixelsPerInch * 2.2)}"` : 'N/A',
      height: measurements.approximateHeight ? `${Math.floor(measurements.approximateHeight / pixelsPerInch / 12)}'${Math.round((measurements.approximateHeight / pixelsPerInch) % 12)}"` : 'N/A',
      confidence: Math.round(validPoints.reduce((sum, point) => sum + point.score, 0) / validPoints.length * 100),
      rawMeasurements: measurements
    };

    return convertedMeasurements;
  };

  const analyzePoseQuality = (pose) => {
    const keypoints = pose.keypoints;
    const scores = keypoints.map(kp => kp.score);
    
    const averageConfidence = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highConfidencePoints = scores.filter(score => score > 0.7).length;
    
    // Check pose alignment
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    
    let alignment = 'good';
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderSlope = Math.abs(leftShoulder.y - rightShoulder.y);
      const hipSlope = Math.abs(leftHip.y - rightHip.y);
      
      if (shoulderSlope > 20 || hipSlope > 20) {
        alignment = 'tilted';
      }
    }

    return {
      averageConfidence: Math.round(averageConfidence * 100),
      highConfidencePoints,
      totalPoints: keypoints.length,
      alignment,
      recommendations: generatePoseRecommendations(averageConfidence, alignment, highConfidencePoints)
    };
  };

  const generatePoseRecommendations = (confidence, alignment, highConfidencePoints) => {
    const recommendations = [];
    
    if (confidence < 0.6) {
      recommendations.push('Improve lighting conditions');
      recommendations.push('Move closer to the camera');
    }
    
    if (alignment === 'tilted') {
      recommendations.push('Stand straight and face the camera directly');
    }
    
    if (highConfidencePoints < 10) {
      recommendations.push('Ensure your full body is visible');
      recommendations.push('Remove any obstructions');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great pose! Measurements are accurate');
    }
    
    return recommendations;
  };

  const drawPoseOverlay = (canvas, pose, videoElement) => {
    if (!canvas || !pose || !videoElement) return;
    
    const ctx = canvas.getContext('2d');
    const videoWidth = videoElement.videoWidth || videoElement.width;
    const videoHeight = videoElement.videoHeight || videoElement.height;
    
    // Set canvas dimensions
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw keypoints
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw skeleton connections
    const connections = [
      ['nose', 'left_eye'], ['nose', 'right_eye'],
      ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
    ];
    
    connections.forEach(([pointA, pointB]) => {
      const keypointA = pose.keypoints.find(kp => kp.name === pointA);
      const keypointB = pose.keypoints.find(kp => kp.name === pointB);
      
      if (keypointA && keypointB && keypointA.score > 0.3 && keypointB.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(keypointA.x, keypointA.y);
        ctx.lineTo(keypointB.x, keypointB.y);
        ctx.stroke();
      }
    });
  };

  return {
    isModelLoaded,
    isAnalyzing,
    poseData,
    bodyMeasurements,
    segmentationMask,
    analyzeVideo,
    drawPoseOverlay
  };
};