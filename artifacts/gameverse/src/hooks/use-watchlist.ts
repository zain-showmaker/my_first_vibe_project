import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("gameverse_watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("gameverse_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (slug: string, gameName: string) => {
    setWatchlist((prev) => {
      const isWatched = prev.includes(slug);
      if (isWatched) {
        toast.success(`Removed ${gameName} from watchlist`, { icon: "🔖" });
        return prev.filter((s) => s !== slug);
      } else {
        toast.success(`Added ${gameName} to watchlist`, { icon: "🔖" });
        return [...prev, slug];
      }
    });
  };

  const isWatched = (slug: string) => watchlist.includes(slug);

  return { watchlist, toggleWatchlist, isWatched };
}
