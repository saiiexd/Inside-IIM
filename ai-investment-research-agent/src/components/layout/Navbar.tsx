import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Activity className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block tracking-tight text-lg">
              AI Investment Research
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
              Enterprise Agent v1.0
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
