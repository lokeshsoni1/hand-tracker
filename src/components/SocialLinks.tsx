
import { Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SocialLinks() {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/lokesh-soni-2b3b7034a/", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/lokesh.soni194", label: "Instagram" },
    { icon: Github, href: "https://github.com/lokeshhsoni", label: "GitHub" },
  ];

  return (
    <div className="flex justify-center md:justify-start gap-2">
      <TooltipProvider>
        {socialLinks.map((link) => (
          <Tooltip key={link.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:scale-110 transition-all duration-300 hover:bg-primary/20"
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-5 w-5" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
