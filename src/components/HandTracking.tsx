
import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { drawHand, HandPose } from '../utils/draw-hand';

interface HandTrackingProps {
  isActive: boolean;
}

export function HandTracking({ isActive }: HandTrackingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    const runHandpose = async () => {
      if (!isActive) {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        return;
      }
      
      try {
        // Load the handpose model
        const net = await handpose.load({
          detectionConfidence: 0.7,
          maxContinuousChecks: 20,
        });
        
        // Access the webcam
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream);
        }
        
        // Detect hands
        const detect = async () => {
          if (!videoRef.current || !canvasRef.current || !isActive) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Get hand predictions
          try {
            const predictions = await net.estimateHands(video);
            
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
                  annotations: predictions[0].annotations
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
            requestAnimationFrame(detect);
          }
        };
        
        videoRef.current.addEventListener('loadeddata', () => {
          detect();
        });
        
      } catch (error) {
        console.error("Error in handpose setup:", error);
      }
    };
    
    runHandpose();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);
  
  return (
    <div className="relative h-full w-full">
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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
          <p className="text-white text-xl font-hands">Camera Off</p>
        </div>
      )}
    </div>
  );
}
