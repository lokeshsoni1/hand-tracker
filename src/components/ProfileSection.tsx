
import { SocialLinks } from "./SocialLinks";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileSection() {
  return (
    <Card className="glass-card animate-fade-in border border-white/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 p-1">
              <img 
                src="/lokesh-profile.jpg" 
                alt="Lokesh Soni" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=LS"; // Fallback image
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">LS</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-xl font-hands mb-1">Lokesh Soni</h2>
            <p className="text-sm text-muted-foreground mb-4">Hand Tracking Enthusiast</p>
            <SocialLinks />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
