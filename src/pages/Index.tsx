
import { useState, useEffect } from "react";
import { HandTracking } from "@/components/HandTracking";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CameraToggle } from "@/components/CameraToggle";
import { ProfileSection } from "@/components/ProfileSection";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const themeOptions = [
  { id: "default", name: "Default", 
    classes: "from-background to-secondary/5", 
    textClasses: "from-primary to-purple-400" },
  { id: "cyberpunk", name: "Cyberpunk", 
    classes: "from-purple-900 to-pink-600", 
    textClasses: "from-yellow-300 to-pink-500" },
  { id: "neon", name: "Neon", 
    classes: "from-black to-blue-900", 
    textClasses: "from-green-400 to-blue-500" },
  { id: "gradient", name: "Gradient", 
    classes: "from-indigo-500 via-purple-500 to-pink-500", 
    textClasses: "from-yellow-200 to-yellow-500" }
];

const Index = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themeOptions[0]);
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-gradient-to-br ${currentTheme.classes}`}>
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className={`text-4xl font-bold text-center bg-gradient-to-r ${currentTheme.textClasses} bg-clip-text text-transparent`}>
              Lokesh Yantra
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-center max-w-md">
            Interactive hand tracking demo powered by TensorFlow.js and computer vision
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {themeOptions.map((option) => (
            <Button 
              key={option.id}
              variant={currentTheme.id === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTheme(option)}
              className="text-xs"
            >
              {option.name}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className={`glass-card overflow-hidden border border-white/10 shadow-xl h-full ${theme === 'dark' ? 'neo-blur' : 'glass-morphism'}`}>
              <CardHeader className="bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm">
                <CardTitle className={`text-center bg-gradient-to-r ${currentTheme.textClasses} bg-clip-text text-transparent`}>
                  Hand Tracking Demo
                </CardTitle>
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
            <Card className={`glass-card border border-white/10 shadow-xl ${theme === 'dark' ? 'neo-blur' : 'glass-morphism'}`}>
              <CardHeader>
                <CardTitle className={`text-base font-medium bg-gradient-to-r ${currentTheme.textClasses} bg-clip-text text-transparent`}>
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>TensorFlow.js</span>
                      <span>90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${currentTheme.textClasses}`} style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Computer Vision</span>
                      <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${currentTheme.textClasses}`} style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Machine Learning</span>
                      <span>75%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${currentTheme.textClasses}`} style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>React Development</span>
                      <span>88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${currentTheme.textClasses}`} style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>UI/UX Design</span>
                      <span>70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${currentTheme.textClasses}`} style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`glass-card border border-white/10 shadow-xl ${theme === 'dark' ? 'neo-blur' : 'glass-morphism'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base font-medium bg-gradient-to-r ${currentTheme.textClasses} bg-clip-text text-transparent`}>
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  Hand tracking specialist with expertise in computer vision and machine learning technologies. Passionate about creating interactive experiences using cutting-edge AI models.
                </p>
                <p className="text-sm text-muted-foreground">
                  Currently working on advanced gesture recognition systems for next-generation human-computer interaction.
                </p>
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
