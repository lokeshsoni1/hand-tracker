
import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { drawHand, HandPose, convertAnnotationsToKeypoints } from '../utils/draw-hand';
import { Loader2 } from 'lucide-react';

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
  
  // Load the model once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        setLoading(true);
        console.log("Loading handpose model...");
        
        // Load the handpose model
        const handModel = await handpose.load({
          detectionConfidence: 0.7,
          maxContinuousChecks: 20,
        });
        
        if (isMounted) {
          console.log("Model loaded successfully");
          setModel(handModel);
          setModelLoaded(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading model:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Handle camera activation/deactivation
  useEffect(() => {
    let animationFrameId: number;
    
    const setupCamera = async () => {
      if (!isActive) {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        return;
      }
      
      if (!model) return;
      
      try {
        setLoading(true);
        
        // Access the webcam
        console.log("Requesting camera access...");
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: "user"
          } 
        });
        
        console.log("Camera access granted");
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          setStream(videoStream);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setLoading(false);
      }
    };
    
    setupCamera();
    
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
    
    if (isActive && model && videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        detect();
      });
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, model]);
  
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
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full w-full object-cover rounded-lg"
      />
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
