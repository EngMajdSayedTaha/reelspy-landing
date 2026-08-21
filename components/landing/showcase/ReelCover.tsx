import { Play } from "lucide-react";
import type { ShowcaseReel } from "@/lib/showcase/types";
import { coverArtFor } from "@/lib/showcase/cover";
import { cn } from "@/lib/utils";

/**
 * A reel frame that reads as *playing*.
 *
 * There is no video in the payload — see lib/showcase/cover — so "playing" is
 * assembled out of four cues that a still frame doesn't have, all of them CSS,
 * all of them composited transforms:
 *
 *   1. a slow Ken Burns push, so the frame is never actually still;
 *   2. a screen-light bar drifting down it, the cue that tells you a phone in
 *      someone's hand is on rather than off;
 *   3. a playhead crossing the bottom edge on the reel's own runtime;
 *   4. a level meter, because silent video reads as a GIF.
 *
 * Every one of those runs on an offset derived from the reel itself, so a wall
 * of these shows every stage of playback at once instead of forty cards
 * marching in lockstep — which is the tell that gives away a fake feed.
 *
 * Server component: no hooks, no "use client", zero JS shipped for any of it.
 */
export function ReelCover({
  reel,
  className,
  /** Quieter treatment for the static grid, where the cards are read, not watched. */
  calm = false,
}: {
  reel: ShowcaseReel;
  className?: string;
  calm?: boolean;
}) {
  const art = coverArtFor(reel);

  return (
    <div
      aria-hidden
      className={cn("relative h-full w-full overflow-hidden bg-[#0d0d11]", className)}
    >
      {/* The frame. Ken Burns lives on this layer alone so the overlays above
          it stay pin-sharp — a drifting caption is motion sickness, a drifting
          image is cinematography. */}
      <div
        className={cn("absolute inset-0", !calm && "lp-kenburns")}
        style={{ ["--kb-dur" as string]: `${art.driftSeconds}s` }}
      >
        {reel.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URLs, not a configured next/image loader.
          <img
            src={reel.thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: art.frame }} />
            <div className="absolute inset-0" style={{ background: art.subject }} />
            <div className="lp-grid-bg absolute inset-0 opacity-[0.16]" />
          </>
        )}
      </div>

      {/* Screen light. Skipped on the calm variant and, below sm, wherever the
          card is too small for the sweep to read as anything but a flicker. */}
      {!calm && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-1/2 sm:block"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.10) 45%, transparent)",
            animation: `lp-screenlight ${art.playSeconds}s ease-in-out ${art.playOffset}s infinite`,
          }}
        />
      )}

      {/* Vignette. Two jobs: it puts the eye on the middle of the frame, and it
          guarantees the metrics overlay below has something dark to sit on
          whatever the grade underneath happens to be. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 40%, rgba(0,0,0,0.42) 100%), linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 34%, transparent 62%)",
        }}
      />

      {/* Grain, at the frame level rather than the page level: it is the thing
          that stops a wide two-stop gradient from banding across a 9:16 card. */}
      <div className="lp-noise pointer-events-none absolute inset-0 [--lp-grain:0.055]" />

      {/* Playhead rail, pinned to the bottom edge like a story bar. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
        <div
          className={cn("h-full bg-white/85", !calm && "lp-playhead")}
          style={{
            ["--play-dur" as string]: `${art.playSeconds}s`,
            animationDelay: calm ? undefined : `${art.playOffset}s`,
          }}
        />
      </div>

      {/* Play glyph — the universal "this is video" mark, held small so it
          reads as a state, not a button. Nothing here is clickable; the card
          that owns this cover carries the link. */}
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 backdrop-blur-[2px] transition duration-500 group-hover:scale-110 group-hover:bg-black/40">
          <Play size={14} className="translate-x-px text-white/90" fill="currentColor" />
        </span>
      </span>
    </div>
  );
}

/** The runtime + level-meter strip. Split out so the wall can place it in the
 *  frame while the grid card places it in its own header row. */
export function ReelPlayback({ reel, live = true }: { reel: ShowcaseReel; live?: boolean }) {
  const art = coverArtFor(reel);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 text-[0.62rem] font-medium text-white/85 backdrop-blur-sm">
      {live && (
        <span aria-hidden className="flex h-2.5 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] origin-bottom rounded-full bg-lp-yellow"
              style={{
                height: "100%",
                animation: `lp-level ${0.9 + i * 0.24}s ease-in-out ${i * -0.3}s infinite`,
              }}
            />
          ))}
        </span>
      )}
      <span className="tabular" dir="ltr">
        {art.runtime}
      </span>
    </span>
  );
}
