import { Link } from "wouter";
import { Search, Flame, ArrowRight, TrendingUp, Users } from "lucide-react";
import { games } from "@/data/games";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const featuredGame = games[0]; // Elden Ring
  const trendingGames = games.slice(1, 5);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={featuredGame.heroUrl} 
            alt={featuredGame.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/30">
              <Flame size={14} /> Featured Wiki
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
              {featuredGame.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 line-clamp-3">
              {featuredGame.synopsis[0]}
            </p>
            
            <div className="flex items-center gap-4">
              <Link href={`/wiki/${featuredGame.slug}`}>
                <Button className="h-12 px-8 rounded-xl font-bold bg-primary text-black hover:bg-[#d4eb3a] text-base border border-primary">
                  Explore Wiki
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" className="h-12 px-8 rounded-xl font-bold bg-surface2 text-white hover:bg-surface3 border-border text-base">
                  Browse All
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mt-10">
        <main className="space-y-16">
          {/* Trending Wikis */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="text-primary" />
                Trending Wikis
              </h2>
              <Link href="/browse" className="text-sm font-semibold text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trendingGames.map((game, i) => (
                <motion.div
                  key={game.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recently Added Section (Mock) */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
              <h2 className="text-2xl font-bold">New & Updated</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.slice(0,4).map((game) => (
                <Link key={game.slug} href={`/wiki/${game.slug}`}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-border2 hover:bg-surface2 transition-all cursor-pointer group">
                    <img src={game.coverUrl} alt={game.title} className="w-16 h-20 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{game.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Updated 2 hours ago • New DLC guides</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Users className="text-primary" size={18} /> Top Communities
            </h3>
            
            <div className="space-y-4">
              {games.slice(0,5).map((game, i) => (
                <Link key={game.slug} href={`/wiki/${game.slug}`}>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface2 font-bold flex items-center justify-center text-xs border border-border group-hover:border-primary transition-colors">
                        #{i+1}
                      </div>
                      <span className="font-semibold text-sm text-muted-foreground group-hover:text-white transition-colors">
                        {game.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted font-mono">{Math.floor(Math.random() * 100) + 10}k</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-surface to-surface2 border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Join GameVerse</h3>
              <p className="text-sm text-muted-foreground mb-4">Contribute to the largest gaming knowledge base.</p>
              <Button className="w-full bg-white text-black hover:bg-gray-200">Sign Up</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
