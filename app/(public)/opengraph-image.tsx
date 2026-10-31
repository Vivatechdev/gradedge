import { ImageResponse } from "next/og";

export const alt =
  "GradEdge Academic Solutions — Dissertation Mentoring & Research Coaching";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#14263F",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Gold top rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#C8963E",
          }}
        />

        {/* Logo wordmark */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Gold square mark */}
          <div
            style={{
              width: 14,
              height: 14,
              background: "#C8963E",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            GradEdge
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 64,
            fontWeight: 400,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          Your thesis is yours.{" "}
          <span style={{ color: "#C8963E" }}>We help you finish it.</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 22,
            color: "rgba(255,255,255,0.70)",
            margin: 0,
            letterSpacing: "0.01em",
            lineHeight: 1.5,
          }}
        >
          Dissertation mentoring, research coaching and academic support for
          postgraduate researchers worldwide.
        </p>

        {/* Bottom rule line */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            right: 80,
            height: 1,
            background: "rgba(228,223,213,0.25)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

