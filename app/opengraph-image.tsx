import { ImageResponse } from "next/og";

export const alt = "ReelSpy — Spot viral reels early, script them in your voice, post everywhere";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#16161c",
          // Achromatic light, matching the page. This was a violet→cyan pair
          // left over from the old two-gradient brand: the share card was
          // advertising a color scheme the site no longer has anywhere on it.
          backgroundImage:
            "radial-gradient(760px 540px at 10% -6%, rgba(236,236,242,0.10), transparent 62%), radial-gradient(720px 620px at 104% 106%, rgba(236,236,242,0.07), transparent 62%)",
          fontFamily: "sans-serif",
          color: "#e7e7ea",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(150deg,#2a2a31,#0e0e11)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderLeft: "26px solid #f9e400",
                marginLeft: 6,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            <span>Reel</span>
            <span style={{ color: "#f9e400" }}>Spy</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>Your&nbsp;</span>
            {/* Plain color: this used to be a single-stop "gradient" painted
                behind transparent text, which is an expensive way to write
                color: #f9e400 — and it renders as invisible text anywhere
                background-clip:text isn't honoured. */}
            <span style={{ color: "#f9e400" }}>unfair advantage</span>
            <span>&nbsp;for short-form video.</span>
          </div>
          <div style={{ fontSize: 30, color: "#a2a2ad", lineHeight: 1.4, maxWidth: 820 }}>
            Spot over-performing reels, script them in your voice with Claude AI, and post everywhere at once.
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 5, width: 96, borderRadius: 999, background: "#f9e400" }} />
          <div style={{ fontSize: 24, color: "#a2a2ad" }}>
            Instagram · TikTok · YouTube · Facebook · reelspy.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
