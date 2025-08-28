export default function Footer() {
  return (
    <footer className="relative z-[60] mt-16 border-t border-brand-muted bg-brand-grey-tiles">
      <div className="content flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-text/60 sm:flex-row">
        <p>© {new Date().getFullYear()} Klymb</p>
        <nav className="flex items-center gap-4">
          <a href="#" className="hover:text-brand-text/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded px-1">
            About
          </a>
          <a href="#" className="hover:text-brand-text/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded px-1">
            Contact
          </a>
          <a href="#" className="hover:text-brand-text/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded px-1">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}
