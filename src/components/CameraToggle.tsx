
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Camera, CameraOff } from "lucide-react";

interface CameraToggleProps {
  onToggle: (isActive: boolean) => void;
}

export function CameraToggle({ onToggle }: CameraToggleProps) {
  const [isActive, setIsActive] = useState(false);

  const toggleCamera = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleCamera}
      className="transition-all duration-300"
    >
      {isActive ? (
        <CameraOff className="h-5 w-5" />
      ) : (
        <Camera className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle camera</span>
    </Button>
  );
}
