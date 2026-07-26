import { Heart } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "../ui/SocialIcons";
import { socialLinks } from "../../data/portfolio";
import { scrollToSection } from "../../lib/scrollToSection";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const socialProfiles = [
  { icon: GitHubIcon, href: socialLinks.github, label: "GitHub" },
  { icon: LinkedInIcon, href: socialLinks.linkedin, label: "LinkedIn" },
  { icon: XIcon, href: socialLinks.twitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-border min-h-[60vh] md:min-h-screen flex flex-col justify-center bg-background relative z-10">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 flex-1 flex flex-col justify-between">
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mt-auto mb-auto">
          {/* Logo + tagline */}
          <div className="max-w-md">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#hero");
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}>
              Bipul<span className="text-primary">.</span>
            </a>
            <p className="mt-6 text-lg md:text-2xl text-muted-foreground leading-relaxed tracking-[0.01em]">
              Building the future, one commit at a time. Full-stack products,
              premium UI/UX, and DevOps that never flinches.
            </p>
          </div>

          {/* Right Side Links & Socials */}
          <div className="flex flex-col items-start md:items-end gap-10">
            {/* Quick links */}
            <nav className="flex flex-wrap items-center gap-6 md:gap-10">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-lg md:text-xl font-medium text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {socialProfiles.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                    aria-label={social.label}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-5 w-full">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-[0.01em]">
            &copy; {new Date().getFullYear()} Bipul. All rights reserved.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-[0.01em] flex items-center gap-1.5">
            Built with React, motion, and obsessive attention to detail.
            <Heart className="w-4 h-4 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
