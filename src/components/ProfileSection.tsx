
import { SocialLinks } from "./SocialLinks";

export function ProfileSection() {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
        <img 
          src="/lokesh-profile.jpg" 
          alt="Lokesh Soni" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/150"; // Fallback image
          }}
        />
      </div>
      <h2 className="text-xl font-hands mb-2">Lokesh Soni</h2>
      <SocialLinks />
    </div>
  );
}
