import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { drawHand, HandPose, convertAnnotationsToKeypoints } from '../utils/draw-hand';
import { Loader2 } from 'lucide-react';
import { DigitalBulb } from './DigitalBulb';
import { toast } from 'sonner';

interface HandTrackingProps {
  isActive: boolean;
}

export function HandTracking({ isActive }: HandTrackingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [bulbBrightness, setBulbBrightness] = useState<'off' | 'half' | 'full'>('off');
  
  // Keep track of recent finger counts for smoothing
  const fingerCountHistory = useRef<number[]>([]);
  const maxHistoryLength = 5;
  
  // Initialize TensorFlow.js first before loading the model
  useEffect(() => {
    const setupTf = async () => {
      try {
        if (!tf.getBackend()) {
          console.log("Setting up TensorFlow.js backend...");
          await tf.setBackend('webgl');
          await tf.ready();
          console.log("TensorFlow backend initialized:", tf.getBackend());
        }
      } catch (error) {
        console.error("Failed to initialize TensorFlow backend:", error);
        toast.error("Failed to initialize machine learning engine");
      }
    };
    
    setupTf();
  }, []);
  
  // Load the model only after TensorFlow is ready and when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      if (!isActive || modelLoaded || !tf.getBackend()) return;
      
      try {
        setLoading(true);
        console.log("Loading handpose model...");
        
        // Load the handpose model with improved settings
        const handModel = await handpose.load({
          detectionConfidence: 0.7, // Slightly lower for better detection
          maxContinuousChecks: 10,
          iouThreshold: 0.3,
        });
        
        if (isMounted) {
          console.log("Model loaded successfully");
          setModel(handModel);
          setModelLoaded(true);
          setLoading(false);
          toast.success("Hand tracking model loaded");
        }
      } catch (error) {
        console.error("Error loading model:", error);
        if (isMounted) {
          setLoading(false);
          toast.error("Failed to load hand tracking model. Please try again.");
          
          // Force camera off on model load failure
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      }
    };
    
    // Only attempt to load the model when camera is active
    if (isActive && !modelLoaded && tf.getBackend()) {
      loadModel();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isActive, modelLoaded, stream]);
  
  // Handle camera activation/deactivation
  useEffect(() => {
    let isCameraMounted = true;
    
    const setupCamera = async () => {
      // Clean up previous stream if exists
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
      
      // Only proceed if component is active
      if (!isActive) return;
      
      try {
        setLoading(true);
        
        // Access the webcam with optimized constraints
        console.log("Requesting camera access...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
            frameRate: { ideal: 30 }
          },
          audio: false
        });
        
        if (!isCameraMounted) {
          videoStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        console.log("Camera access granted");
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && isCameraMounted) {
              videoRef.current.play().then(() => {
                console.log("Video is playing");
                setLoading(false);
              }).catch(err => {
                console.error("Error playing video:", err);
                setLoading(false);
                toast.error("Failed to start video stream");
              });
            }
          };
          
          setStream(videoStream);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setLoading(false);
        toast.error("Camera access failed");
      }
    };
    
    setupCamera();
    
    return () => {
      isCameraMounted = false;
      // Clean up camera stream when component unmounts or isActive changes
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);
  
  // Hand detection and rendering
  useEffect(() => {
    let animationFrameId: number;
    let lastDetectionTime = 0;
    const detectionInterval = 50; // Detect hands every 50ms for smoother performance
    
    // Count fingers with improved algorithm
    const countFingers = (landmarks: { x: number; y: number; z: number }[]) => {
      if (!landmarks || landmarks.length < 21) return 0;
      
      // Define finger tip and mid-joint indices
      const fingerTips = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky tips
      const fingerMidJoints = [3, 7, 11, 15, 19]; // Mid joints (closer to tips)
      const fingerBaseJoints = [2, 6, 10, 14, 18]; // Base joints (IP for thumb, PIP for others)
      const wrist = landmarks[0]; // Wrist point
      
      let count = 0;
      
      // Special case for thumb - compare with side of hand rather than vertical position
      const thumbTip = landmarks[4];
      const thumbIp = landmarks[3];
      const thumbMcp = landmarks[2]; 
      const indexMcp = landmarks[5]; // Index finger MCP joint
      
      // Vector from thumb MCP to index MCP (side of palm)
      const sideVec = {
        x: indexMcp.x - thumbMcp.x,
        y: indexMcp.y - thumbMcp.y,
        z: indexMcp.z - thumbMcp.z
      };
      
      // Vector from thumb MCP to thumb tip
      const thumbVec = {
        x: thumbTip.x - thumbMcp.x,
        y: thumbTip.y - thumbMcp.y,
        z: thumbTip.z - thumbMcp.z
      };
      
      // Calculate a rough angle by comparing x and y projection
      const thumbSideDist = Math.sqrt(
        Math.pow(thumbTip.x - indexMcp.x, 2) + 
        Math.pow(thumbTip.y - indexMcp.y, 2)
      );
      
      // If thumb is far enough from the side of the palm, count it
      if (thumbSideDist > 0.08) {
        count++;
      }
      
      // Check other fingers
      for (let i = 1; i < fingerTips.length; i++) {
        const tipIdx = fingerTips[i];
        const midIdx = fingerMidJoints[i];
        const baseIdx = fingerBaseJoints[i];
        
        const tip = landmarks[tipIdx];
        const mid = landmarks[midIdx];
        const base = landmarks[baseIdx];
        
        // Calculate if finger is extended by comparing y positions
        // A finger is extended if the tip is higher (lower y value) than the MCP joint
        // We also check that the tip is higher than the PIP joint
        if (tip.y < mid.y - 0.03 && tip.y < base.y - 0.03) {
          count++;
        }
      }
      
      return count;
    };
    
    // Apply smoothing to finger count
    const smoothFingerCount = (currentCount: number) => {
      // Add current count to history
      fingerCountHistory.current.push(currentCount);
      
      // Keep history at specified length
      if (fingerCountHistory.current.length > maxHistoryLength) {
        fingerCountHistory.current.shift();
      }
      
      // Get most frequent count from history
      const countFrequency: Record<number, number> = {};
      let maxFreq = 0;
      let mostFrequentCount = currentCount;
      
      fingerCountHistory.current.forEach(count => {
        countFrequency[count] = (countFrequency[count] || 0) + 1;
        if (countFrequency[count] > maxFreq) {
          maxFreq = countFrequency[count];
          mostFrequentCount = count;
        }
      });
      
      return mostFrequentCount;
    };
    
    // Update bulb brightness based on finger count
    const updateBulbBrightness = (count: number) => {
      if (count === 0) {
        setBulbBrightness('off');
      } else if (count >= 1 && count <= 3) {
        setBulbBrightness('half');
      } else {
        setBulbBrightness('full');
      }
      
      setFingerCount(count);
    };
    
    // Detect hands with performance optimization
    const detect = async () => {
      if (!videoRef.current || !canvasRef.current || !model || !isActive || loading) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Make sure video is ready
      if (video.readyState !== 4) {
        animationFrameId = requestAnimationFrame(detect);
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const now = Date.now();
      
      // Only run detection at specified intervals for better performance
      if (now - lastDetectionTime >= detectionInterval) {
        lastDetectionTime = now;
        
        // Get hand predictions
        try {
          const predictions = await model.estimateHands(video);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (predictions.length > 0) {
            // Convert to our HandPose interface
            const hand: HandPose = {
              landmarks: predictions[0].landmarks.map((point: number[]) => ({
                x: point[0],
                y: point[1],
                z: point[2]
              })),
              annotations: convertAnnotationsToKeypoints(predictions[0].annotations)
            };
            
            // Draw the landmarks
            drawHand(hand, ctx);
            
            // Count fingers and apply smoothing
            const rawCount = countFingers(hand.landmarks);
            const smoothedCount = smoothFingerCount(rawCount);
            
            // Update bulb based on smoothed count
            updateBulbBrightness(smoothedCount);
          } else {
            // No hands detected, set bulb to off
            updateBulbBrightness(0);
            // Clear finger history when no hand is detected
            fingerCountHistory.current = [];
          }
        } catch (error) {
          console.error("Hand detection error:", error);
        }
      } else {
        // On non-detection frames, just update the canvas with previous data
        // This keeps animation smooth without detection overhead
      }
      
      // Continue detecting if active
      if (isActive && !loading) {
        animationFrameId = requestAnimationFrame(detect);
      }
    };
    
    // Start detection when video is loaded and model is ready
    if (isActive && model && videoRef.current && !loading) {
      const video = videoRef.current;
      
      if (video.readyState >= 2) {
        detect();
      } else {
        video.addEventListener('loadeddata', () => {
          detect();
        });
      }
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Reset finger history when component is unmounted or detection stops
      fingerCountHistory.current = [];
    };
  }, [isActive, model, loading]);
  
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-gray-900/60 to-gray-900/80 backdrop-blur-md">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-white">{modelLoaded ? 'Accessing camera...' : 'Loading hand tracking model...'}</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute top-0 left-0 h-full w-full object-cover rounded-lg"
        autoPlay
        playsInline
        muted
        style={{ transform: "scaleX(-1)" }} /* Mirror the video horizontally */
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full w-full object-cover rounded-lg"
        style={{ transform: "scaleX(-1)" }} /* Mirror the canvas to match the video */
      />
      
      {/* Finger count display */}
      {isActive && model && !loading && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm z-20">
          <span className="text-sm font-medium">Fingers: {fingerCount}</span>
        </div>
      )}
      
      {/* Digital Bulb */}
      {isActive && (
        <DigitalBulb brightness={bulbBrightness} />
      )}
      
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <p className="text-white text-xl font-hands mb-2">Camera Off</p>
            <p className="text-white/70 text-sm">Click the camera icon to start tracking</p>
          </div>
        </div>
      )}
    </div>
  );
}
