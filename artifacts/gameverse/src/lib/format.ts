import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

export function formatReleaseDate(iso: string | null | undefined, tba?: boolean): string {
  if (!iso) return tba ? "TBA" : "Unknown";
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function formatYear(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "yyyy");
  } catch {
    return "—";
  }
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return "";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "";
  }
}

export function metacriticTone(score: number | null | undefined): {
  bg: string;
  text: string;
  ring: string;
} {
  if (score == null) return { bg: "#222", text: "#888", ring: "#2a2a2a" };
  if (score >= 85) return { bg: "#e8ff47", text: "#0a0a0a", ring: "#e8ff47" };
  if (score >= 70) return { bg: "#7c6aff", text: "#ffffff", ring: "#7c6aff" };
  if (score >= 50) return { bg: "#ff9f47", text: "#0a0a0a", ring: "#ff9f47" };
  return { bg: "#ff4747", text: "#ffffff", ring: "#ff4747" };
}

export function stripHtml(html: string, max = 240): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export const PARENT_PLATFORMS = [
  { id: 1, name: "PC", slug: "pc" },
  { id: 2, name: "PlayStation", slug: "playstation" },
  { id: 3, name: "Xbox", slug: "xbox" },
  { id: 7, name: "Nintendo", slug: "nintendo" },
  { id: 4, name: "iOS", slug: "ios" },
  { id: 8, name: "Android", slug: "android" },
  { id: 5, name: "Mac", slug: "mac" },
  { id: 6, name: "Linux", slug: "linux" },
];
