import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <h2 className="text-4xl font-bold text-white">404</h2>
      <p className="text-zinc-400">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
