"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1618336754214-0e8a5f6a6c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        alt="Anime Hero Background"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl px-6 glass-panel p-8"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Welcome to <span className="text-purple-400">Enma Nexus</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Your gateway to anime & manga brilliance. Discover, watch, and read with style.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/anime"
            className="px-6 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          >
            Browse Anime
          </Link>
          <Link
            href="/manga"
            className="px-6 py-3 rounded-lg bg-gray-800 text-gray-200 font-semibold hover:bg-gray-700 transition"
          >
            Read Manga
          </Link>
        </div>
      </motion.div>
    </section>
  );
}