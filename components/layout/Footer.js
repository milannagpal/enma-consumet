export default function Footer() {
  return (
    <footer className="mt-20 py-6 px-6 bg-[#1a1a1a]/60 border-t border-gray-800 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} Enma Nexus. Built with passion for anime & manga.</p>
      <p className="mt-2">Crafted by Enma • Powered by Jikan & MangaDex APIs</p>
    </footer>
  );
}