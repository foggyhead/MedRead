import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#030d0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #34d399, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            💊
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#ecfdf5",
              letterSpacing: "-0.5px",
            }}
          >
            MedRead
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            lineHeight: "1.1",
            marginBottom: "28px",
            background: "linear-gradient(135deg, #34d399, #22d3ee)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Your medicine,
          <br />
          in plain language.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#6b9e8f",
            lineHeight: "1.5",
            maxWidth: "700px",
          }}
        >
          Scan any medicine label and get an instant jargon-free explanation in
          11 Indian languages.
        </div>

        {/* Pills row */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "48px",
            flexWrap: "wrap",
          }}
        >
          {["📸 Photo Scan", "🔍 Text Search", "🇮🇳 11 Languages", "🏥 Free to Use"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  borderRadius: "100px",
                  padding: "10px 20px",
                  fontSize: "20px",
                  color: "#34d399",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            fontSize: "22px",
            color: "#2a5a48",
          }}
        >
          medread.in
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
