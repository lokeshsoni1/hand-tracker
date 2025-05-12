
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
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Lokesh Yantra</h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-center max-w-md">
            Interactive hand tracking demo powered by TensorFlow.js and computer vision
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="glass-card overflow-hidden border border-white/10 shadow-xl h-full">
              <CardHeader className="bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm">
                <CardTitle className="text-center">Hand Tracking Demo</CardTitle>
                <CardDescription className="text-center">
                  Wave your hand in front of the camera to see real-time tracking
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="aspect-video w-full rounded-lg overflow-hidden relative mb-4">
                  <HandTracking isActive={cameraActive} />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center gap-4 pb-6">
                <CameraToggle onToggle={setCameraActive} />
                <ThemeToggle />
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex flex-col gap-4">
            <Card className="glass-card border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-base font-medium">Experience</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <div>
                      <h3 className="text-sm font-medium">Hand Tracking Engineer</h3>
                      <p className="text-xs text-muted-foreground">TensorFlow Research • 2022-Present</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <div>
                      <h3 className="text-sm font-medium">Computer Vision Specialist</h3>
                      <p className="text-xs text-muted-foreground">OpenCV Foundation • 2020-2022</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                    <div>
                      <h3 className="text-sm font-medium">ML Research Assistant</h3>
                      <p className="text-xs text-muted-foreground">AI Research Lab • 2018-2020</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-base font-medium">Skills</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>TensorFlow.js</span>
                      <span>90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Computer Vision</span>
                      <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Machine Learning</span>
                      <span>75%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8">
          <ProfileSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
