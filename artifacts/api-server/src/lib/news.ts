import Parser from "rss-parser";
import { cached } from "./cache";
import { logger } from "./logger";

const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "GameVerse/1.0 (+replit)" },
});

const FEEDS: { source: string; url: string }[] = [
  { source: "PC Gamer", url: "https://www.pcgamer.com/rss/" },
  { source: "Polygon", url: "https://www.polygon.com/rss/index.xml" },
  { source: "Eurogamer", url: "https://www.eurogamer.net/?format=rss" },
  { source: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed" },
];

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  source: string;
  publishedAt: string;
  image: string | null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;
  const media = (item["media:content"] || item["media:thumbnail"]) as
    | { $?: { url?: string }; url?: string }
    | undefined;
  if (media) {
    const url = media.$?.url || media.url;
    if (url) return url;
  }
  const content = (item.content || item["content:encoded"] || item.summary || "") as string;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return null;
}

export async function fetchNews(limit = 30): Promise<NewsItem[]> {
  return cached(`news:all:${limit}`, 10 * 60 * 1000, async () => {
    const results = await Promise.allSettled(
      FEEDS.map(async ({ source, url }) => {
        const feed = await parser.parseURL(url);
        return (feed.items ?? []).slice(0, 12).map<NewsItem>((item) => {
          const link = item.link ?? "";
          const id = item.guid || link || `${source}:${item.title}`;
          const description = stripHtml(item.contentSnippet || item.content || item.summary || "");
          return {
            id,
            title: item.title?.trim() ?? "Untitled",
            link,
            description: description.slice(0, 280),
            source,
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            image: extractImage(item as Record<string, unknown>),
          };
        });
      }),
    );

    const items: NewsItem[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") items.push(...r.value);
      else logger.warn({ err: r.reason?.message }, "News feed failed");
    }

    items.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return items.slice(0, limit);
  });
}
