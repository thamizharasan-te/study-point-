import { ImageResponse } from "next/og";

export const alt = "Study Point — Little Learners. Brighter Tomorrows.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share-preview card shown when the link is posted on WhatsApp / Facebook. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#e8f3e4,#fde8ef)", color: "#14306b" }}>
        <div style={{ fontSize: 40, color: "#2e7d32", fontWeight: 700 }}>Study Point</div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 20, lineHeight: 1.05 }}>Little Learners.</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: "#2e7d32", lineHeight: 1.05 }}>Brighter</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: "#d81b60", lineHeight: 1.05 }}>Tomorrows.</div>
        <div style={{ fontSize: 30, marginTop: 28 }}>Nursery & English Classes · Point Pedro · Vathiry</div>
      </div>
    ),
    size,
  );
}
