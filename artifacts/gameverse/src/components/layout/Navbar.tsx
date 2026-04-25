import { Link, useLocation } from "wouter";
import { Gamepad2, Search, Bookmark, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-3 font-extrabold text-lg tracking-tight cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
                <Gamepad2 size={18} strokeWidth={2.5} />
              </div>
              <span className="text-white">
                Game<span className="text-primary">Verse</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href="/browse">
              <div className={`cursor-pointer transition-colors hover:text-white ${location === '/browse' ? 'text-white' : ''}`}>Browse</div>
            </Link>
            <Link href="/watchlist">
              <div className={`cursor-pointer transition-colors hover:text-white ${location === '/watchlist' ? 'text-white' : ''}`}>Watchlist</div>
            </Link>
            <Link href="/about">
              <div className={`cursor-pointer transition-colors hover:text-white ${location === '/about' ? 'text-white' : ''}`}>About</div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex bg-surface2 border-border text-muted-foreground hover:text-white hover:bg-surface3 h-9 px-4 rounded-xl gap-2 font-medium"
            onClick={() => setCmdOpen(true)}
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
          >
            <Search size={20} />
          </Button>

          <Link href="/watchlist">
            <Button
              variant="outline"
              size="icon"
              className="bg-surface2 border-border text-white hover:bg-surface3 h-9 w-9 rounded-xl hidden sm:flex"
            >
              <Bookmark size={16} />
            </Button>
          </Link>
        </div>
      </nav>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </>
  );
}
