import { Link, useLocation } from "wouter";
import { Gamepad2, Search, Bookmark, Newspaper, Library, Home, Info, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/CommandPalette";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Library },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 h-16 transition-all duration-300 ${
          isScrolled || mobileOpen
            ? "bg-black/90 backdrop-blur-md border-b border-border"
            : "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-3 font-extrabold text-lg tracking-tight cursor-pointer" data-testid="link-home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
                <Gamepad2 size={18} strokeWidth={2.5} />
              </div>
              <span className="text-white">
                Game<span className="text-primary">Verse</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            {NAV.filter((n) => n.href !== "/").map((n) => (
              <Link key={n.href} href={n.href}>
                <div
                  className={`cursor-pointer transition-colors hover:text-white ${
                    isActive(n.href) ? "text-white" : ""
                  }`}
                  data-testid={`nav-${n.label.toLowerCase()}`}
                >
                  {n.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex bg-surface2 border-border text-muted-foreground hover:text-white hover:bg-surface3 h-9 px-4 rounded-xl gap-2 font-medium"
            onClick={() => setCmdOpen(true)}
            data-testid="button-search"
          >
            <Search size={14} />
            <span>Search games...</span>
            <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setCmdOpen(true)}
            data-testid="button-search-mobile"
          >
            <Search size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileOpen((v) => !v)}
            data-testid="button-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-border md:hidden">
          <div className="flex flex-col px-4 py-2">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-lg cursor-pointer ${
                      isActive(n.href)
                        ? "text-primary bg-surface2"
                        : "text-muted-foreground hover:text-white hover:bg-surface2"
                    }`}
                  >
                    <Icon size={16} />
                    {n.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </>
  );
}
