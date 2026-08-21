import { Play } from "lucide-react";
import type { ShowcaseReel } from "@/lib/showcase/types";
import { coverArtFor } from "@/lib/showcase/cover";
import { cn } from "@/lib/utils";
import { ReelVideo } from "./ReelVideo";

/**
 * A reel frame, in three tiers of fidelity — each one a fallback for the last.
 *
 *   1. `videoUrl` → the reel actually plays (muted, looping, inline). Only when
 *      the caller opts in with `video`, and only on cards near the viewport;
 *      see ReelVideo.
 *   2. `thumbnailUrl` → the real still, which is what production serves today.
 *   3. neither → a generated cover; see lib/showcase/cover.
 *
 * Tiers 2 and 3 are still images, so they get the cues a still does not have on
 * its own and that make a frame read as footage: a slow Ken Burns push, a
 * screen-light bar drifting down it, a playhead crossing the bottom edge on the
 * reel's own runtime, and a level meter, because silent video reads as a GIF.
 * Every one runs on an offset derived from the reel itself, so a wall of them
 * shows every stage of playback at once rather than marching in lockstep —
 * which is the tell that gives a fake feed away.
 *
 * All three tiers stack: the video layer sits over the still and only fades in
 * once it is genuinely painting frames, so a slow, blocked or missing video
 * degrades to the tier below it with nothing to see.
 *
 * Server component. Only tier 1 pulls in client JS, and only where used.
 */
export function ReelCover({
  reel,
  className,
  /** Quieter treatment for the static grid, where the cards are read, not watched. */
  calm = false,
  /**
   * Play the reel's video, when the payload has one. Off by default: the grid
   * below the wall is for reading captions and numbers, so it isn't worth a
   * video decode there. See ReelWall for where it's turned on.
   */
  video = false,
  /**
   * The play glyph overlay. Off on the wall: those cards aren't clickable and
   * a static "play" icon sitting on top of footage that is already looping
   * reads as broken, not as an affordance. On by default for the grid, where
   * the card really is a link and the glyph is the "this is a reel" cue.
   */
  showPlayIcon = true,
}: {
  reel: ShowcaseReel;
  className?: string;
  calm?: boolean;
  video?: boolean;
  showPlayIcon?: boolean;
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

      {/* The reel itself, when there is one to play. It sits over the still
          cover and fades in only once it is painting frames, so the graded
          frame above stays visible while it loads — and stays visible forever
          if the video is missing, blocked or broken. */}
      {video && reel.videoUrl && <ReelVideo src={reel.videoUrl} poster={reel.thumbnailUrl} />}

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
          that owns this cover carries the link.

          Hidden on a card that is actually playing: a play button sitting on
          top of running footage reads as "paused", which is the opposite of
          what it is there to say. `group-has-` keys off the <video> the layer
          above renders, so no state has to be lifted to do it. */}
      {showPlayIcon && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500 group-has-[video]:opacity-0">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/25 backdrop-blur-[2px] transition duration-500 group-hover:scale-110 group-hover:bg-black/40">
            <Play size={14} className="translate-x-px text-white/90" fill="currentColor" />
          </span>
        </span>
      )}
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
