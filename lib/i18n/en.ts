// English dictionary — the source of truth. `lib/i18n/ar.ts` is typed against
// this shape so a missing Arabic key is a compile error. All on-page copy lives
// here so it renders server-side (crawlable) in the active locale.

export const en = {
  meta: {
    dir: "ltr",
  },
  nav: {
    features: "Features",
    how: "How it works",
    live: "Live trends",
    pricing: "Pricing",
    faq: "FAQ",
    login: "Log in",
    startFree: "Start free",
    langToggle: "العربية",
    langToggleLabel: "Switch to Arabic",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    themeToggle: "Toggle theme",
  },
  hero: {
    eyebrow: "For creators, agencies & growth teams",
    h1a: "Your unfair advantage for",
    h1grad: "short-form video.",
    sub: "ReelSpy watches the creators you admire, spots which reels are over-performing right now, writes original scripts in your voice — and posts them straight to Instagram. TikTok, YouTube & Facebook are coming soon.",
    ctaPrimary: "Start free — no card needed",
    ctaSecondary: "See how it works",
    trust1: "Free plan forever",
    trust2: "English & العربية",
    trust3: "Your data stays yours",
    cardViralScore: "Virality",
    cardAbove: "above average",
    cardRising: "Rising now",
    cardGoingViral: "Going viral",
    scrollCue: "Scroll to explore",
  },
  proof: {
    connects: "Instagram today — TikTok, YouTube and Facebook coming soon",
    poweredBy: "Powered by Claude AI",
    soon: "Soon",
  },
  problem: {
    h2a: "Growing on Reels shouldn't be a",
    h2b: "guessing game.",
    pains: [
      { t: "Trends spotted too late", d: "You learn what worked after it's already old news." },
      { t: "Hours stalking competitors", d: "Scrolling account after account to see what's landing." },
      { t: "The blank-page script", d: "Every video starts from nothing. Again." },
      { t: "Uploading the same video 4×", d: "One export, four apps, four sets of captions." },
      { t: "“link please”, answered by hand", d: "Warm leads in your comments go cold while you sleep." },
    ],
    pivot: "ReelSpy turns all of that into a loop.",
    loop: {
      watch: { k: "Watch", d: "Import the creators you learn from." },
      spot: { k: "Spot", d: "See which reels over-perform right now." },
      create: { k: "Create", d: "AI writes a script in your voice." },
      publish: { k: "Publish", d: "Post everywhere in one action." },
    },
  },
  features: {
    eyebrow: "The loop, up close",
    f1: {
      eyebrow: "Spot",
      title: "Spot the true outliers, not the usual big accounts.",
      body: "Every reel is scored — and ranked against that account's own average. A small creator's breakout beats a big account's ordinary post, so you study what actually broke out.",
      demo: {
        sortOut: "Out-performance",
        sortViral: "Viral score",
        rising: "Rising Now",
        aria: "A live feed of reels re-ranking itself: switching the sort from out-performance to viral score reorders the cards.",
        above: "above avg",
      },
    },
    f2: {
      eyebrow: "Study",
      title: "Steal the structure, never the content.",
      body: "Transcribe any reel. See the exact opening line that stopped the scroll. Collect every winning hook in one searchable library.",
      demo: {
        transcribing: "Transcribing…",
        hookLibrary: "Hook Library",
        aria: "A reel card transcribes itself, then its opening line files into a Hook Library list with a score.",
        savedHook: "Saved to Hook Library",
      },
    },
    f3: {
      eyebrow: "Create",
      title: "Original scripts, written in your voice.",
      body: "Point at any reel for inspiration. Claude writes a fresh hook, body and call-to-action in your brand voice — its own topic, its own angle, never a copy.",
      demo: {
        voice: "Voice",
        chips: ["English", "العربية", "Gulf", "MSA"],
        hook: "Hook",
        bodyLabel: "Body",
        cta: "CTA",
        writtenBy: "Written by Claude",
        regenerate: "Regenerate",
        aria: "A script generator types out a hook, body and call-to-action, switching to right-to-left when Arabic is picked.",
        // Two dialect slots per language. Index 0 = Gulf chip, 1 = MSA chip, so
        // the voice toggle actually swaps the copy. Arabic keeps ONE story
        // (the 4pm-slump script) written two genuinely different ways — natural
        // Gulf vs polished MSA — which is the whole point of the feature. The
        // English pair are two distinct sample scripts so the toggle still
        // responds in English. This block is the source of truth; ar.ts mirrors
        // it verbatim (the demo shows both voices regardless of page language).
        scripts: {
          en: [
            {
              hook: "Everyone films their morning routine. Almost nobody films the 4pm slump — that's where your audience actually lives.",
              body: "Show the real dip: the third coffee, the half-finished task, the reset that works. Give one tiny system they can copy before the day gets away from them.",
              cta: "Save this for your 4pm. Follow for the systems the polished accounts skip.",
            },
            {
              hook: "Stop leading with your best tip. Lead with the mistake you made right before it — that's the part people actually stay for.",
              body: "Walk through the wrong version fast: what you tried, why it flopped, the one change that fixed it. Keep it to a single before-and-after they can feel in six seconds.",
              cta: "Try it on your next post. Follow for the angles most creators quietly edit out.",
            },
          ],
          ar: [
            {
              hook: "الكل يصوّر روتين الصبح، بس محّد يصوّر خمول العصر — وهني بالضبط وين جمهورك الحقيقي.",
              body: "ورّهم الهبطة على طبيعتها: ثالث فنجان قهوة، المهمة اللي وقفت بنصّها، والحركة الصغيرة اللي ترجّعك للتركيز. اعطهم فكرة وحدة بسيطة يقدرون يطبّقونها على طول.",
              cta: "احفظ الفيديو لوقت خمولك الجاي، وتابعنا توصلك الأفكار اللي الحسابات المرتّبة تتجاهلها.",
            },
            {
              hook: "الجميع يصوّر روتين الصباح، لكن لا أحد يصوّر لحظة الفتور بعد الظهر — وهناك تحديدًا يعيش جمهورك الحقيقي.",
              body: "أظهِر الهبوط كما هو: فنجان القهوة الثالث، المهمة التي توقفت في منتصفها، والخطوة البسيطة التي تعيدك إلى التركيز. قدّم فكرة واحدة صغيرة يمكن تطبيقها على الفور.",
              cta: "احفظ الفيديو لوقت فتورك القادم، وتابعنا لتصلك الأفكار التي تتجاهلها الحسابات المثالية.",
            },
          ],
        },
      },
    },
    f4: {
      eyebrow: "Publish",
      title: "Post everywhere. Reply to everyone.",
      body: "Upload once and publish to Instagram with its own captions and scheduling — TikTok, YouTube and Facebook are coming soon. And every keyword comment gets an instant reply plus a DM — 24/7.",
      demo: {
        upload: "Your video",
        schedule: "Scheduled · 6:00 PM",
        comment: "link please 🙏",
        reply: "Sent you the link — check your DMs! 💬",
        dm: "Here's the link you asked for 👉 reelspy.dev",
        aria: "One video fans out to Instagram, Facebook, TikTok and YouTube; below, a keyword comment triggers an instant public reply and a private DM.",
        autoReply: "Auto-reply",
      },
    },
  },
  showcase: {
    eyebrow: "Live from the product",
    h2a: "This is the actual feed.",
    h2b: "Not a screenshot.",
    body: "Real reels, ranked the way ReelSpy ranks them: against each account's own median, so a small creator's genuine outlier beats a big account's ordinary day. Pick a niche, re-sort it, open anything that catches your eye.",
    sorts: {
      score: "Out-performing",
      views: "Views",
      likes: "Likes",
      recent: "Newest",
    },
    sortLabel: "Sort by",
    nicheLabel: "Niche",
    niches: {
      fitness: "Fitness",
      food: "Food",
      travel: "Travel",
    },
    views: "views",
    likes: "likes",
    comments: "comments",
    // Plural forms rather than a function: this namespace is handed to a
    // client component, and functions can't cross the server/client boundary.
    // formatDaysAgo (lib/showcase/format) picks the right form. English only
    // needs one/other; the keys exist so Arabic can use its dual and its
    // 3–10 vs 11+ split.
    day: {
      today: "today",
      one: "1 day ago",
      two: "2 days ago",
      few: "{n} days ago",
      many: "{n} days ago",
    },
    viewOn: "View on Instagram",
    cta: "Track this niche",
    demoNote: "Sample data — connect an account to see live reels from your own niche.",
    empty: "No reels to show right now.",
  },
  radar: {
    eyebrow: "Niche Radar — the moat",
    h2a: "Your niche has a pulse.",
    h2b: "Now you can see it.",
    body: "ReelSpy anonymously aggregates what all its users track and shows what's over-performing across your entire niche right now — intelligence no single account-watcher can give you.",
    anonymity: "Fully anonymized. Nobody sees what you track, and you see the trend, never the source.",
    labels: ["fitness", "food", "finance", "beauty", "tech"],
    ping: "over avg",
  },
  bento: {
    eyebrow: "Everything else you get",
    h2: "A full content studio, not just a spy glass.",
    tiles: [
      { t: "My IG analytics", d: "Your own account's numbers with AI growth tips based on your real data." },
      { t: "Content calendar", d: "Drag-and-drop scheduling across every platform in one view." },
      { t: "Account groups", d: "Bulk-import and organize the creators you track into tidy groups." },
      { t: "Niche quiz & starter packs", d: "Answer a few questions, get a curated set of accounts to watch." },
      { t: "Light, dark & color themes", d: "Make the dashboard yours with a full theming system." },
      { t: "English & العربية", d: "Full RTL, Gulf and MSA voices — bilingual end to end." },
      { t: "Export anytime", d: "Your data is yours. Full export and account deletion, always." },
      { t: "Studios: 5 IG accounts", d: "Switch between up to five Instagram accounts for teams." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    h2a: "Start free.",
    h2b: "Upgrade when you're growing.",
    perMonth: "/mo",
    mostPopular: "Most popular",
    forStudios: "For teams & studios",
    currency: "AED",
    plans: [
      {
        name: "Free",
        price: "0",
        tagline: "Everything you need to start spotting.",
        cta: "Start free",
        features: ["3 tracked accounts", "10 AI scripts / month", "5 transcripts / month", "Standard AI model"],
      },
      {
        name: "Creator",
        price: "49",
        tagline: "For creators publishing every week.",
        cta: "Get Creator",
        features: ["30 tracked accounts", "60 AI scripts / month", "30 transcripts / month", "15 auto-replies", "Instagram publishing", "Claude Sonnet"],
      },
      {
        name: "Pro",
        price: "149",
        tagline: "For serious growth and bigger catalogs.",
        cta: "Get Pro",
        features: ["50 tracked accounts", "200 AI scripts / month", "100 transcripts / month", "30 auto-replies", "Instagram publishing", "Claude Opus"],
      },
      {
        name: "Studio",
        price: "349",
        tagline: "For agencies and social teams.",
        cta: "Get Studio",
        features: ["100 tracked accounts", "Unlimited AI scripts", "Unlimited transcripts", "60 auto-replies", "Publishing + 5 IG accounts", "Claude Opus"],
      },
    ],
    byoTitle: "Don't fit a box?",
    byoBody: "Build your own plan with sliders — accounts, scripts, auto-replies and publish targets, priced live.",
    byoCta: "Build your plan",
    byoSliders: [
      { label: "Tracked accounts", unit: "" },
      { label: "AI scripts / mo", unit: "" },
      { label: "Auto-replies", unit: "" },
      { label: "Publish targets", unit: "" },
    ],
    byoLivePrice: "Your price",
    footnote: "Prices in AED. Billing handled securely by Stripe. Cancel anytime.",
  },
  compare: {
    eyebrow: "Before / after",
    h2: "The same week, with ReelSpy switched on.",
    before: "Without ReelSpy",
    after: "With ReelSpy",
    rows: [
      { before: "Hunt for trends by hand", after: "Trends ranked for you, by out-performance" },
      { before: "Guess what made the hook work", after: "See it transcribed, word for word" },
      { before: "Stare at a blank page", after: "A script in your voice, in seconds" },
      { before: "Upload the same video 4 times", after: "Upload once, publish to four platforms" },
      { before: "Miss leads in your comments", after: "Auto-reply + DM, around the clock" },
      { before: "Wonder what to change", after: "Data-driven growth tips on your own account" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Questions, answered honestly.",
    items: [
      {
        q: "Is it really free?",
        a: "Yes. The Free plan is free forever — 3 tracked accounts, 10 AI scripts and 5 transcripts every month, no card required. Upgrade only when you outgrow it.",
      },
      {
        q: "Do you copy other people's content?",
        a: "No. ReelSpy helps you study structure — the hook, the pacing, the payoff. Every script Claude writes is original: its own topic and angle, in your brand voice. Never a copy.",
      },
      {
        q: "Which platforms does it work with?",
        a: "Today ReelSpy tracks, learns from and publishes to Instagram, with auto-reply on Instagram. Facebook, TikTok and YouTube publishing — each with its own captions and schedule — is in active development and coming soon.",
      },
      {
        q: "Does it work in Arabic?",
        a: "Fully. The whole product is bilingual with complete right-to-left support, and Claude writes scripts in Gulf or Modern Standard Arabic as well as English.",
      },
      {
        q: "Is my data private?",
        a: "Yes. Every account is isolated with row-level security. Niche trends are anonymized — nobody sees what you track. Social tokens are stored server-side and never exposed to the browser. Export or delete your data anytime.",
      },
      {
        q: "Which AI writes the scripts?",
        a: "Paid plans run on Claude — Sonnet on Creator, Opus on Pro and Studio. The Free plan uses a standard model so you can try the loop end to end.",
      },
      {
        q: "Can agencies use it?",
        a: "Yes — that's the Studio plan: 100 tracked accounts, unlimited scripts and transcripts, and switching between up to 5 Instagram accounts for your clients.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. ReelSpy runs entirely in your browser. Sign up, connect your accounts, and you're spotting in minutes.",
      },
    ],
  },
  finalCta: {
    h2a: "Stop guessing.",
    h2b: "Start spotting.",
    sub: "Sign up free, take the niche quiz, and see what's rising in your niche in minutes.",
    cta: "Start free — no card needed",
  },
  footer: {
    tagline: "Your unfair advantage for short-form video.",
    product: "Product",
    company: "Company",
    account: "Account",
    links: {
      features: "Features",
      pricing: "Pricing",
      faq: "FAQ",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      changelog: "What's new",
      login: "Log in",
      signup: "Sign up",
    },
    rights: "All rights reserved.",
    operatedBy: "Operated by Majd Mohammed Nazir Sayed Taha.",
    version: "Version {version}",
  },
  // Public changelog at /changelog — rendered from the dashboard zone's
  // /api/public/changelog so a release note is written exactly once.
  changelog: {
    metaTitle: "What's new — ReelSpy",
    metaDescription:
      "Every update to ReelSpy: what's new, what got better, and what we fixed — in plain language.",
    eyebrow: "Product updates",
    h1: "What's new in ReelSpy",
    sub: "Everything we've added, improved and fixed — written for people who use the product, not for engineers.",
    currentBadge: "Current version",
    kinds: {
      new: "New",
      improved: "Improved",
      fixed: "Fixed",
    },
    unavailableTitle: "Update history isn't loading right now",
    unavailableBody: "You can always see the full list inside the app.",
    unavailableCta: "Open ReelSpy",
    backHome: "Back to home",
  },
  cookieConsent: {
    ariaLabel: "Cookie consent",
    message:
      "We use essential cookies to keep this site running, plus optional analytics cookies (Microsoft Clarity) that help us understand how visitors use ReelSpy. See our",
    cookiePolicy: "Cookie Policy",
    and: "and",
    privacyPolicy: "Privacy Policy",
    reject: "Reject",
    accept: "Accept",
  },
};

export type Dictionary = typeof en;
