import { useState, useMemo } from "react";
import { Link } from "wouter";
import { games } from "@/data/games";
import { GameCard } from "@/components/ui/GameCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortDesc, List, Grid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("score-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const genres = ["all", ...Array.from(new Set(games.map(g => g.genre)))];

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) || 
                              game.developer.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = genreFilter === "all" || game.genre === genreFilter;
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortOrder === "score-desc") return b.scores.metacritic - a.scores.metacritic;
        if (sortOrder === "year-desc") return b.year - a.year;
        if (sortOrder === "alpha-asc") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [search, genreFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2">Browse Library</h1>
            <p className="text-muted-foreground">Explore {games.length} curated wikis in the GameVerse.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, developers..." 
                className="pl-9 bg-surface border-border2"
              />
            </div>
            
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[140px] bg-surface border-border2">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(g => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g === "all" ? "All Genres" : g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[160px] bg-surface border-border2">
                <SortDesc className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Highest Rated</SelectItem>
                <SelectItem value="year-desc">Newest First</SelectItem>
                <SelectItem value="alpha-asc">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center bg-surface border border-border2 rounded-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded ${viewMode === 'grid' ? 'bg-surface3 text-white' : 'text-muted-foreground'}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded ${viewMode === 'list' ? 'bg-surface3 text-white' : 'text-muted-foreground'}`}
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border2 rounded-2xl">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">No games found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setGenreFilter("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "flex flex-col gap-4"
          }>
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                {viewMode === 'grid' ? (
                  <GameCard game={game} />
                ) : (
                  <Link href={`/wiki/${game.slug}`}>
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-surface border border-border2 hover:border-primary transition-colors cursor-pointer group">
                      <img src={game.coverUrl} alt={game.title} className="w-16 h-24 rounded object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{game.title}</h3>
                          <span className="text-xs bg-surface2 px-2 py-0.5 rounded text-muted-foreground">{game.year}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{game.developer}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                            {game.scores.metacritic}
                          </span>
                          <span className="text-xs text-muted-foreground">{game.genre}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
