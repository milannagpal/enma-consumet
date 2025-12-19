"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";

function titleText(t) {
  if (!t) return "Untitled";
  return t.romaji || t.english || t.native || "Untitled";
}

function stripHtml(input) {
  if (!input) return "";
  return input.replace(/<br\s*\/?>/gi, " ").replace(/<\/?[^>]+(>|$)/g, "");
}

async function fetchAniList(gql, variables = {}) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql, variables }),
  });
  return await res.json();
}

function RatingBadge({ score }) {
  if (typeof score !== "number") return null;
  const bg = score >= 80 ? "bg-green-600" : "bg-gray-700";
  return (
    <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${bg}`}>
      ⭐ {(score / 10).toFixed(1)}
    </span>
  );
}

function Card({ anime }) {
  const img =
    anime?.coverImage?.large ||
    anime?.coverImage?.extraLarge ||
    anime?.coverImage?.medium ||
    "";
  const name = titleText(anime?.title);
  const eps = anime?.episodes ?? "?";
  const desc = stripHtml(anime?.description || "").slice(0, 140);
  const descText = desc ? `${desc}...` : "No synopsis";

  return (
    <Link
      href={`/anime/${anime?.id}`}
      className="group border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/50 transition block relative bg-black/40"
    >
      <img
        src={img}
        alt={name}
        className="w-full aspect-[2/3] object-cover group-hover:scale-[1.03] transition-transform"
      />
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{name}</h3>
        <p className="text-xs text-gray-400">Episodes: {eps}</p>
        <RatingBadge score={anime?.averageScore ?? null} />
      </div>
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-4 text-xs text-gray-300">
        {descText}
      </div>
      <button className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-purple-700 text-white rounded hover:bg-purple-800">
        + Watchlist
      </button>
    </Link>
  );
}

function Section({ title, data }) {
  return (
    <section className="border border-white/10 rounded-xl p-6 bg-black/30">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto">
        {data?.map((anime) => (
          <div key={anime?.id} className="min-w-[150px] md:min-w-[200px] lg:min-w-[220px]">
            <Card anime={anime} />
          </div>
        ))}
        {(!data || data.length === 0) && <div className="text-sm text-gray-400">No items</div>}
      </div>
    </section>
  );
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);

      const trendingQuery = `
        query {
          Page(page: 1, perPage: 12) {
            media(type: ANIME, sort: TRENDING_DESC) {
              id
              title { romaji english native }
              description
              episodes
              coverImage { extraLarge large medium color }
              averageScore
            }
          }
        }
      `;
      const popularQuery = `
        query {
          Page(page: 1, perPage: 12) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji english native }
              description
              episodes
              coverImage { extraLarge large medium color }
              averageScore
            }
          }
        }
      `;
      const upcomingQuery = `
        query {
          Page(page: 1, perPage: 12) {
            media(type: ANIME, sort: START_DATE_DESC, status: NOT_YET_RELEASED) {
              id
              title { romaji english native }
              description
              episodes
              coverImage { extraLarge large medium color }
              averageScore
            }
          }
        }
      `;

      try {
        const [trData, popData, upData] = await Promise.all([
          fetchAniList(trendingQuery),
          fetchAniList(popularQuery),
          fetchAniList(upcomingQuery),
        ]);

        if (!mounted) return;

        setTrending(trData?.data?.Page?.media ?? []);
        setPopular(popData?.data?.Page?.media ?? []);
        setUpcoming(upData?.data?.Page?.media ?? []);
      } catch (e) {
        console.error("AniList sections fetch error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);

      const searchQuery = `
        query ($search: String) {
          Page(page: 1, perPage: 20) {
            media(search: $search, type: ANIME) {
              id
              title { romaji english native }
              description
              episodes
              coverImage { extraLarge large medium color }
              averageScore
            }
          }
        }
      `;

      try {
        const data = await fetchAniList(searchQuery, { search: query });
        if (!mounted) return;
        setResults(data?.data?.Page?.media ?? []);
      } catch (e) {
        console.error("AniList search error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      <header className="border-b border-white/10 bg-black/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold">Enma Nexus — Anime</h1>
          <span className="text-xs text-gray-400">{loading ? "Loading…" : "Ready"}</span>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 flex flex-col gap-12">
        <Section title="🔥 Trending now" data={trending} />
        <Section title="⭐ Popular" data={popular} />
        <Section title="⏳ Upcoming" data={upcoming} />

        <section className="border border-white/10 rounded-xl p-6 bg-black/30">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search anime…"
              className="bg-gray-900 text-gray-300 px-3 py-2 rounded w-64 outline-none focus:ring-2 focus:ring-purple-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="text-xs text-gray-400">Powered by AniList GraphQL</p>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((anime) => (
              <Card key={anime?.id} anime={anime} />
            ))}
          </div>
          {results.length === 0 && query && (
            <div className="text-sm text-gray-400 mt-2">No results for “{query}”.</div>
          )}
        </section>
      </div>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="container mx-auto px-6 py-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Enma Nexus. Built on AniList GraphQL.
        </div>
      </footer>
    </main>
  );
}