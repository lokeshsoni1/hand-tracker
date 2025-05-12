
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

// Colors for different fingers
const fingerColors = {
  thumb: "#FF7043",         // Coral
  indexFinger: "#42A5F5",   // Light Blue
  middleFinger: "#66BB6A",  // Light Green
  ringFinger: "#FFCA28",    // Amber
  pinky: "#EC407A",         // Pink
};

export const drawHand = (hand: HandPose, ctx: CanvasRenderingContext2D) => {
  if (!hand.landmarks) return;

  // Draw palm
  ctx.beginPath();
  ctx.moveTo(hand.landmarks[0].x, hand.landmarks[0].y);
  ctx.lineTo(hand.landmarks[5].x, hand.landmarks[5].y);
  ctx.lineTo(hand.landmarks[9].x, hand.landmarks[9].y);
  ctx.lineTo(hand.landmarks[13].x, hand.landmarks[13].y);
  ctx.lineTo(hand.landmarks[17].x, hand.landmarks[17].y);
  ctx.lineTo(hand.landmarks[0].x, hand.landmarks[0].y);
  ctx.fillStyle = "rgba(155, 135, 245, 0.2)";
  ctx.fill();
  ctx.strokeStyle = "#9b87f5";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw all points with a glow effect
  for (let i = 0; i < hand.landmarks.length; i++) {
    const landmark = hand.landmarks[i];
    
    // Draw outer glow
    ctx.beginPath();
    ctx.arc(landmark.x, landmark.y, 7, 0, 3 * Math.PI);
    ctx.fillStyle = "rgba(155, 135, 245, 0.3)";
    ctx.fill();
    
    // Draw inner point
    ctx.beginPath();
    ctx.arc(landmark.x, landmark.y, 4, 0, 3 * Math.PI);
    ctx.fillStyle = "#9b87f5";
    ctx.fill();
  }
  
  // Draw fingers
  const fingers = Object.keys(fingerJoints);
  
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i] as keyof typeof fingerJoints;
    const points = fingerJoints[finger];
    const color = fingerColors[finger as keyof typeof fingerColors];
    
    // Loop through finger joints
    for (let j = 0; j < points.length - 1; j++) {
      const pointA = hand.landmarks[points[j]];
      const pointB = hand.landmarks[points[j + 1]];
      
      // Draw path with gradient
      ctx.beginPath();
      ctx.moveTo(pointA.x, pointA.y);
      ctx.lineTo(pointB.x, pointB.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
};

// Utility function to convert raw annotations to Keypoint format
export const convertAnnotationsToKeypoints = (
  rawAnnotations: { [key: string]: [number, number, number][] }
): Record<string, Keypoint[]> => {
  const result: Record<string, Keypoint[]> = {};
  
  Object.keys(rawAnnotations).forEach(key => {
    result[key] = rawAnnotations[key].map(point => ({
      x: point[0],
      y: point[1],
      z: point[2]
    }));
  });
  
  return result;
};
