
import { Github, Instagram, Linkedin } from "lucide-react";

export function SocialLinks() {
  return (
    <div className="flex justify-center gap-6 mt-4">
      <a 
        href="https://www.linkedin.com/in/lokesh-soni-2b3b7034a/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transform transition-transform hover:scale-125 duration-300"
      >
        <Linkedin className="h-6 w-6" />
      </a>
      <a 
        href="https://instagram.com/lokesh.soni194" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transform transition-transform hover:scale-125 duration-300"
      >
        <Instagram className="h-6 w-6" />
      </a>
      <a 
        href="https://github.com/lokeshhsoni" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transform transition-transform hover:scale-125 duration-300"
      >
        <Github className="h-6 w-6" />
      </a>
    </div>
  );
}
