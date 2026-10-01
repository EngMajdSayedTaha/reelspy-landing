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
      niche: "real estate",
      reels: [
        { igUsername: "keys.with.kareem", permalink: null, caption: "I toured a $2M penthouse so you don't have to. The kitchen alone…", thumbnailUrl: null, videoUrl: null, viewCount: 2_380_000, likeCount: 171_000, commentCount: 4_960, postedAt: "2026-07-09T17:30:00.000Z", outperformRatio: 6.2, followers: 236_000 },
        { igUsername: "first.home.files", permalink: null, caption: "Three questions to ask before you sign any rental contract.", thumbnailUrl: null, videoUrl: null, viewCount: 1_790_000, likeCount: 133_000, commentCount: 5_410, postedAt: "2026-07-11T10:00:00.000Z", outperformRatio: 4.8, followers: 312_000 },
        { igUsername: "offplan.honest", permalink: null, caption: "Off-plan vs ready: I ran both through five years of numbers.", thumbnailUrl: null, videoUrl: null, viewCount: 1_280_000, likeCount: 91_700, commentCount: 3_380, postedAt: "2026-07-13T13:15:00.000Z", outperformRatio: 3.7, followers: 148_000 },
        { igUsername: "staging.room", permalink: null, caption: "Same apartment, $400 of staging, listed for 11% more.", thumbnailUrl: null, videoUrl: null, viewCount: 942_000, likeCount: 74_200, commentCount: 1_560, postedAt: "2026-07-14T08:40:00.000Z", outperformRatio: 3.0, followers: 87_000 },
        { igUsername: "keys.with.kareem", permalink: null, caption: "What a 1-bedroom actually costs to run, month by month.", thumbnailUrl: null, videoUrl: null, viewCount: 728_000, likeCount: 50_900, commentCount: 2_740, postedAt: "2026-07-15T19:20:00.000Z", outperformRatio: 2.6, followers: 236_000 },
        { igUsername: "yield.notes", permalink: null, caption: "The rental yield math most listings quietly leave out.", thumbnailUrl: null, videoUrl: null, viewCount: 604_000, likeCount: 42_100, commentCount: 1_930, postedAt: "2026-07-16T11:05:00.000Z", outperformRatio: 2.2, followers: 119_000 },
        { igUsername: "first.home.files", permalink: null, caption: "Viewing checklist: the five things I test in every unit.", thumbnailUrl: null, videoUrl: null, viewCount: 497_000, likeCount: 37_800, commentCount: 1_140, postedAt: "2026-07-17T15:50:00.000Z", outperformRatio: 1.9, followers: 312_000 },
        { igUsername: "broker.unfiltered", permalink: null, caption: "Why the cheapest listing on the street is rarely a deal.", thumbnailUrl: null, videoUrl: null, viewCount: 421_000, likeCount: 30_400, commentCount: 896, postedAt: "2026-07-18T09:30:00.000Z", outperformRatio: 1.6, followers: 64_000 },
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
