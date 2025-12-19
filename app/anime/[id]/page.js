"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function fetchAniList(gql, variables = {}) {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql, variables }),
  });
  return await res.json();
}

export default function AnimeDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          description
          episodes
          coverImage { extraLarge large medium color }
          averageScore
          genres
          status
          season
          seasonYear
          trailer { id site }
          studios { nodes { name } }
        }
      }
    `;

    fetchAniList(query, { id })
      .then((data) => {
        setAnime(data?.data?.Media ?? null);
      })
      .catch((err) => console.error("AniList detail error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading anime details…</div>;
  }

  if (!anime) {
    return <div className="p-6 text-gray-400">No anime found.</div>;
  }

  const img =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.coverImage?.medium ||
    "";

  const cleanDescription = anime.description
    ? anime.description.replace(/<br\s*\/?>/gi, " ").replace(/<\/?[^>]+(>|$)/g, "")
    : "No synopsis available.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={img}
            alt={anime.title?.romaji || anime.title?.english || anime.title?.native}
            className="w-full md:w-1/3 rounded-lg shadow-lg object-cover"
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-purple-400">
              {anime.title?.romaji || anime.title?.english || anime.title?.native}
            </h1>
            <p className="text-sm text-gray-400">
              {anime.season} {anime.seasonYear} • {anime.status}
            </p>
            <p className="text-sm text-gray-400">
              Episodes: {anime.episodes ?? "?"} • Score:{" "}
              {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A"}
            </p>
            <p className="text-sm text-gray-400">
              Genres: {anime.genres?.join(", ") || "Unknown"}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{cleanDescription}</p>
            {anime.trailer?.site === "youtube" && anime.trailer.id && (
              <iframe
                className="w-full md:w-2/3 aspect-video rounded-lg mt-4"
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="Trailer"
                allowFullScreen
              />
            )}
            <p className="text-sm text-gray-400">
              Studios: {anime.studios?.nodes.map((s) => s.name).join(", ") || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}