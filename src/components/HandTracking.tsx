
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
  
  // Load the model only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        if (!modelLoaded) {
          setLoading(true);
          console.log("Loading handpose model...");
          
          // Load the handpose model
          const handModel = await handpose.load({
            detectionConfidence: 0.8,
            maxContinuousChecks: 10,
          });
          
          if (isMounted) {
            console.log("Model loaded successfully");
            setModel(handModel);
            setModelLoaded(true);
            setLoading(false);
            toast.success("Hand tracking model loaded");
          }
        }
      } catch (error) {
        console.error("Error loading model:", error);
        if (isMounted) {
          setLoading(false);
          toast.error("Failed to load hand tracking model");
        }
      }
    };
    
    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, [modelLoaded]);
  
  // Handle camera activation/deactivation
  useEffect(() => {
    let animationFrameId: number;
    let isCameraMounted = true;
    
    const setupCamera = async () => {
      // Clean up previous stream if exists
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      if (!isActive) return;
      
      try {
        setLoading(true);
        
        // Access the webcam with specific constraints to avoid flipping issues
        console.log("Requesting camera access...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          } 
        });
        
        if (!isCameraMounted) {
          videoStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        console.log("Camera access granted");
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
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
    
    // Count fingers based on hand landmarks
    const countFingers = (landmarks: { x: number; y: number; z: number }[]) => {
      // Define finger tip and base indices
      const fingerTips = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky tips
      const fingerBases = [2, 5, 9, 13, 17]; // thumb IP, and finger MCPs
      
      let count = 0;
      
      // Special case for thumb
      const thumbTipX = landmarks[4].x;
      const thumbBaseX = landmarks[2].x;
      const wristX = landmarks[0].x;
      
      // Check if thumb is extended based on x position relative to wrist
      const thumbDiff = Math.abs(thumbTipX - thumbBaseX);
      if (thumbDiff > 0.05) {
        count++;
      }
      
      // For other fingers, check if finger tip y is above finger base y
      for (let i = 1; i < fingerTips.length; i++) {
        const tipY = landmarks[fingerTips[i]].y;
        const baseY = landmarks[fingerBases[i]].y;
        
        // If tip is higher than base (y decreases upward in image coordinates)
        if (tipY < baseY - 0.07) { // Increased threshold to avoid false positives
          count++;
        }
      }
      
      return count;
    };
    
    // Update bulb brightness based on finger count
    const updateBulbBrightness = (count: number) => {
      if (count === 0) {
        setBulbBrightness('off');
      } else if (count >= 1 && count <= 4) {
        setBulbBrightness('half');
      } else {
        setBulbBrightness('full');
      }
      
      setFingerCount(count);
    };
    
    // Detect hands
    const detect = async () => {
      if (!videoRef.current || !canvasRef.current || !model || !isActive) return;
      
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
      
      // Get hand predictions
      try {
        const predictions = await model.estimateHands(video);
        
        // Draw hand landmarks
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Don't mirror the camera feed - let the skeleton overlay on the actual video
          
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
            
            // Count fingers and update bulb
            const count = countFingers(hand.landmarks);
            updateBulbBrightness(count);
          } else {
            // No hands detected, set bulb to off
            updateBulbBrightness(0);
          }
        }
      } catch (error) {
        console.error("Hand detection error:", error);
      }
      
      // Continue detecting if active
      if (isActive) {
        animationFrameId = requestAnimationFrame(detect);
      }
    };
    
    // Start detection when video is loaded
    if (isActive && model && videoRef.current) {
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
      isCameraMounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, model, stream]);
  
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
      {isActive && !loading && (
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
