
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCamera}
            className="transition-all duration-300 hover:bg-primary/20"
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
