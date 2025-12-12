import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // ✅ IMPORTANT: unwrap params
  const { username } = await params;

  // Default GitHub avatar (always exists)
  let avatarBuffer: ArrayBuffer;

  try {
    const res = await fetch(`https://github.com/${username}.png`, {
      cache: "force-cache",
    });

    if (!res.ok) throw new Error("Avatar fetch failed");

    avatarBuffer = await res.arrayBuffer();
  } catch {
    // ✅ Safe fallback avatar
    const fallback = await fetch(
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    );
    avatarBuffer = await fallback.arrayBuffer();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 60,
          padding: 80,
          background: "linear-gradient(135deg, #020617, #0f172a)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Avatar */}
        <img
          src={avatarBuffer as any}
          width={220}
          height={220}
          style={{
            borderRadius: "50%",
            border: "6px solid rgba(255,255,255,0.25)",
          }}
        />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: 72, fontWeight: 700, marginBottom: 16 }}>
            {username}
          </h1>

          <p style={{ fontSize: 36, opacity: 0.85 }}>
            Developer Portfolio
          </p>

          <p style={{ fontSize: 24, opacity: 0.6, marginTop: 32 }}>
            Generated with AI Portfolio Generator
          </p>
        </div>
      </div>
    ),
    size
  );
}
