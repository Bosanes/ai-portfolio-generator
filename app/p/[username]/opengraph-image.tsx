import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a, #020617)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 700, marginBottom: 20 }}>
          {username}
        </h1>

        <p style={{ fontSize: 36, opacity: 0.85 }}>
          Developer Portfolio
        </p>

        <p style={{ fontSize: 24, opacity: 0.6, marginTop: 40 }}>
          Generated with AI Portfolio Generator
        </p>
      </div>
    ),
    size
  );
}
