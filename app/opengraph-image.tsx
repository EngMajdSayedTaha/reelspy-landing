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
          backgroundColor: "#090a18",
          backgroundImage:
            "radial-gradient(700px 500px at 12% 0%, rgba(109,92,255,0.35), transparent 60%), radial-gradient(700px 600px at 100% 100%, rgba(73,228,255,0.28), transparent 60%)",
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
              background: "linear-gradient(150deg,#222850,#090a18)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderLeft: "26px solid #49e4ff",
                marginLeft: 6,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            <span>Reel</span>
            <span style={{ color: "#49e4ff" }}>Spy</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>Your&nbsp;</span>
            <span
              style={{
                backgroundImage: "linear-gradient(120deg,#6d5cff,#4e7dff,#49e4ff)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              unfair advantage
            </span>
            <span>&nbsp;for short-form video.</span>
          </div>
          <div style={{ fontSize: 30, color: "#a2a2ad", lineHeight: 1.4, maxWidth: 820 }}>
            Spot over-performing reels, script them in your voice with Claude AI, and post everywhere at once.
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 6, width: 120, borderRadius: 999, background: "linear-gradient(120deg,#6d5cff,#49e4ff)" }} />
          <div style={{ fontSize: 24, color: "#a2a2ad" }}>
            Instagram · TikTok · YouTube · Facebook · reelspy.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
