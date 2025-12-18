"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectKitButton } from "connectkit";
import { AuthService } from "@/api/services/AuthService";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import Image from "next/image";

export function Navbar() {
  const t = useTranslations("Navbar");
  const [navLinks, setNavLinks] = useState([
    { name: t("home"), path: "/" },
    { name: t("market"), path: "/market" },
    { name: t("courses"), path: "/courses" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const checkAdmin = async () => {
    const isAdmin = await AuthService.authControllerIsAdmin();
    if (isAdmin.data?.hasAccess) {
      setNavLinks([...navLinks, { name: t("admin"), path: "/admin" }]);
    } else {
      setNavLinks(navLinks.filter((link) => link.name !== t("admin")));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    checkAdmin();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("checkAdmin", checkAdmin);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("checkAdmin", checkAdmin);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled ? "bg-background/80 backdrop-blur-md shadow-md border-b border-white/[0.05]" : "bg-transparent")}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image src={"/icon.jpeg"} fill sizes="32px" className="object-contain" alt="logo" />
          </div>
          <span className="font-bold text-xl tracking-tight">{t("title")}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm",
                isActive(link.path) ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Connect Wallet */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <ConnectKitButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-white/[0.05]">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "px-4 py-3 rounded-md transition-all duration-200 font-medium",
                    isActive(link.path) ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center pt-2 border-t border-white/[0.05]">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
