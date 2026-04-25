import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Library, Bookmark, Newspaper, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useListGames, getListGamesQueryKey } from "@workspace/api-client-react";
import { metacriticTone, formatYear } from "@/lib/format";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const searchParams = { search: debounced, pageSize: 8 };
  const { data, isFetching } = useListGames(searchParams, {
    query: {
      enabled: debounced.length >= 2,
      queryKey: getListGamesQueryKey(searchParams),
    },
  });

  const results = data?.results ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden bg-surface border-border2 shadow-2xl max-w-xl rounded-2xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search across the GameVerse library and quick navigation.
        </DialogDescription>
        <Command
          className="w-full flex flex-col bg-transparent"
          label="Global Command Menu"
          shouldFilter={false}
        >
          <div className="flex items-center border-b border-border2 px-4">
            <Search className="w-5 h-5 text-muted mr-2" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              className="flex-1 h-14 bg-transparent outline-none placeholder:text-muted text-white"
              placeholder="Search any game..."
              data-testid="input-search"
            />
            {isFetching && debounced && (
              <Loader2 className="w-4 h-4 text-muted animate-spin" />
            )}
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            {debounced.length < 2 ? (
              <Command.Empty className="py-6 text-center text-sm text-muted">
                Type at least 2 characters to search the catalog.
              </Command.Empty>
            ) : results.length === 0 && !isFetching ? (
              <Command.Empty className="py-6 text-center text-sm text-muted">
                No games match "{debounced}"
              </Command.Empty>
            ) : (
              <Command.Group
                heading="Games"
                className="text-xs font-semibold text-muted px-2 py-1.5 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-muted2"
              >
                {results.map((game) => {
                  const tone = metacriticTone(game.metacritic ?? null);
                  return (
                    <Command.Item
                      key={game.slug}
                      value={game.slug}
                      onSelect={() => {
                        setLocation(`/games/${game.slug}`);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2 aria-selected:text-white"
                      data-testid={`search-result-${game.slug}`}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-border bg-surface2">
                        {game.backgroundImage ? (
                          <img
                            src={game.backgroundImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{game.name}</div>
                        <div className="text-xs text-muted font-normal truncate">
                          {game.genres?.[0]?.name ?? "Game"} • {formatYear(game.released)}
                        </div>
                      </div>
                      {game.metacritic != null && (
                        <div
                          className="text-[10px] font-bold px-2 py-1 rounded"
                          style={{ backgroundColor: `${tone.bg}25`, color: tone.bg }}
                        >
                          {game.metacritic}
                        </div>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            <Command.Group
              heading="Quick links"
              className="text-xs font-semibold text-muted px-2 py-1.5 mt-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-muted2"
            >
              <Command.Item
                value="browse"
                onSelect={() => {
                  setLocation("/browse");
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2"
              >
                <div className="w-8 h-8 bg-surface2 rounded flex items-center justify-center text-muted">
                  <Library size={14} />
                </div>
                Browse the library
              </Command.Item>
              <Command.Item
                value="news"
                onSelect={() => {
                  setLocation("/news");
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2"
              >
                <div className="w-8 h-8 bg-surface2 rounded flex items-center justify-center text-muted">
                  <Newspaper size={14} />
                </div>
                Latest gaming news
              </Command.Item>
              <Command.Item
                value="watchlist"
                onSelect={() => {
                  setLocation("/watchlist");
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg cursor-pointer hover:bg-surface2 aria-selected:bg-surface2"
              >
                <div className="w-8 h-8 bg-surface2 rounded flex items-center justify-center text-muted">
                  <Bookmark size={14} />
                </div>
                Your watchlist
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
