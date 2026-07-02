import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto flex h-16 items-center px-4 md:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="AI Investment Research — Home"
        >
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg" aria-hidden="true">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="hidden sm:block font-bold tracking-tight text-base">
            AI Investment Research
          </span>
        </Link>

        {/* Right: version badge */}
        <div className="ml-auto">
          <span className="text-xs text-muted-foreground bg-secondary/60 border border-border/50 px-2.5 py-1 rounded-full font-medium">
            v1.0
          </span>
        </div>
      </div>
    </header>
  );
}
