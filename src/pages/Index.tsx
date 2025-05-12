
import { useState } from "react";
import { HandTracking } from "@/components/HandTracking";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CameraToggle } from "@/components/CameraToggle";
import { ProfileSection } from "@/components/ProfileSection";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [cameraActive, setCameraActive] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-background to-secondary/5">
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-hands text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Lokesh Yantra</h1>
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        
        <Card className="glass-card w-full max-w-2xl mx-auto overflow-hidden border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Hand Tracking Demo</CardTitle>
            <CardDescription className="text-center">
              Wave your hand in front of the camera to see real-time tracking
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="aspect-video w-full rounded-lg overflow-hidden relative mb-4">
              <HandTracking isActive={cameraActive} />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            <CameraToggle onToggle={setCameraActive} />
            <ThemeToggle />
          </CardFooter>
        </Card>
        
        <div className="mt-12">
          <ProfileSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
