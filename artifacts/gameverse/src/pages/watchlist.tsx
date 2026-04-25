import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Bookmark, Library, Trash2 } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { formatReleaseDate, metacriticTone } from "@/lib/format";

export default function Watchlist() {
  useEffect(() => {
    document.title = "Watchlist — GameVerse";
  }, []);

  const { watchlist, toggleWatchlist } = useWatchlist();

  return (
    <div className="pt-24 pb-24 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
          <Bookmark size={12} strokeWidth={2.5} /> Saved entries
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Your watchlist
        </h1>
        <p className="text-sm text-muted mt-2 max-w-xl">
          {watchlist.length === 0
            ? "Bookmark games anywhere on the site to keep tabs on them here."
            : `${watchlist.length} game${watchlist.length === 1 ? "" : "s"} you're tracking.`}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-surface border border-border2 rounded-2xl p-12 text-center">
          <Bookmark size={32} className="mx-auto text-muted2 mb-4" />
          <h2 className="text-lg font-bold mb-2">Nothing saved yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Tap the bookmark icon on any game card or detail page and it'll show up
            here, no account required.
          </p>
          <Link href="/browse">
            <button className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <Library size={14} /> Browse the library
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((g, i) => {
            const tone = metacriticTone(g.metacritic);
            return (
              <motion.div
                key={g.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="group relative bg-surface border border-border2 rounded-2xl overflow-hidden hover:border-[#333] transition-colors"
                data-testid={`watchlist-${g.slug}`}
              >
                <Link href={`/games/${g.slug}`}>
                  <div className="cursor-pointer">
                    <div className="relative aspect-[16/9] bg-surface2">
                      {g.backgroundImage ? (
                        <img
                          src={g.backgroundImage}
                          alt={g.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs px-3 text-center">
                          {g.name}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {g.metacritic != null && (
                        <div
                          className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 border-black"
                          style={{ backgroundColor: tone.bg, color: tone.text }}
                        >
                          {g.metacritic}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {g.name}
                      </h3>
                      <p className="text-xs text-muted">{formatReleaseDate(g.released)}</p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => toggleWatchlist(g)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-500/90 hover:border-red-400 transition-colors flex items-center justify-center"
                  aria-label="Remove from watchlist"
                  data-testid={`remove-${g.slug}`}
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
