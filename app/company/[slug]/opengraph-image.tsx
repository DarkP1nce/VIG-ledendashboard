import { ImageResponse } from "next/og";
import { getCompanyBySlug } from "@/data/companies";

export const runtime = "edge";
export const alt = "VIG Ledendashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const company = getCompanyBySlug(params.slug);
  if (!company) return new Response("Not found", { status: 404 });

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
              "radial-gradient(ellipse at 40% 40%, rgba(242,140,40,0.28) 0%, rgba(47,168,214,0.12) 55%, transparent 80%)",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(242,140,40,0.15)",
              border: "1px solid rgba(242,140,40,0.3)",
              borderRadius: 99,
              padding: "6px 18px",
            }}
          >
            <p
              style={{
                color: "#F28C28",
                fontSize: 14,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 600,
              }}
            >
              {company.ticker} · {company.country}
            </p>
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: 68,
              fontWeight: 700,
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {company.fullName}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 22,
              margin: 0,
              textAlign: "center",
            }}
          >
            {company.exchange} · VIG Ledendashboard
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
