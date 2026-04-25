import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { useGetGamingNews } from "@workspace/api-client-react";
import { formatRelative } from "@/lib/format";

export default function News() {
  useEffect(() => {
    document.title = "Gaming News — GameVerse";
  }, []);

  const news = useGetGamingNews({ pageSize: 40 });

  return (
    <div className="pt-24 pb-24 max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
            <Newspaper size={12} strokeWidth={2.5} /> Live wire
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Gaming news
          </h1>
          <p className="text-sm text-muted mt-2 max-w-xl">
            Headlines pulled live from the world's gaming press — refreshed every few minutes.
          </p>
        </div>
        <button
          onClick={() => news.refetch()}
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          data-testid="button-refresh-news"
        >
          <RefreshCw size={12} className={news.isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {news.isError ? (
        <div className="bg-surface border border-border2 rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            We couldn't reach the news feeds right now.
          </p>
          <button
            onClick={() => news.refetch()}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : news.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface2 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {news.data?.items.map((n, i) => (
            <motion.a
              key={n.id}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className="group flex flex-col sm:flex-row gap-4 p-4 bg-surface border border-border2 rounded-2xl hover:border-[#333] hover:bg-surface2 transition-all"
              data-testid={`news-item-${i}`}
            >
              <div className="w-full sm:w-48 h-44 sm:h-32 rounded-xl overflow-hidden bg-surface2 flex-shrink-0">
                {n.image ? (
                  <img
                    src={n.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <Newspaper size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold mb-2">
                  <span className="text-primary">{n.source}</span>
                  <span className="text-muted2 normal-case font-medium tracking-normal">
                    · {formatRelative(n.publishedAt)}
                  </span>
                </div>
                <h2 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors mb-2">
                  {n.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  Read on {n.source} <ExternalLink size={12} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
