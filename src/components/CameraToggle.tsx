
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface CameraToggleProps {
  onToggle: (isActive: boolean) => void;
}

export function CameraToggle({ onToggle }: CameraToggleProps) {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const toggleCamera = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle(newState);
    
    toast({
      title: newState ? "Camera activated" : "Camera deactivated",
      description: newState ? "Hand tracking is now active" : "Hand tracking is now disabled",
      duration: 2000,
    });
  };

  // Request permission immediately when component loads
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Just check if we can access the camera, don't actually use it yet
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        if (!hasCamera) {
          toast({
            title: "No camera detected",
            description: "Please connect a camera to use hand tracking",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error checking camera:", error);
      }
    };
    
    checkCameraPermission();
  }, [toast]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCamera}
            className={`transition-all duration-300 ${isActive ? 
              'bg-primary/20 hover:bg-primary/30' : 
              'hover:bg-primary/20'}`}
          >
            {isActive ? (
              <CameraOff className="h-5 w-5" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle camera</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isActive ? 'Turn camera off' : 'Turn camera on'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
