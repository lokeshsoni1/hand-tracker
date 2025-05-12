
interface Keypoint {
  x: number;
  y: number;
  z: number;
}

export interface HandPose {
  landmarks: Keypoint[];
  annotations: Record<string, Keypoint[]>;
}

// Finger connections for drawing
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const drawHand = (hand: HandPose, ctx: CanvasRenderingContext2D) => {
  if (!hand.landmarks) return;

  // Draw all points
  for (let i = 0; i < hand.landmarks.length; i++) {
    const landmark = hand.landmarks[i];
    
    // Get x point
    const x = landmark.x;
    
    // Get y point
    const y = landmark.y;
    
    // Start drawing
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 3 * Math.PI);
    
    // Set line color
    ctx.fillStyle = "#9b87f5";
    ctx.fill();
  }
  
  // Draw fingers
  const fingers = Object.keys(fingerJoints);
  
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i] as keyof typeof fingerJoints;
    const points = fingerJoints[finger];
    
    // Loop through finger joints
    for (let j = 0; j < points.length - 1; j++) {
      const pointA = hand.landmarks[points[j]];
      const pointB = hand.landmarks[points[j + 1]];
      
      // Draw path
      ctx.beginPath();
      ctx.moveTo(pointA.x, pointA.y);
      ctx.lineTo(pointB.x, pointB.y);
      ctx.strokeStyle = "#7E69AB";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
};
