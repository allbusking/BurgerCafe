import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl leading-none md:text-7xl">
          404 - PAGE NOT FOUND 💀
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-neon px-6 py-3 text-sm font-bold text-black transition-all hover:scale-[1.03] active:scale-[0.97]"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
