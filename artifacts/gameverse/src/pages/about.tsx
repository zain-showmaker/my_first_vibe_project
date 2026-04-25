import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Database, Newspaper, Search, Bookmark, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Database,
    title: "Half a million games",
    description:
      "Every entry in the catalog is sourced from the open RAWG database — release dates, genres, platforms, screenshots, DLC, and more.",
  },
  {
    icon: Search,
    title: "Instant global search",
    description:
      "Hit ⌘K from anywhere on the site to search the entire library in real time. Type a name, jump straight to the entry.",
  },
  {
    icon: Newspaper,
    title: "Live news wire",
    description:
      "Headlines pulled from the world's gaming press — PC Gamer, Polygon, Eurogamer, Rock Paper Shotgun — refreshed continuously.",
  },
  {
    icon: Bookmark,
    title: "Personal watchlist",
    description:
      "Save anything that catches your eye. Your watchlist lives in your browser — no account, no signup, no tracking.",
  },
];

export default function About() {
  useEffect(() => {
    document.title = "About — GameVerse";
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
          <Gamepad2 size={12} strokeWidth={2.5} /> About
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          The dense gaming wiki for everyone.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          GameVerse is a fan-built, encyclopedic catalog of video games — every release date,
          score, screenshot, system requirement and DLC, all in one editorial-grade reading
          experience. Think Wikipedia for games, with the polish of a great print magazine.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mt-12">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border2 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-br from-surface to-surface2 border border-border2 rounded-2xl p-8">
        <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3">
          Credits
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Game data is provided by <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RAWG</a> under their public API
          program. News headlines are aggregated from the public RSS feeds of PC Gamer, Polygon,
          Eurogamer and Rock Paper Shotgun — all rights belong to the respective publishers.
          Click any headline to read the full article on the source site.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/browse">
          <button className="px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
            Open the library
            <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
}
