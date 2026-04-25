import { Link } from "wouter";
import { Star, Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import { Game } from "@/data/games";
import { useWatchlist } from "@/hooks/use-watchlist";
import { Badge } from "@/components/ui/badge";

export function GameCard({ game }: { game: Game }) {
  const { isWatched, toggleWatchlist } = useWatchlist();
  const watched = isWatched(game.slug);

  return (
    <Link href={`/wiki/${game.slug}`}>
      <div className="group relative bg-surface border border-border2 rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#333] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full">
        {/* Cover Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface2">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Score Badge */}
          <div 
            className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 border-black shadow-lg"
            style={{ backgroundColor: game.themeColor, color: '#000' }}
          >
            {game.scores.metacritic}
          </div>

          {/* Watchlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist(game.slug, game.title);
            }}
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10"
          >
            {watched ? <BookmarkCheck size={14} className="text-primary" /> : <Bookmark size={14} />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-surface2 text-muted-foreground border-border hover:bg-surface2">
              {game.genre}
            </Badge>
            <div className="flex items-center gap-1 text-[11px] text-muted font-medium">
              <Calendar size={12} />
              {game.year}
            </div>
          </div>
          
          <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {game.title}
          </h3>
          
          <p className="text-xs text-muted font-medium mb-4">
            {game.developer}
          </p>

          <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Star size={12} className="text-orange-400 fill-orange-400" />
              <span>{game.scores.user}</span>
              <span className="text-muted font-normal ml-1">User</span>
            </div>
            
            <div className="flex gap-1">
              {game.platforms.slice(0, 3).map(p => (
                <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-surface2 text-muted border border-border2">
                  {p}
                </span>
              ))}
              {game.platforms.length > 3 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface2 text-muted border border-border2">
                  +{game.platforms.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
