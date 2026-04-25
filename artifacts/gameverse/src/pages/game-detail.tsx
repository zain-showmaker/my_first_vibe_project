import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Globe,
  Gamepad2,
  Star,
  Trophy,
  Clock,
  ExternalLink,
  Cpu,
  Tag,
  Building2,
  Megaphone,
  Layers,
  Image as ImageIcon,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import {
  useGetGameDetail,
  useGetGameScreenshots,
  useGetGameDlcs,
  useGetGameSeries,
  getGetGameDetailQueryKey,
  getGetGameScreenshotsQueryKey,
  getGetGameDlcsQueryKey,
  getGetGameSeriesQueryKey,
} from "@workspace/api-client-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { GameCard } from "@/components/ui/GameCard";
import {
  formatReleaseDate,
  metacriticTone,
  stripHtml,
} from "@/lib/format";

const TABS = [
  { id: "about", label: "About" },
  { id: "screenshots", label: "Screenshots" },
  { id: "specs", label: "System specs" },
  { id: "dlc", label: "DLC & expansions" },
  { id: "series", label: "Series" },
];

export default function GameDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [tab, setTab] = useState("about");

  const detail = useGetGameDetail(slug, {
    query: { enabled: !!slug, queryKey: getGetGameDetailQueryKey(slug) },
  });
  const screenshots = useGetGameScreenshots(slug, {
    query: { enabled: !!slug, queryKey: getGetGameScreenshotsQueryKey(slug) },
  });
  const dlcs = useGetGameDlcs(slug, {
    query: { enabled: !!slug, queryKey: getGetGameDlcsQueryKey(slug) },
  });
  const series = useGetGameSeries(slug, {
    query: { enabled: !!slug, queryKey: getGetGameSeriesQueryKey(slug) },
  });

  const { isWatched, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    if (detail.data) {
      document.title = `${detail.data.name} — GameVerse`;
      window.scrollTo({ top: 0 });
    }
  }, [detail.data]);

  if (detail.isLoading) {
    return (
      <div className="pt-16">
        <div className="h-[60vh] min-h-[420px] bg-surface2 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 mt-10 space-y-3">
          <div className="h-6 w-1/3 bg-surface2 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-surface2 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-extrabold mb-2">Game not found</h1>
        <p className="text-sm text-muted mb-6">
          We couldn't find an entry for "{slug}". It may have been removed from RAWG, or
          the slug might be wrong.
        </p>
        <Link href="/browse">
          <button className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold text-sm">
            Back to the library
          </button>
        </Link>
      </div>
    );
  }

  const game = detail.data;
  const tone = metacriticTone(game.metacritic);
  const watched = isWatched(game.slug);

  const dlcCount = dlcs.data?.count ?? 0;
  const seriesCount = series.data?.count ?? 0;

  const facts: { label: string; value: string; icon?: any }[] = [
    {
      label: "Released",
      value: formatReleaseDate(game.released, game.tba),
      icon: Calendar,
    },
    {
      label: "Developers",
      value: game.developers?.map((d) => d.name).join(", ") || "—",
      icon: Building2,
    },
    {
      label: "Publishers",
      value: game.publishers?.map((p) => p.name).join(", ") || "—",
      icon: Megaphone,
    },
    {
      label: "ESRB",
      value: game.esrbRating?.name || "Not rated",
      icon: ShieldCheck,
    },
    {
      label: "Avg. playtime",
      value: game.playtime ? `${game.playtime} hours` : "—",
      icon: Clock,
    },
  ];

  return (
    <div className="pb-24">
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
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/40 to-transparent" />
        </div>

        <div className="relative h-full flex items-end pb-12 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Link href="/browse">
              <button className="text-xs font-semibold text-muted-foreground hover:text-white inline-flex items-center gap-1 mb-4">
                <ArrowLeft size={12} /> Back to library
              </button>
            </Link>

            <div className="flex flex-wrap gap-2 mb-3">
              {game.genres?.map((g) => (
                <Link key={g.id} href={`/browse?genres=${g.slug}`}>
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[11px] font-bold uppercase tracking-wider border border-white/10 text-white hover:text-primary cursor-pointer">
                    {g.name}
                  </span>
                </Link>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-3 max-w-4xl">
              {game.name}
            </h1>
            {game.nameOriginal && game.nameOriginal !== game.name && (
              <p className="text-sm text-muted-foreground italic mb-3">
                Originally titled "{game.nameOriginal}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {game.metacritic != null && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs"
                  style={{ backgroundColor: tone.bg, color: tone.text }}
                >
                  <Trophy size={12} />
                  Metacritic {game.metacritic}
                </div>
              )}
              <div className="inline-flex items-center gap-2 text-sm text-white">
                <Star size={14} className="text-orange-400 fill-orange-400" />
                <span className="font-bold">{game.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-xs">
                  / {game.ratingTop} from {game.ratingsCount.toLocaleString()} players
                </span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={13} />
                {formatReleaseDate(game.released, game.tba)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  toggleWatchlist({
                    slug: game.slug,
                    name: game.name,
                    backgroundImage: game.backgroundImage ?? null,
                    released: game.released ?? null,
                    metacritic: game.metacritic ?? null,
                    rating: game.rating,
                  })
                }
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
                  watched
                    ? "bg-primary text-black hover:bg-primary/90"
                    : "bg-surface2 text-white border border-border hover:bg-surface3"
                }`}
                data-testid="button-watchlist"
              >
                {watched ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {watched ? "On your watchlist" : "Add to watchlist"}
              </button>
              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-surface2 text-white border border-border hover:bg-surface3 font-bold text-sm flex items-center gap-2"
                >
                  <Globe size={14} /> Official site <ExternalLink size={12} />
                </a>
              )}
              {game.metacriticUrl && (
                <a
                  href={game.metacriticUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-surface2 text-white border border-border hover:bg-surface3 font-bold text-sm flex items-center gap-2"
                >
                  <Trophy size={14} /> Metacritic
                </a>
              )}
              {game.redditUrl && (
                <a
                  href={game.redditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-surface2 text-white border border-border hover:bg-surface3 font-bold text-sm"
                >
                  r/Subreddit
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const count =
              t.id === "screenshots"
                ? screenshots.data?.count ?? game.screenshotsCount
                : t.id === "dlc"
                  ? dlcCount || game.additionsCount
                  : t.id === "series"
                    ? seriesCount || game.gameSeriesCount
                    : t.id === "specs"
                      ? game.systemRequirements?.length || 0
                      : null;
            const disabled =
              (t.id === "screenshots" && (screenshots.data?.count ?? 0) === 0 && game.screenshotsCount === 0) ||
              (t.id === "dlc" && (dlcCount || game.additionsCount) === 0) ||
              (t.id === "series" && (seriesCount || game.gameSeriesCount) === 0) ||
              (t.id === "specs" && (game.systemRequirements?.length ?? 0) === 0);
            if (disabled && t.id !== "about") return null;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
                data-testid={`tab-${t.id}`}
              >
                {t.label}
                {count != null && count > 0 && (
                  <span className="ml-1.5 text-xs text-muted2 font-medium">{count}</span>
                )}
                {tab === t.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          <div>
            {tab === "about" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3">
                    About
                  </h2>
                  {game.description ? (
                    <div
                      className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-white prose-a:text-primary prose-strong:text-white"
                      dangerouslySetInnerHTML={{ __html: game.description }}
                    />
                  ) : (
                    <p className="text-sm text-muted">No description available.</p>
                  )}
                </div>

                {game.tags && game.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3 flex items-center gap-2">
                      <Tag size={12} /> Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {game.tags.slice(0, 30).map((t) => (
                        <span
                          key={t.id}
                          className="px-2.5 py-1 bg-surface border border-border2 rounded-md text-xs font-medium text-muted-foreground"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.stores && game.stores.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3">
                      Where to buy
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {game.stores.map((s) => (
                        <a
                          key={s.id}
                          href={s.url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-surface border border-border2 rounded-xl hover:border-primary text-sm font-semibold transition-colors"
                        >
                          <span>{s.store.name}</span>
                          <ExternalLink size={12} className="text-muted" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}

            {tab === "screenshots" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-4 flex items-center gap-2">
                  <ImageIcon size={12} /> Screenshots
                </h2>
                {screenshots.isLoading ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-video bg-surface2 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {screenshots.data?.results.map((s) => (
                      <a
                        key={s.id}
                        href={s.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-video rounded-xl overflow-hidden bg-surface2 border border-border2 hover:border-primary transition-colors"
                      >
                        <img
                          src={s.image}
                          alt=""
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {tab === "specs" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-4 flex items-center gap-2">
                  <Cpu size={12} /> System requirements
                </h2>
                <div className="space-y-4">
                  {game.systemRequirements.map((req) => (
                    <div
                      key={req.platform}
                      className="bg-surface border border-border2 rounded-2xl p-5"
                    >
                      <h3 className="font-bold text-base mb-3">{req.platform}</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {req.minimum && (
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-muted2 font-bold mb-2">
                              Minimum
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground leading-relaxed">
                              {stripHtml(req.minimum, 1500)}
                            </pre>
                          </div>
                        )}
                        {req.recommended && (
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                              Recommended
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground leading-relaxed">
                              {stripHtml(req.recommended, 1500)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {tab === "dlc" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-4 flex items-center gap-2">
                  <Layers size={12} /> DLC & expansions
                </h2>
                {dlcs.isLoading ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-28 bg-surface2 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dlcs.data?.results.map((d) => {
                      const t = metacriticTone(d.metacritic);
                      return (
                        <Link key={d.id} href={`/games/${d.slug}`}>
                          <div className="flex gap-3 p-3 bg-surface border border-border2 rounded-xl hover:border-primary transition-colors cursor-pointer">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface2 flex-shrink-0">
                              {d.backgroundImage && (
                                <img
                                  src={d.backgroundImage}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm leading-snug line-clamp-2 mb-1">
                                {d.name}
                              </div>
                              <div className="text-xs text-muted">
                                {formatReleaseDate(d.released)}
                              </div>
                              {d.metacritic != null && (
                                <div
                                  className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded"
                                  style={{ backgroundColor: `${t.bg}25`, color: t.bg }}
                                >
                                  Meta {d.metacritic}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            )}

            {tab === "series" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-4 flex items-center gap-2">
                  <Gamepad2 size={12} /> More from this series
                </h2>
                {series.isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] bg-surface2 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {series.data?.results.map((s) => (
                      <GameCard key={s.id} game={s} variant="compact" />
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="bg-surface border border-border2 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.18em] text-primary font-bold">
                The facts
              </h3>
              <dl className="space-y-3 text-sm">
                {facts.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex gap-3">
                      {Icon && <Icon size={14} className="text-muted2 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <dt className="text-[10px] uppercase tracking-[0.15em] text-muted2 font-bold">
                          {f.label}
                        </dt>
                        <dd className="text-white font-medium">{f.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            {game.parentPlatforms && game.parentPlatforms.length > 0 && (
              <div className="bg-surface border border-border2 rounded-2xl p-5">
                <h3 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3 flex items-center gap-2">
                  <Gamepad2 size={12} /> Available on
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {game.parentPlatforms.map((p) => (
                    <Link key={p.platform.id} href={`/browse?platforms=${p.platform.id}`}>
                      <span className="px-2.5 py-1 bg-surface2 border border-border rounded-md text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer">
                        {p.platform.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface border border-border2 rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-[0.18em] text-primary font-bold mb-3">
                At a glance
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Screens" value={game.screenshotsCount} />
                <Stat label="Movies" value={game.moviesCount} />
                <Stat label="Achievements" value={game.achievementsCount} />
                <Stat label="DLC" value={game.additionsCount} />
                <Stat label="Series" value={game.gameSeriesCount} />
                <Stat label="Ratings" value={game.ratingsCount} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface2 rounded-lg py-3">
      <div className="text-base font-black text-white">{value.toLocaleString()}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted2 font-semibold">
        {label}
      </div>
    </div>
  );
}
