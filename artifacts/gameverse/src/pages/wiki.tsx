import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { 
  Trophy, Star, Calendar, Monitor, User, Shield, Target, Scroll,
  MessageSquare, Image as ImageIcon, MapPin, Search, Edit3, BookmarkPlus, Share, Play, ExternalLink, Hash, BookmarkCheck
} from "lucide-react";
import { games } from "@/data/games";
import { useWatchlist } from "@/hooks/use-watchlist";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Wiki() {
  const [match, params] = useRoute("/wiki/:slug");
  const [, setLocation] = useLocation();
  const game = games.find(g => g.slug === params?.slug);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [readingProgress, setReadingProgress] = useState(0);
  const { isWatched, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (match && !game) {
      setLocation("/404");
    }
  }, [match, game, setLocation]);

  useEffect(() => {
    // Read tab from URL query params
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setReadingProgress(Number(scroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  if (!game) return null;

  const watched = isWatched(game.slug);

  const tabs = [
    { id: "overview", label: "Overview", icon: Scroll },
    { id: "specs", label: "Specifications", icon: Target },
    { id: "dlc", label: "DLC", count: game.dlc.length, icon: Shield },
    { id: "characters", label: "Characters", count: game.characters.length, icon: User },
    { id: "locations", label: "Locations", count: game.locations.length, icon: MapPin },
    { id: "media", label: "Media", count: game.gallery.length, icon: ImageIcon },
    { id: "reviews", label: "Reviews", count: game.reviews.length, icon: MessageSquare }
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div 
        className="fixed top-16 left-0 right-0 h-[2px] bg-border z-40"
      >
        <div 
          className="h-full transition-all duration-150 ease-out" 
          style={{ width: `${readingProgress}%`, backgroundColor: game.themeColor }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="mt-16 relative h-[520px] overflow-hidden flex items-end">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <img src={game.heroUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        
        {/* Floating Particles (CSS only for perf) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-0 animate-pulse"
              style={{
                backgroundColor: game.themeColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-12 flex flex-col md:flex-row items-start md:items-end gap-10">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-40 h-56 flex-shrink-0 bg-surface rounded-[14px] border border-border2 shadow-2xl relative overflow-hidden hidden md:block"
          >
            <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
            <div 
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-black border-[3px] border-background shadow-lg"
              style={{ backgroundColor: game.themeColor, color: '#000', boxShadow: `0 4px 20px ${game.themeColor}60` }}
            >
              {game.scores.user}
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-[11px] font-bold px-3 py-1 rounded-md border" style={{ color: game.themeColor, backgroundColor: `${game.themeColor}15`, borderColor: `${game.themeColor}40` }}>
                {game.genre}
              </span>
              {game.platforms.slice(0,3).map(p => (
                <span key={p} className="text-[11px] font-bold px-3 py-1 rounded-md bg-surface2 text-muted-foreground border border-border">
                  {p}
                </span>
              ))}
              <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-surface2 text-muted-foreground border border-border">
                {game.year}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-black tracking-tighter leading-none mb-2 text-white">
              {game.title}
            </h1>
            <div className="text-[15px] text-muted-foreground mb-4 italic font-medium">
              {game.subtitle}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><strong className="text-white">Developer:</strong> {game.developer}</div>
              <div className="w-1 h-1 rounded-full bg-border2" />
              <div className="flex items-center gap-1.5"><strong className="text-white">Publisher:</strong> {game.publisher}</div>
              <div className="w-1 h-1 rounded-full bg-border2" />
              <div className="flex items-center gap-1.5"><strong className="text-white">Director:</strong> {game.director}</div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-surface border border-border2 rounded-xl px-4 py-2.5">
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Metacritic</div>
                  <div className="text-[22px] font-black tracking-tight text-[#47ff8a]">{game.scores.metacritic}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface border border-border2 rounded-xl px-4 py-2.5">
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">OpenCritic</div>
                  <div className="text-[22px] font-black tracking-tight text-[#47ff8a]">{game.scores.opencritic}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface border border-border2 rounded-xl px-4 py-2.5">
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">User Score</div>
                  <div className="text-[22px] font-black tracking-tight" style={{ color: game.themeColor }}>{game.scores.user}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface border border-border2 rounded-xl px-4 py-2.5">
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">GOTY Awards</div>
                  <div className="text-[22px] font-black tracking-tight text-[#ff9f47]">{game.scores.goty}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO ACTIONS */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-10 flex flex-wrap gap-3">
        <button 
          onClick={() => toast.success("Launching game tracker...")}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border border-transparent text-black transition-all"
          style={{ backgroundColor: game.themeColor }}
        >
          <Play size={14} fill="currentColor" /> Track Progress
        </button>
        <button 
          onClick={() => toggleWatchlist(game.slug, game.title)}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border border-border bg-surface2 text-white hover:bg-surface3 transition-all"
        >
          {watched ? <BookmarkCheck size={14} style={{color: game.themeColor}} /> : <BookmarkPlus size={14} />} 
          {watched ? "On Watchlist" : "Add to Backlist"}
        </button>
        <button 
          onClick={() => toast.success("Rating saved!")}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border border-border bg-surface2 text-white hover:bg-surface3 transition-all"
        >
          <Star size={14} /> Rate Game
        </button>
        <button 
          onClick={() => toast.success("Opening forum...")}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border border-border bg-surface2 text-white hover:bg-surface3 transition-all"
        >
          <MessageSquare size={14} /> Forum (2.4K)
        </button>
      </div>

      {/* STICKY TABS */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex overflow-x-auto scrollbar-hide gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.id ? 'text-white border-current' : 'text-muted-foreground border-transparent hover:text-white'}
              `}
              style={{ borderColor: activeTab === tab.id ? game.themeColor : 'transparent' }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface2 text-muted-foreground ml-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          
          <main className="min-w-0">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <section>
                  <h2 className="text-[13px] font-bold uppercase tracking-[2px] text-muted-foreground mb-5 flex items-center gap-3">
                    Synopsis <div className="flex-1 h-[1px] bg-border" />
                  </h2>
                  <div className="space-y-4 text-[15px] text-zinc-300 leading-[1.85]">
                    {game.synopsis.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  {game.reviews.length > 0 && (
                    <div className="border-l-[3px] py-4 px-5 my-8 rounded-r-xl text-[15px] text-muted-foreground leading-relaxed italic bg-surface/50" style={{ borderLeftColor: game.themeColor }}>
                      "{game.reviews[0].quote}" — <strong className="text-white not-italic">{game.reviews[0].source}</strong>
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {/* SPECS TAB */}
            {activeTab === "specs" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <section>
                  <h2 className="text-[13px] font-bold uppercase tracking-[2px] text-muted-foreground mb-5 flex items-center gap-3">
                    Technical Specifications <div className="flex-1 h-[1px] bg-border" />
                  </h2>
                  <table className="w-full text-[13px]">
                    <tbody>
                      {Object.entries(game.specTable).map(([key, val]) => (
                        <tr key={key} className="border-b border-border last:border-0">
                          <td className="py-4 w-40 font-semibold text-muted-foreground align-top">{key}</td>
                          <td className="py-4 text-white leading-relaxed">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </motion.div>
            )}

            {/* DLC TAB */}
            {activeTab === "dlc" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.dlc.length === 0 ? (
                    <p className="text-muted-foreground col-span-2">No expansions or DLCs available for this title.</p>
                  ) : (
                    game.dlc.map(item => (
                      <div key={item.id} className="bg-surface border border-border2 rounded-xl p-5 hover:border-[#333] hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${game.themeColor}80, ${game.themeColor})` }} />
                        <div className="flex justify-between items-start mb-3">
                          <Shield size={24} className="text-muted-foreground" />
                          <span className={`text-sm font-black ${item.price === 'Free' ? 'text-[#47ffb2]' : ''}`} style={{ color: item.price !== 'Free' ? game.themeColor : undefined }}>
                            {item.price}
                          </span>
                        </div>
                        <h3 className="font-bold text-[15px] mb-1">{item.name}</h3>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{item.type}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[11px] text-muted-foreground">{item.date}</span>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                            item.status === 'owned' ? 'bg-[#47ffb2]/10 text-[#47ffb2]' :
                            item.status === 'available' ? `bg-[${game.themeColor}]/10` : 'bg-purple-500/10 text-purple-400'
                          }`} style={{ color: item.status === 'available' ? game.themeColor : undefined }}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* CHARACTERS TAB */}
            {activeTab === "characters" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {game.characters.map(char => (
                    <div key={char.id} className="bg-surface border border-border2 rounded-xl overflow-hidden hover:border-[#333] hover:-translate-y-1 transition-all cursor-pointer">
                      <div className="h-24 bg-surface2 flex items-center justify-center">
                        <User size={32} className="text-muted" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[14px] mb-1">{char.name}</h3>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{char.role}</div>
                        <p className="text-[12px] text-muted-foreground leading-snug line-clamp-3 mb-3">{char.description}</p>
                        <span className="inline-block text-[10px] font-bold px-2 py-1 rounded-md bg-surface2 text-muted-foreground border border-border2">
                          {char.allegiance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LOCATIONS TAB */}
            {activeTab === "locations" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {game.locations.map(loc => (
                  <div key={loc.id} className="bg-surface border border-border2 rounded-xl p-4 flex items-center gap-4 hover:border-[#333] hover:pl-6 transition-all cursor-pointer">
                    <MapPin size={24} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[14px] mb-1">{loc.name}</h3>
                      <p className="text-[12px] text-muted-foreground truncate">{loc.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md capitalize" style={{
                      backgroundColor: loc.type === 'boss' ? '#ff474720' : loc.type === 'area' ? '#7c6aff20' : '#47ffb220',
                      color: loc.type === 'boss' ? '#ff4747' : loc.type === 'area' ? '#7c6aff' : '#47ffb2'
                    }}>
                      {loc.type}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* MEDIA TAB */}
            {activeTab === "media" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {game.gallery.map((img, i) => (
                    <div key={img.id} className={`bg-surface2 rounded-xl overflow-hidden aspect-video relative group cursor-pointer border border-border hover:border-border2 ${img.span2 ? 'col-span-2' : ''}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ExternalLink size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {game.reviews.map((rev, i) => (
                  <div key={i} className="bg-surface border border-border2 rounded-xl p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-white">{rev.source}</h3>
                      <div className="flex items-center gap-1 font-black text-lg" style={{ color: game.themeColor }}>
                        {rev.score} <span className="text-muted-foreground text-sm font-normal">/ 10</span>
                      </div>
                    </div>
                    <p className="text-[15px] text-muted-foreground italic leading-relaxed">"{rev.quote}"</p>
                  </div>
                ))}
              </motion.div>
            )}

          </main>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-surface border border-border2 rounded-[14px] p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-4">Rating Breakdown</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black tracking-tighter leading-none" style={{ color: game.themeColor }}>{game.scores.metacritic}</span>
                <span className="text-xl text-muted-foreground">/ 100</span>
              </div>
              
              <div className="space-y-3">
                {game.scoreCategories.map(cat => (
                  <div key={cat.label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="font-bold text-white">{cat.value}</span>
                    </div>
                    <Progress value={(cat.value / cat.max) * 100} className="h-1.5 bg-surface3" indicatorColor={game.themeColor} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border2 rounded-[14px] p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-4">Quick Actions</h3>
              <button 
                onClick={() => toast.info("Opening editor...")}
                className="w-full py-3 px-4 rounded-xl border border-border bg-surface2 text-[13px] font-bold text-white hover:bg-surface3 transition-colors flex items-center justify-center gap-2 mb-2"
              >
                <Edit3 size={16} /> Edit Wiki Page
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="w-full py-3 px-4 rounded-xl border border-transparent text-[13px] font-bold text-black transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: game.themeColor }}
              >
                <Share size={16} /> Share Page
              </button>
            </div>
            
            <div className="bg-surface border border-border2 rounded-[14px] p-5">
               <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted-foreground mb-4">Tags</h3>
               <div className="flex flex-wrap gap-2">
                 <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-surface2 border border-border text-muted-foreground hover:text-white cursor-pointer transition-colors">#{game.developer.toLowerCase().replace(' ','')}</span>
                 <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-surface2 border border-border text-muted-foreground hover:text-white cursor-pointer transition-colors">#{game.genre.toLowerCase().replace(' ','')}</span>
                 <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-surface2 border border-border text-muted-foreground hover:text-white cursor-pointer transition-colors">#openworld</span>
                 <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-surface2 border border-border text-muted-foreground hover:text-white cursor-pointer transition-colors">#lore</span>
               </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
