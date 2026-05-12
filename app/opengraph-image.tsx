import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VIG Ledendashboard";
export const size = { width: 1200, height: 630 };
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0B2E4A",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(242,140,40,0.35) 0%, rgba(47,168,214,0.15) 55%, transparent 80%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            zIndex: 1,
            padding: "0 80px",
          }}
        >
          <p
            style={{
              color: "#F28C28",
              fontSize: 15,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Vereniging Innovatieve Geneesmiddelen
          </p>
          <h1
            style={{
              color: "#ffffff",
              fontSize: 72,
              fontWeight: 700,
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            VIG Ledendashboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 24,
              margin: 0,
              textAlign: "center",
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            Financieel overzicht van beursgenoteerde leden
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
