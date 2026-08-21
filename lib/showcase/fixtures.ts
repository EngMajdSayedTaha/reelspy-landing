import type { ShowcaseData } from "./types";

// Curated sample data for the live-trending section.
//
// The section renders these whenever the real endpoint is unreachable or has
// too little data to fill a grid — which is the normal state of a fresh
// deployment, since the snapshot cache only fills once the enrichment crons
// have run against a live Meta token. A marketing page that renders an empty
// grid looks broken; one that renders plausible sample data, clearly labelled
// as such, does not.
//
// Handles are deliberately invented rather than real accounts: attributing
// fabricated engagement numbers to a real creator would be putting words in
// their mouth. thumbnailUrl and videoUrl are null throughout — the cards draw a
// generated cover, and shipping hotlinked media here would be worse.
export const SHOWCASE_FIXTURES: ShowcaseData = {
  isDemo: true,
  niches: [
    {
      niche: "fitness",
      reels: [
        { igUsername: "kettlebell.kate", permalink: null, caption: "The 12-minute session that replaced my hour at the gym.", thumbnailUrl: null, videoUrl: null, viewCount: 2_410_000, likeCount: 184_000, commentCount: 3_120, postedAt: "2026-07-09T08:00:00.000Z", outperformRatio: 6.4, followers: 214_000 },
        { igUsername: "form.first", permalink: null, caption: "Three deadlift cues that fixed my lower back in a week.", thumbnailUrl: null, videoUrl: null, viewCount: 1_870_000, likeCount: 142_000, commentCount: 2_640, postedAt: "2026-07-11T15:30:00.000Z", outperformRatio: 4.9, followers: 388_000 },
        { igUsername: "run.slowly", permalink: null, caption: "Why your easy runs should feel embarrassingly easy.", thumbnailUrl: null, videoUrl: null, viewCount: 1_320_000, likeCount: 98_400, commentCount: 4_210, postedAt: "2026-07-13T06:15:00.000Z", outperformRatio: 3.8, followers: 156_000 },
        { igUsername: "desk.mobility", permalink: null, caption: "Two minutes of this beats an hour of stretching later.", thumbnailUrl: null, videoUrl: null, viewCount: 964_000, likeCount: 77_100, commentCount: 1_480, postedAt: "2026-07-14T12:00:00.000Z", outperformRatio: 3.1, followers: 92_000 },
        { igUsername: "protein.plainly", permalink: null, caption: "I tracked every gram for 30 days. Here's what mattered.", thumbnailUrl: null, videoUrl: null, viewCount: 741_000, likeCount: 52_300, commentCount: 2_910, postedAt: "2026-07-15T18:45:00.000Z", outperformRatio: 2.7, followers: 331_000 },
        { igUsername: "kettlebell.kate", permalink: null, caption: "Stop counting reps. Count quality reps.", thumbnailUrl: null, videoUrl: null, viewCount: 612_000, likeCount: 44_800, commentCount: 986, postedAt: "2026-07-16T09:20:00.000Z", outperformRatio: 2.2, followers: 214_000 },
        { igUsername: "the.rest.day", permalink: null, caption: "Rest days aren't lazy. Here's the science, in 40 seconds.", thumbnailUrl: null, videoUrl: null, viewCount: 508_000, likeCount: 39_600, commentCount: 1_205, postedAt: "2026-07-17T07:10:00.000Z", outperformRatio: 1.9, followers: 61_000 },
        { igUsername: "form.first", permalink: null, caption: "The warm-up I do before every single session.", thumbnailUrl: null, videoUrl: null, viewCount: 433_000, likeCount: 31_200, commentCount: 742, postedAt: "2026-07-18T16:00:00.000Z", outperformRatio: 1.6, followers: 388_000 },
      ],
    },
    {
      niche: "food",
      reels: [
        { igUsername: "onepan.omar", permalink: null, caption: "One pan, six ingredients, twenty minutes. No compromises.", thumbnailUrl: null, videoUrl: null, viewCount: 3_120_000, likeCount: 241_000, commentCount: 5_830, postedAt: "2026-07-10T17:00:00.000Z", outperformRatio: 7.1, followers: 402_000 },
        { igUsername: "doughlab", permalink: null, caption: "The fold that turns supermarket flour into bakery bread.", thumbnailUrl: null, videoUrl: null, viewCount: 2_040_000, likeCount: 167_000, commentCount: 3_940, postedAt: "2026-07-12T11:25:00.000Z", outperformRatio: 5.3, followers: 289_000 },
        { igUsername: "fifteen.minute", permalink: null, caption: "Weeknight dinner that tastes like weekend cooking.", thumbnailUrl: null, videoUrl: null, viewCount: 1_460_000, likeCount: 112_000, commentCount: 2_180, postedAt: "2026-07-13T19:40:00.000Z", outperformRatio: 4.2, followers: 178_000 },
        { igUsername: "spice.notes", permalink: null, caption: "Toast your spices. That's the whole video.", thumbnailUrl: null, videoUrl: null, viewCount: 1_105_000, likeCount: 89_700, commentCount: 1_670, postedAt: "2026-07-15T13:05:00.000Z", outperformRatio: 3.4, followers: 134_000 },
        { igUsername: "onepan.omar", permalink: null, caption: "Five sauces that make any vegetable disappear.", thumbnailUrl: null, videoUrl: null, viewCount: 852_000, likeCount: 66_100, commentCount: 1_920, postedAt: "2026-07-16T18:30:00.000Z", outperformRatio: 2.8, followers: 402_000 },
        { igUsername: "cold.brew.club", permalink: null, caption: "Why your iced coffee tastes bitter and how to fix it.", thumbnailUrl: null, videoUrl: null, viewCount: 690_000, likeCount: 51_400, commentCount: 2_430, postedAt: "2026-07-17T08:50:00.000Z", outperformRatio: 2.4, followers: 97_000 },
        { igUsername: "doughlab", permalink: null, caption: "I baked the same loaf at four hydrations. Look at this.", thumbnailUrl: null, videoUrl: null, viewCount: 521_000, likeCount: 43_900, commentCount: 1_310, postedAt: "2026-07-18T10:15:00.000Z", outperformRatio: 1.8, followers: 289_000 },
        { igUsername: "pantry.first", permalink: null, caption: "Dinner from an empty fridge, ranked by effort.", thumbnailUrl: null, videoUrl: null, viewCount: 398_000, likeCount: 29_800, commentCount: 864, postedAt: "2026-07-18T20:00:00.000Z", outperformRatio: 1.5, followers: 73_000 },
      ],
    },
    {
      niche: "travel",
      reels: [
        { igUsername: "slow.routes", permalink: null, caption: "The overnight train everyone skips — and why they shouldn't.", thumbnailUrl: null, videoUrl: null, viewCount: 2_760_000, likeCount: 208_000, commentCount: 6_420, postedAt: "2026-07-09T20:10:00.000Z", outperformRatio: 6.8, followers: 356_000 },
        { igUsername: "carryon.only", permalink: null, caption: "Two weeks, one bag. Here's exactly what's inside.", thumbnailUrl: null, videoUrl: null, viewCount: 1_930_000, likeCount: 151_000, commentCount: 3_270, postedAt: "2026-07-11T09:35:00.000Z", outperformRatio: 5.1, followers: 245_000 },
        { igUsername: "offpeak.maps", permalink: null, caption: "Same city, half the crowds. Go in the second week.", thumbnailUrl: null, videoUrl: null, viewCount: 1_240_000, likeCount: 94_600, commentCount: 2_050, postedAt: "2026-07-13T14:20:00.000Z", outperformRatio: 3.9, followers: 121_000 },
        { igUsername: "one.tank", permalink: null, caption: "Three hours from the airport and nobody knows about it.", thumbnailUrl: null, videoUrl: null, viewCount: 1_010_000, likeCount: 81_300, commentCount: 1_740, postedAt: "2026-07-14T16:45:00.000Z", outperformRatio: 3.2, followers: 168_000 },
        { igUsername: "slow.routes", permalink: null, caption: "Booking flights on the wrong day costs you this much.", thumbnailUrl: null, videoUrl: null, viewCount: 774_000, likeCount: 58_900, commentCount: 2_680, postedAt: "2026-07-16T07:55:00.000Z", outperformRatio: 2.5, followers: 356_000 },
        { igUsername: "border.notes", permalink: null, caption: "The visa detail that ruins more trips than weather.", thumbnailUrl: null, videoUrl: null, viewCount: 593_000, likeCount: 41_700, commentCount: 3_110, postedAt: "2026-07-17T12:30:00.000Z", outperformRatio: 2.1, followers: 88_000 },
        { igUsername: "carryon.only", permalink: null, caption: "Hotel or apartment? I ran the numbers for 30 nights.", thumbnailUrl: null, videoUrl: null, viewCount: 462_000, likeCount: 34_200, commentCount: 1_090, postedAt: "2026-07-18T09:05:00.000Z", outperformRatio: 1.7, followers: 245_000 },
        { igUsername: "quiet.coasts", permalink: null, caption: "Six coastlines that still feel like nobody found them.", thumbnailUrl: null, videoUrl: null, viewCount: 351_000, likeCount: 27_600, commentCount: 719, postedAt: "2026-07-18T19:25:00.000Z", outperformRatio: 1.4, followers: 54_000 },
      ],
    },
  ],
};
