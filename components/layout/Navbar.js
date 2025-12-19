import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-purple-400 tracking-wide">
        Enma Nexus
      </Link>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search anime, manga, studios..."
          className="px-3 py-2 rounded bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        />
        <ThemeToggle />
      </div>
    </nav>
  );
}