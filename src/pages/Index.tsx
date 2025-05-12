
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
  CardTitle 
} from "@/components/ui/card";

const Index = () => {
  const [cameraActive, setCameraActive] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-hands text-center mb-8">Lokesh Yantra</h1>
        
        <Card className="glass-card w-full max-w-2xl mx-auto overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center">Hand Tracking Demo</CardTitle>
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
