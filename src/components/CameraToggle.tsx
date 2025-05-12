
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

  const toggleCamera = async () => {
    try {
      // Request camera permission explicitly before toggling
      if (!isActive) {
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      const newState = !isActive;
      setIsActive(newState);
      onToggle(newState);
      
      toast({
        title: newState ? "Camera activated" : "Camera deactivated",
        description: newState ? "Hand tracking is now active" : "Hand tracking is now disabled",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use hand tracking",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

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
