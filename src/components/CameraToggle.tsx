
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface CameraToggleProps {
  onToggle: (isActive: boolean) => void;
}

export function CameraToggle({ onToggle }: CameraToggleProps) {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cleanup effect to ensure camera is properly turned off when component unmounts
  useEffect(() => {
    return () => {
      // Try to stop any potentially active streams when component unmounts
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          // Ignore errors since this is just cleanup
        });
    };
  }, []);

  const toggleCamera = async () => {
    try {
      // Already in process of toggling
      if (isLoading) return;
      
      setIsLoading(true);
      
      if (!isActive) {
        // Show requesting permission toast
        toast.loading("Requesting camera access...", {
          id: "camera-permission",
          duration: 5000 // Reduced timeout for better UX
        });
        
        try {
          // Request camera permission explicitly but don't keep this stream
          const tempStream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 }
            },
            audio: false
          });
          
          // Stop temporary stream right away after confirming access
          tempStream.getTracks().forEach(track => track.stop());
          
          // Dismiss loading toast
          toast.dismiss("camera-permission");
          
          // Update state
          setIsActive(true);
          onToggle(true);
          
          toast.success("Camera activated", {
            description: "Hand tracking is now active"
          });
        } catch (error) {
          console.error("Camera permission error:", error);
          throw error;
        }
      } else {
        // Turn off camera
        setIsActive(false);
        onToggle(false);
        
        toast.info("Camera deactivated", {
          description: "Hand tracking is now disabled"
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      // Dismiss requesting permission toast
      toast.dismiss("camera-permission");
      
      toast.error("Camera access denied", {
        description: "Please allow camera access to use hand tracking",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className={`transition-all duration-300 ${
              isActive ? 'bg-primary/20 hover:bg-primary/30 border-primary/50' : 'hover:bg-primary/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : isActive ? (
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
