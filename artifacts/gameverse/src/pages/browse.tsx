import { useEffect, useMemo, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Library,
  Search as SearchIcon,
  X,
  ArrowDownAZ,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";
import { useListGames, useListGenres, useListPlatforms } from "@workspace/api-client-react";
import { GameCard, GameCardSkeleton } from "@/components/ui/GameCard";

const ORDERING_OPTIONS: { value: string; label: string; icon: any }[] = [
  { value: "-added", label: "Most popular", icon: TrendingUp },
  { value: "-released", label: "Newest first", icon: Calendar },
  { value: "released", label: "Oldest first", icon: Calendar },
  { value: "-rating", label: "User rating", icon: Star },
  { value: "-metacritic", label: "Metacritic", icon: Star },
  { value: "name", label: "A → Z", icon: ArrowDownAZ },
];

function useQueryState() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(search);
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, v);
    }
    next.delete("page");
    setLocation(`/browse${next.toString() ? "?" + next.toString() : ""}`);
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(search);
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    setLocation(`/browse${next.toString() ? "?" + next.toString() : ""}`);
  };

  return { params, setParams, setPage };
}

export default function Browse() {
  useEffect(() => {
    document.title = "Browse the library — GameVerse";
  }, []);

  const { params, setParams, setPage } = useQueryState();

  const search = params.get("search") ?? "";
  const genre = params.get("genres") ?? "";
  const platform = params.get("platforms") ?? "";
  const dates = params.get("dates") ?? "";
  const ordering = params.get("ordering") ?? "-added";
  const page = parseInt(params.get("page") ?? "1", 10);

  const [searchInput, setSearchInput] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.trim() !== search) {
        setParams({ search: searchInput.trim() || undefined });
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const genres = useListGenres();
  const platforms = useListPlatforms();
  const games = useListGames({
    search: search || undefined,
    genres: genre || undefined,
    platforms: platform || undefined,
    dates: dates || undefined,
    ordering,
    page,
    pageSize: 24,
  });

  const totalPages = games.data ? Math.min(Math.ceil(games.data.count / 24), 50) : 1;

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years: { value: string; label: string }[] = [];
    for (let y = current; y >= 1995; y -= 1) {
      years.push({ value: `${y}-01-01,${y}-12-31`, label: String(y) });
    }
    return years;
  }, []);

  const activeFilters = [genre, platform, dates].filter(Boolean).length;

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
            <Library size={12} strokeWidth={2.5} />
            The catalog
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Browse the library
          </h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            {games.data
              ? `${games.data.count.toLocaleString()} games matching your filters`
              : "Loading the catalog…"}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <SearchIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-surface2 border border-border rounded-xl h-10 pl-9 pr-9 text-sm placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              data-testid="input-search-games"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`md:hidden h-10 px-3 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
              activeFilters
                ? "border-primary text-primary bg-primary/10"
                : "border-border bg-surface2 text-muted-foreground"
            }`}
            data-testid="button-filters"
          >
            <Filter size={14} />
            {activeFilters > 0 && <span className="text-xs">{activeFilters}</span>}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <aside
          className={`${
            filtersOpen ? "block" : "hidden md:block"
          } space-y-6 bg-surface border border-border2 rounded-2xl p-5 h-fit md:sticky md:top-20`}
        >
          <FilterGroup label="Sort">
            <div className="space-y-1">
              {ORDERING_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = ordering === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setParams({ ordering: opt.value })}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-white hover:bg-surface2"
                    }`}
                    data-testid={`order-${opt.value}`}
                  >
                    <Icon size={12} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="Year">
            <select
              value={dates}
              onChange={(e) => setParams({ dates: e.target.value || undefined })}
              className="w-full bg-surface2 border border-border rounded-lg h-9 px-3 text-xs font-semibold text-white focus:outline-none focus:border-primary"
              data-testid="select-year"
            >
              <option value="">Any year</option>
              {yearOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="Platform">
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                active={!platform}
                onClick={() => setParams({ platforms: undefined })}
              >
                All
              </FilterChip>
              {platforms.data?.results.map((p) => (
                <FilterChip
                  key={p.id}
                  active={platform === String(p.id)}
                  onClick={() => setParams({ platforms: String(p.id) })}
                >
                  {p.name}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Genre">
            <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto pr-1">
              <FilterChip
                active={!genre}
                onClick={() => setParams({ genres: undefined })}
              >
                All
              </FilterChip>
              {genres.data?.results.map((g) => (
                <FilterChip
                  key={g.id}
                  active={genre === g.slug}
                  onClick={() => setParams({ genres: g.slug })}
                >
                  {g.name}
                </FilterChip>
              ))}
            </div>
          </FilterGroup>

          {activeFilters > 0 && (
            <button
              onClick={() =>
                setParams({ genres: undefined, platforms: undefined, dates: undefined })
              }
              className="w-full text-xs font-semibold text-muted hover:text-primary transition-colors flex items-center justify-center gap-1.5 pt-2 border-t border-border2"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </aside>

        <div className="min-h-[60vh]">
          {games.isError ? (
            <div className="bg-surface border border-border2 rounded-2xl p-10 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                We couldn't reach the catalog right now.
              </p>
              <button
                onClick={() => games.refetch()}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <motion.div
                key={`${ordering}-${genre}-${platform}-${dates}-${search}-${page}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {games.isLoading
                  ? Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)
                  : games.data?.results.map((g) => <GameCard key={g.id} game={g} />)}
              </motion.div>

              {!games.isLoading && games.data?.results.length === 0 && (
                <div className="bg-surface border border-border2 rounded-2xl p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No games match those filters. Try widening your search.
                  </p>
                </div>
              )}

              {games.data && games.data.count > 24 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="h-10 w-10 rounded-xl bg-surface2 border border-border text-muted-foreground hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="text-xs font-semibold text-muted-foreground px-4">
                    Page {page} of {totalPages.toLocaleString()}
                  </div>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!games.data.next || page >= totalPages}
                    className="h-10 w-10 rounded-xl bg-surface2 border border-border text-muted-foreground hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    data-testid="button-next-page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted2 font-bold mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
        active
          ? "bg-primary text-black border-primary"
          : "bg-surface2 border-border text-muted-foreground hover:text-white hover:border-[#333]"
      }`}
    >
      {children}
    </button>
  );
}
