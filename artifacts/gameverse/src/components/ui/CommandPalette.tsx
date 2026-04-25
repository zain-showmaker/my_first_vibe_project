import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Gamepad2 } from "lucide-react";
import { useLocation } from "wouter";
import { games } from "@/data/games";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden bg-surface border-border2 shadow-2xl max-w-xl rounded-2xl">
        <Command className="w-full flex flex-col bg-transparent" label="Global Command Menu">
          <div className="flex items-center border-b border-border2 px-4">
            <Search className="w-5 h-5 text-muted mr-2" />
            <Command.Input
              className="flex-1 h-14 bg-transparent outline-none placeholder:text-muted text-white"
              placeholder="Search for games, characters, or locations..."
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-surface3 scrollbar-track-transparent">
            <Command.Empty className="py-6 text-center text-sm text-muted">No results found.</Command.Empty>

            <Command.Group heading="Games" className="text-xs font-semibold text-muted px-2 py-1.5 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-muted2">
              {games.map((game) => (
                <Command.Item
                  key={game.slug}
                  onSelect={() => {
                    setLocation(`/wiki/${game.slug}`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2 aria-selected:text-white group"
                >
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border">
                    <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{game.title}</div>
                    <div className="text-xs text-muted font-normal">{game.developer} • {game.year}</div>
                  </div>
                  <div
                    className="text-[10px] font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${game.themeColor}20`, color: game.themeColor }}
                  >
                    {game.scores.metacritic}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
            
            <Command.Group heading="Pages" className="text-xs font-semibold text-muted px-2 py-1.5 mt-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-muted2">
              <Command.Item
                onSelect={() => { setLocation(`/browse`); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2 aria-selected:text-white"
              >
                <div className="w-8 h-8 bg-surface2 rounded flex items-center justify-center text-muted"><Search size={14} /></div>
                Browse Library
              </Command.Item>
              <Command.Item
                onSelect={() => { setLocation(`/watchlist`); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2 aria-selected:text-white"
              >
                <div className="w-8 h-8 bg-surface2 rounded flex items-center justify-center text-muted"><Gamepad2 size={14} /></div>
                My Watchlist
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
