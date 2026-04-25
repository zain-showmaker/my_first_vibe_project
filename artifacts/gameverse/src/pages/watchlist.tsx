import { Link } from "wouter";
import { Gamepad2, Heart, Shield, Sword, Search } from "lucide-react";
import { games } from "@/data/games";
import { useWatchlist } from "@/hooks/use-watchlist";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/button";

export default function Watchlist() {
  const { watchlist } = useWatchlist();
  
  const savedGames = games.filter(g => watchlist.includes(g.slug));

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Heart className="text-primary fill-primary" /> My Watchlist
          </h1>
          <p className="text-muted-foreground">Games you're tracking or planning to play.</p>
        </div>

        {savedGames.length === 0 ? (
          <div className="bg-surface border border-border2 rounded-3xl p-12 flex flex-col items-center text-center max-w-2xl mx-auto mt-20">
            <div className="w-24 h-24 bg-surface2 rounded-full flex items-center justify-center mb-6 border border-border">
              <Gamepad2 size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Keep track of games you want to play, lore you want to dive into, or wikis you want to read.
            </p>
            <Link href="/browse">
              <Button className="h-12 px-8 rounded-xl font-bold bg-primary text-black hover:bg-[#d4eb3a] gap-2">
                <Search size={18} /> Browse Library
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {savedGames.map(game => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
