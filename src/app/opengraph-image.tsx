import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 24%), linear-gradient(135deg, #071a3c, #0C3272 50%, #1b4ea7)",
          color: "white",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "auto",
            padding: "14px 22px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            fontSize: 26,
          }}
        >
          Progress.uzb
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.08 }}>
            Premium Marketing Agency
          </div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.82)" }}>
            Branding, websites, performance, automation, and AI for ambitious
            businesses in Samarkand.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
