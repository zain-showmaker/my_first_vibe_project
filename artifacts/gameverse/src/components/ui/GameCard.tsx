import { Link } from "wouter";
import { Calendar, Bookmark, BookmarkCheck, Star } from "lucide-react";
import type { GameSummary } from "@workspace/api-client-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { Badge } from "@/components/ui/badge";
import { formatReleaseDate, metacriticTone } from "@/lib/format";

interface GameCardProps {
  game: GameSummary;
  variant?: "default" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const watched = isWatched(game.slug);
  const tone = metacriticTone(game.metacritic ?? null);
  const primaryGenre = game.genres?.[0]?.name;
  const platforms = game.parentPlatforms?.map((p) => p.platform.name) ?? [];

  return (
    <Link href={`/games/${game.slug}`}>
      <div
        className="group relative bg-surface border border-border2 rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#333] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full"
        data-testid={`game-card-${game.slug}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-surface2">
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent z-10" />
          {game.backgroundImage ? (
            <img
              src={game.backgroundImage}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-surface3 text-muted-foreground text-xs px-3 text-center font-semibold">
              {game.name}
            </div>
          )}

          {game.metacritic != null && (
            <div
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 border-black shadow-lg"
              style={{ backgroundColor: tone.bg, color: tone.text }}
            >
              {game.metacritic}
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist({
                slug: game.slug,
                name: game.name,
                backgroundImage: game.backgroundImage ?? null,
                released: game.released ?? null,
                metacritic: game.metacritic ?? null,
                rating: game.rating,
              });
            }}
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/85 transition-colors border border-white/10"
            aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
            data-testid={`watch-toggle-${game.slug}`}
          >
            {watched ? (
              <BookmarkCheck size={14} className="text-primary" />
            ) : (
              <Bookmark size={14} />
            )}
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {primaryGenre && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase tracking-wider font-bold bg-surface2 text-muted-foreground border-border hover:bg-surface2"
              >
                {primaryGenre}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-[11px] text-muted font-medium">
              <Calendar size={12} />
              {formatReleaseDate(game.released, game.tba)}
            </div>
          </div>

          <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {game.name}
          </h3>

          {variant === "default" && (
            <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Star size={12} className="text-orange-400 fill-orange-400" />
                <span>{game.rating?.toFixed(1) ?? "—"}</span>
                <span className="text-muted font-normal">/ {game.ratingTop}</span>
              </div>
              <div className="flex gap-1">
                {platforms.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-surface2 text-muted border border-border2"
                  >
                    {p}
                  </span>
                ))}
                {platforms.length > 3 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface2 text-muted border border-border2">
                    +{platforms.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-surface border border-border2 rounded-[14px] overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-[3/4] bg-surface2" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-20 bg-surface2 rounded" />
        <div className="h-4 w-full bg-surface2 rounded" />
        <div className="h-4 w-2/3 bg-surface2 rounded" />
        <div className="pt-3 border-t border-border/50 flex justify-between">
          <div className="h-3 w-16 bg-surface2 rounded" />
          <div className="h-3 w-20 bg-surface2 rounded" />
        </div>
      </div>
    </div>
  );
}
