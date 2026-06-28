export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-6 mt-auto">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-8 text-xs text-muted-foreground">
        <p>
          Built with{" "}
          <span className="font-medium text-foreground/70">LangGraph · Gemini 1.5 Pro · Next.js</span>
          {" "}— AI Investment Research Agent
        </p>
        <p className="text-center sm:text-right max-w-sm opacity-70">
          <strong>Disclaimer:</strong> AI-generated analysis only. Not professional financial advice. Always consult a qualified advisor before investing.
        </p>
      </div>
    </footer>
  );
}
