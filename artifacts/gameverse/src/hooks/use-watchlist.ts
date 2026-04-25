import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface WatchEntry {
  slug: string;
  name: string;
  backgroundImage: string | null;
  released: string | null;
  metacritic: number | null;
  rating: number;
}

const KEY = "gameverse_watchlist_v2";
const LEGACY_KEY = "gameverse_watchlist";

function load(): WatchEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as WatchEntry[];
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const slugs: string[] = JSON.parse(legacy);
      return slugs.map((slug) => ({
        slug,
        name: slug,
        backgroundImage: null,
        released: null,
        metacritic: null,
        rating: 0,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchEntry[]>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const isWatched = (slug: string) => watchlist.some((w) => w.slug === slug);

  const toggleWatchlist = (entry: WatchEntry) => {
    setWatchlist((prev) => {
      if (prev.some((w) => w.slug === entry.slug)) {
        toast.success(`Removed ${entry.name} from watchlist`);
        return prev.filter((w) => w.slug !== entry.slug);
      }
      toast.success(`Added ${entry.name} to watchlist`);
      return [entry, ...prev];
    });
  };

  return { watchlist, toggleWatchlist, isWatched };
}
