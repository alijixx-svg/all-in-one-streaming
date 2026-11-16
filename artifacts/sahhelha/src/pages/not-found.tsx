import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center text-center rise">
      <p className="font-num text-sm text-primary">404</p>
      <h1 className="font-display mt-2 text-4xl font-bold">This page took a detour.</h1>
      <p className="mt-2 text-muted-foreground">Let's get you back somewhere useful.</p>
      <Link href="/" className="btn btn-primary mt-6">Back to Discover</Link>
    </div>
  );
}
