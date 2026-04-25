import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Flame,
  Sparkles,
  Trophy,
  CalendarClock,
  Newspaper,
  Library,
  ArrowRight,
  ExternalLink,
  Tag,
  Cpu,
} from "lucide-react";
import {
  useGetTrendingGames,
  useGetNewReleases,
  useGetTopRatedGames,
  useGetUpcomingGames,
  useGetGamingNews,
  useListGenres,
  useListPlatforms,
} from "@workspace/api-client-react";
import { GameCard, GameCardSkeleton } from "@/components/ui/GameCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  formatReleaseDate,
  formatRelative,
  metacriticTone,
} from "@/lib/format";

function HeroBanner({
  game,
}: {
  game: {
    slug: string;
    name: string;
    backgroundImage: string | null;
    metacritic: number | null;
    released: string | null;
    genres: { name: string }[];
  } | undefined;
}) {
  if (!game) {
    return (
      <div className="relative h-[58vh] min-h-[440px] bg-surface2 animate-pulse rounded-[20px] mx-4 sm:mx-6 md:mx-10 mt-16" />
    );
  }
  const tone = metacriticTone(game.metacritic);
  return (
    <div className="relative h-[62vh] min-h-[460px] overflow-hidden">
      <div className="absolute inset-0">
        {game.backgroundImage && (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent" />
      </div>
      <div className="relative h-full flex items-end px-4 sm:px-6 md:px-10 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold mb-3 flex items-center gap-2">
            <Flame size={12} strokeWidth={2.5} />
            Trending right now
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-4">
            {game.name}
          </h1>
          <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground flex-wrap">
            {game.metacritic != null && (
              <span
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md font-bold text-xs"
                style={{ backgroundColor: tone.bg, color: tone.text }}
              >
                Metacritic {game.metacritic}
              </span>
            )}
            <span className="text-white/80">{formatReleaseDate(game.released)}</span>
            {game.genres.slice(0, 3).map((g) => (
              <span key={g.name} className="px-2 py-1 bg-surface2 rounded-md text-xs">
                {g.name}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href={`/games/${game.slug}`}>
              <button
                className="px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                data-testid="button-hero-detail"
              >
                Read the entry
                <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/browse">
              <button className="px-6 py-3 bg-surface2 text-white rounded-xl font-bold text-sm hover:bg-surface3 transition-colors border border-border">
                Browse all games
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CardRow({
  data,
  isLoading,
  count = 6,
}: {
  data?: { results: any[] };
  isLoading: boolean;
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {isLoading
        ? Array.from({ length: count }).map((_, i) => <GameCardSkeleton key={i} />)
        : data?.results.slice(0, count).map((g) => <GameCard key={g.id} game={g} />)}
    </div>
  );
}

function TopRatedList({ games, isLoading }: { games?: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface2 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!games?.length) return <p className="text-muted text-sm">No games yet.</p>;
  return (
    <div className="space-y-2">
      {games.slice(0, 10).map((g, i) => {
        const tone = metacriticTone(g.metacritic ?? null);
        return (
          <Link key={g.id} href={`/games/${g.slug}`}>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group flex items-center gap-3 p-2 pr-4 bg-surface border border-border2 rounded-xl hover:border-[#333] hover:bg-surface2 transition-all cursor-pointer"
              data-testid={`top-rated-${g.slug}`}
            >
              <div className="text-2xl font-black text-muted2 w-8 text-center">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface2 flex-shrink-0">
                {g.backgroundImage && (
                  <img
                    src={g.backgroundImage}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                  {g.name}
                </div>
                <div className="text-xs text-muted truncate">
                  {g.genres?.[0]?.name ?? "Game"} • {formatReleaseDate(g.released)}
                </div>
              </div>
              {g.metacritic != null && (
                <div
                  className="px-2.5 py-1 rounded-md font-black text-xs"
                  style={{ backgroundColor: `${tone.bg}25`, color: tone.bg }}
                >
                  {g.metacritic}
                </div>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

function NewsRail({ items, isLoading }: { items?: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface2 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!items?.length) return <p className="text-muted text-sm">News feed unavailable.</p>;
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.slice(0, 6).map((n, i) => (
        <motion.a
          key={n.id}
          href={n.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="group flex gap-3 p-3 bg-surface border border-border2 rounded-xl hover:border-[#333] hover:bg-surface2 transition-all"
          data-testid={`news-${i}`}
        >
          <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden bg-surface2 flex-shrink-0">
            {n.image ? (
              <img src={n.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <Newspaper size={20} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
              {n.source} <span className="text-muted2 normal-case font-medium">· {formatRelative(n.publishedAt)}</span>
            </div>
            <div className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {n.title}
            </div>
            <div className="text-xs text-muted line-clamp-2 mt-1">{n.description}</div>
          </div>
          <ExternalLink size={14} className="text-muted2 mt-1 flex-shrink-0" />
        </motion.a>
      ))}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "GameVerse — The dense game wiki for everyone";
  }, []);

  const trending = useGetTrendingGames({ pageSize: 12 });
  const newReleases = useGetNewReleases({ pageSize: 12 });
  const topRated = useGetTopRatedGames({ pageSize: 10 });
  const upcoming = useGetUpcomingGames({ pageSize: 6 });
  const news = useGetGamingNews({ pageSize: 6 });
  const genres = useListGenres();
  const platforms = useListPlatforms();

  const heroGame = trending.data?.results?.[0];

  return (
    <div className="pb-24">
      <HeroBanner game={heroGame as any} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16 -mt-8">
        <section>
          <SectionHeader
            eyebrow="Hot list"
            icon={Flame}
            title="Trending in the gaming world"
            subtitle="The titles everyone is adding to their library this week."
            href="/browse?ordering=-added"
          />
          <CardRow data={trending.data} isLoading={trending.isLoading} count={6} />
        </section>

        <section>
          <SectionHeader
            eyebrow="Just landed"
            icon={Sparkles}
            title="New releases"
            subtitle="Fresh out of the oven — released in the last 60 days."
            href="/browse?ordering=-released"
          />
          <CardRow data={newReleases.data} isLoading={newReleases.isLoading} count={6} />
        </section>

        <section className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <SectionHeader
              eyebrow="Critics' picks"
              icon={Trophy}
              title={`Top rated of ${new Date().getFullYear()}`}
              subtitle="Highest Metacritic scores this year."
              href={`/browse?ordering=-metacritic&dates=${new Date().getFullYear()}-01-01,${new Date().getFullYear()}-12-31`}
            />
            <TopRatedList games={topRated.data?.results} isLoading={topRated.isLoading} />
          </div>

          <div>
            <SectionHeader
              eyebrow="Latest news"
              icon={Newspaper}
              title="Gaming headlines"
              subtitle="Pulled live from the world's gaming press."
              href="/news"
            />
            <NewsRail items={news.data?.items} isLoading={news.isLoading} />
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Looking ahead"
            icon={CalendarClock}
            title="Upcoming releases"
            subtitle="The next year of games — wishlist worthy."
            href="/browse?ordering=released"
          />
          <CardRow data={upcoming.data} isLoading={upcoming.isLoading} count={6} />
        </section>

        <section className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeader eyebrow="Categories" icon={Tag} title="Browse by genre" />
            <div className="flex flex-wrap gap-2">
              {genres.isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 bg-surface2 animate-pulse rounded-lg" />
                  ))
                : genres.data?.results.slice(0, 16).map((g) => (
                    <Link key={g.id} href={`/browse?genres=${g.slug}`}>
                      <div
                        className="px-3 py-2 rounded-lg bg-surface border border-border2 text-sm font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        data-testid={`genre-${g.slug}`}
                      >
                        {g.name}{" "}
                        <span className="text-muted2 text-xs ml-1">
                          {g.gamesCount?.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Hardware" icon={Cpu} title="Browse by platform" />
            <div className="flex flex-wrap gap-2">
              {platforms.isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-surface2 animate-pulse rounded-lg" />
                  ))
                : platforms.data?.results.map((p) => (
                    <Link key={p.id} href={`/browse?platforms=${p.id}`}>
                      <div
                        className="px-3 py-2 rounded-lg bg-surface border border-border2 text-sm font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        data-testid={`platform-${p.slug}`}
                      >
                        {p.name}
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-surface to-surface2 border border-border2 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
              <Library size={12} strokeWidth={2.5} /> The library
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
              Half a million games. One catalog.
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Every entry on GameVerse is sourced from the open RAWG database — release dates,
              cover art, screenshots, system requirements, DLC and more. Use the global search
              ({"\u2318"}K) to jump to anything instantly.
            </p>
          </div>
          <Link href="/browse">
            <button className="px-6 py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
              Open the library
              <ArrowRight size={14} />
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
