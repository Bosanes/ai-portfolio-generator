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
  const { username } = await params;

  let avatarUrl: string | null = null;
  let techStack: string[] = ["JavaScript", "TypeScript", "React"];

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (res.ok) {
      const user = await res.json();
      avatarUrl = user.avatar_url ?? null;
    }
  } catch {
    // swallow error – OG images must never throw
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #020617, #020617)",
          color: "white",
          padding: 80,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            width={180}
            height={180}
            style={{
              borderRadius: "50%",
              marginRight: 60,
            }}
          />
        ) : (
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "#1e293b",
              marginRight: 60,
            }}
          />
        )}

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: 56, margin: 0 }}>{username}</h1>
          <p style={{ fontSize: 26, opacity: 0.85, marginTop: 10 }}>
            Developer Portfolio
          </p>

          {/* Tech stack */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: 20,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
