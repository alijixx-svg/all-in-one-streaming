import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useRoute } from "wouter";
import { POSTER_IMAGES, STREAMING_PLATFORMS, type PosterArt, type StreamingPlatform } from "@/data/streaming-platforms";

function PosterShapes({ art }: { art: PosterArt }) {
  if (art === "games") {
    return (
      <g fill="none" stroke="white" strokeOpacity=".68" strokeWidth="3">
        <circle cx="180" cy="170" r="42" />
        <path d="m180 238 47 81h-94z" />
        <rect x="131" y="350" width="98" height="98" rx="8" />
      </g>
    );
  }
  if (art === "forest") {
    return (
      <g fill="white" fillOpacity=".2">
        <path d="m65 365 70-145 70 145zM156 390l76-178 76 178zM10 400l54-112 54 112z" />
        <path d="M0 405h360v125H0z" fillOpacity=".26" />
      </g>
    );
  }
  if (art === "fire") {
    return (
      <g fill="white" fillOpacity=".22">
        <path d="M180 112c-8 58 44 70 28 124 28-17 38-48 29-82 48 53 69 105 48 161-20 55-67 83-121 76-55-7-94-49-91-104 3-45 32-83 68-122-6 41-1 64 14 81 14-38-7-77 25-134z" />
      </g>
    );
  }
  if (art === "palace") {
    return (
      <g fill="none" stroke="white" strokeOpacity=".35" strokeWidth="5">
        <path d="M58 394V212q0-84 122-122 122 38 122 122v182" />
        <path d="M96 394V242q0-54 84-84 84 30 84 84v152M44 394h272" />
        <path d="M180 164v230M124 236v158M236 236v158" />
      </g>
    );
  }
  if (art === "arabic") {
    return (
      <g fill="white" fillOpacity=".24">
        <path d="M0 364q70-56 144-8t216-13v187H0z" />
        <path d="M0 420q74-42 145-8t215-26v144H0z" fillOpacity=".2" />
        <path d="M143 374V246q0-37 37-37t37 37v128z" fillOpacity=".32" />
        <path d="M151 374V248q0-29 29-29t29 29v126z" fillOpacity=".22" />
      </g>
    );
  }
  if (art === "city") {
    return (
      <g fill="white" fillOpacity=".2">
        <path d="M0 294h54v-93h31v58h38V166h39v128h30v-72h39v82h39V188h42v106h48v236H0z" />
        <path d="M0 362h360v168H0z" fillOpacity=".16" />
      </g>
    );
  }
  if (art === "gothic") {
    return (
      <g fill="none" stroke="white" strokeOpacity=".42" strokeWidth="5">
        <path d="M83 433V218q0-97 97-151 97 54 97 151v215" />
        <path d="M126 433V238q0-58 54-95 54 37 54 95v195M180 144v289" />
        <circle cx="180" cy="118" r="36" fill="white" fillOpacity=".18" stroke="none" />
      </g>
    );
  }
  if (art === "neon") {
    return (
      <g fill="none" stroke="white" strokeOpacity=".42" strokeWidth="4">
        <circle cx="176" cy="236" r="112" />
        <circle cx="176" cy="236" r="78" />
        <path d="M0 350q94-66 180 0t180 0M36 160q60 36 120 0t120 0" />
        <path d="M180 92v288M36 236h288" strokeOpacity=".22" />
      </g>
    );
  }
  return (
    <g fill="white" fillOpacity=".24">
      <circle cx="244" cy="142" r="55" />
      <path d="M0 330q70-77 134 0t128-6q49-49 98-5v211H0z" />
      <path d="M252 89a53 53 0 0 0-15 103 58 58 0 1 1 15-103z" fillOpacity=".55" />
    </g>
  );
}

function PosterCard({ title, art, background }: { title: string; art: PosterArt; background: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const poster = POSTER_IMAGES[title];
  const showPoster = Boolean(poster && !imageFailed);
  const gradientId = `poster-shade-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <article className="min-w-0" data-testid={`card-title-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/20"
        role="img"
        aria-label={`Illustrative poster artwork for ${title}`}
        style={{ background }}
      >
        {showPoster && poster ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={poster.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 540" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity=".04" />
                <stop offset="100%" stopColor="black" stopOpacity=".48" />
              </linearGradient>
            </defs>
            <PosterShapes art={art} />
            <path d="M0 0h360v540H0z" fill={`url(#${gradientId})`} />
          </svg>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.18em] text-white/80 backdrop-blur">
          {showPoster ? "Poster image" : "Illustrative art"}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-num text-[9px] uppercase tracking-[.22em] text-white/65">Featured pick</p>
          <h3 className="font-display mt-1 text-lg font-semibold leading-tight text-white sm:text-xl">{title}</h3>
        </div>
      </div>
    </article>
  );
}

export default function PlatformPage() {
  const [matched, params] = useRoute("/platform/:slug");
  const platform = matched
    ? STREAMING_PLATFORMS.find((service) => service.slug === params?.slug)
    : undefined;

  useEffect(() => {
    document.title = platform ? `${platform.name} picks | ALL IN ONE` : "Streaming picks | ALL IN ONE";
  }, [platform]);

  if (!platform) {
    return (
      <section className="surface mx-auto max-w-2xl p-8 text-center sm:p-12">
        <h1 className="font-display text-3xl font-semibold">Platform not found</h1>
        <Link href="/" className="btn btn-primary mt-6">Back to all services</Link>
      </section>
    );
  }

  return <PlatformHighlights platform={platform} />;
}

function PlatformHighlights({ platform }: { platform: StreamingPlatform }) {
  return (
    <div className="space-y-8" data-testid={`page-platform-${platform.slug}`}>
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground" data-testid="link-back-to-services">
        <ArrowLeft className="h-4 w-4" /> All services
      </Link>

      <section className="stream-hero relative overflow-hidden rounded-[2rem] border border-border p-6 sm:p-9 lg:p-11">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className={platform.tone}><span className="service-mark">{platform.mark}</span></span>
            <p className="font-num text-[10px] uppercase tracking-[.2em] text-primary">Streaming picks</p>
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{platform.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{platform.detail}. Browse the poster-style artwork and discover a few popular titles.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/45 px-3 py-2">
              <EyeOff className="h-4 w-4 text-primary" /> Images only · no playback
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/45 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Illustrative catalog
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-picks-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-num text-[10px] uppercase tracking-[.2em] text-primary">Poster gallery</p>
            <h2 id="featured-picks-title" className="font-display mt-2 text-2xl font-semibold sm:text-3xl">Popular picks to explore</h2>
          </div>
          <Link href="/subscriptions" className="inline-flex items-center gap-2 text-sm text-primary hover:underline" data-testid="link-view-streaming-bundle">
            View bundle <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {platform.titles.map((title) => (
            <div key={title.title} className="space-y-2">
              <PosterCard title={title.title} art={title.art} background={title.background} />
              <div className="flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
                <span>{title.genre}</span>
                {POSTER_IMAGES[title.title] && (
                  <a
                    href={POSTER_IMAGES[title.title].sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-primary hover:underline"
                    data-testid={`link-poster-source-${title.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-primary/20 bg-primary/[.05] p-4 text-xs leading-5 text-muted-foreground sm:p-5" data-testid="notice-illustrative-catalog">
        Title examples are not a live provider catalog, and availability can vary by country. Poster images are credited to <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer" className="text-primary underline">TVmaze</a>; image rights remain with their owners. ALL IN ONE does not play videos or provide third-party streaming access.
      </aside>
    </div>
  );
}
