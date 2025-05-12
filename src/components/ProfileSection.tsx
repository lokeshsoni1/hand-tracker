
import { SocialLinks } from "./SocialLinks";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export function ProfileSection() {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="glass-card animate-fade-in border border-white/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 p-1">
              <Avatar className="w-full h-full">
                {!imageError ? (
                  <AvatarImage 
                    src="/lokesh-profile.jpg" 
                    alt="Lokesh Soni"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-2xl w-full h-full bg-primary/20 text-primary flex items-center justify-center">
                    LS
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">LS</span>
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1">Lokesh Soni</h2>
              <p className="text-sm text-muted-foreground mb-1">Hand Tracking Enthusiast</p>
              <div className="h-1 w-20 md:mx-0 mx-auto bg-gradient-to-r from-primary to-purple-400 rounded-full"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Machine Learning</span>
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Hand Tracking</span>
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Computer Vision</span>
            </div>
            
            <SocialLinks />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
