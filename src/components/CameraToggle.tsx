
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface CameraToggleProps {
  onToggle: (isActive: boolean) => void;
}

export function CameraToggle({ onToggle }: CameraToggleProps) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast: uiToast } = useToast();

  // Check camera permissions on component mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Request camera permission explicitly
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setHasPermission(permissions.state === 'granted');
        
        permissions.onchange = () => {
          setHasPermission(permissions.state === 'granted');
        };
      } catch (error) {
        console.log('Permissions API not supported, will check on toggle');
      }
    };
    
    checkCameraPermission();
  }, []);

  const toggleCamera = async () => {
    try {
      // Request camera permission explicitly before toggling
      if (!isActive) {
        // Show requesting permission toast
        toast.loading("Requesting camera access...", {
          id: "camera-permission",
          duration: 10000
        });
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: "user"
          } 
        });
        
        // Dismiss requesting permission toast
        toast.dismiss("camera-permission");
        
        // If we got here, permission was granted
        setHasPermission(true);
        
        // Stop this temporary stream since the HandTracking component will request its own
        stream.getTracks().forEach(track => track.stop());
        
        const newState = true;
        setIsActive(newState);
        onToggle(newState);
        
        toast.success("Camera activated", {
          description: "Hand tracking is now active"
        });
      } else {
        // Turn off camera
        const newState = false;
        setIsActive(newState);
        onToggle(newState);
        
        toast.info("Camera deactivated", {
          description: "Hand tracking is now disabled"
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      
      // Dismiss requesting permission toast
      toast.dismiss("camera-permission");
      
      toast.error("Camera access denied", {
        description: "Please allow camera access to use hand tracking",
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
              'bg-primary/20 hover:bg-primary/30 border-primary/50' : 
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
