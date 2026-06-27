export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8 mx-auto">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built as a technical assignment. Powered by AI and LangGraph.
        </p>
        <p className="text-center text-xs text-muted-foreground md:text-right max-w-sm">
          <strong>Disclaimer:</strong> This generated investment analysis is AI-assisted research and should not be interpreted as professional financial advice.
        </p>
      </div>
    </footer>
  );
}
