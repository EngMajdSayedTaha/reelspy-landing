"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A reel playing in place of its cover: muted, looping, inline, no controls.
 *
 * Three things have to be true at once or the browser silently refuses to start
 * and the card sits on its poster looking like a still image — which is the
 * exact failure this component exists to avoid:
 *
 *   1. `muted` — an unmuted autoplay is blocked outright without a user
 *      gesture. It is also what the design wants: a wall of reels that all
 *      started talking at once would be unusable. There is deliberately no way
 *      to unmute; this is ambient footage, not a player.
 *   2. `playsInline` — iOS Safari otherwise hijacks the video into fullscreen
 *      the moment it plays.
 *   3. an actual `play()` call — `autoplay` alone is unreliable once an element
 *      starts life off-screen, which every card on a horizontal rail does.
 *
 * The element sits ON TOP of the still cover and stays transparent until it is
 * genuinely painting frames (`onPlaying`). That way a slow or failed video
 * never shows as a black rectangle: the graded cover underneath simply stays
 * visible, and a broken URL degrades to exactly today's behaviour.
 */
export function ReelVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // `armed` latches: once a card has been near the viewport we keep its source
  // attached so scrolling back does not re-download it. `visible` is the live
  // state that starts and stops playback.
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  // React does set `muted` as a property, but it is re-asserted imperatively
  // because the autoplay policy reads the property at play() time and a single
  // missed frame of unmuted state is enough for the promise to reject.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
  }, []);

  // Only cards near the viewport load and play. A rail holds every card twice
  // and the wall holds two rails, so playing all of them would mean ~48
  // concurrent video decodes for a section most visitors scroll past.
  // IntersectionObserver measures the post-transform rect, so it tracks cards
  // as the rail carries them across the screen, not just as the page scrolls.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "200px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Playback is driven from state rather than from the observer callback, so
  // that play() is never called before React has attached the source.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !armed || failed) return;
    if (visible) {
      // Rejects routinely and harmlessly — a pause() landing mid-promise, or a
      // policy refusal. Either way the poster stays up; nothing to report.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [armed, visible, reduced, failed]);

  // Reduced motion means no autoplaying video at all. The still cover below is
  // already a complete, informative frame, so there is nothing to substitute.
  if (reduced || failed) return null;

  return (
    <video
      ref={ref}
      src={armed ? src : undefined}
      poster={poster ?? undefined}
      // `autoPlay` is belt-and-braces next to the explicit play() above: it
      // covers the case where a card is already on screen at first paint.
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      onError={() => setFailed(true)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
        playing ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
}
