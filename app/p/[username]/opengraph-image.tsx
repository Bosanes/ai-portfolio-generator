import { ImageResponse } from "next/og";

export const runtime = "edge";

type GitHubRepo = {
  language: string | null;
};

export default async function OpenGraphImage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  /* ---------- Fetch GitHub user ---------- */

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!userRes.ok) {
    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "white",
          fontSize: 48,
        }}
      >
        User not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const user = await userRes.json();

  /* ---------- Fetch repos ---------- */

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    {
      headers: { Accept: "application/vnd.github+json" },
    }
  );

  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  /* ---------- Compute tech stack ---------- */

  const languageCount: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const techStack = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);

  const avatarUrl =
    user.avatar_url || "https://github.com/github.png";

  /* ---------- OG Image ---------- */

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #020617 0%, #020617 100%)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Avatar */}
        <img
          src={avatarUrl}
          width={180}
          height={180}
          style={{
            borderRadius: "50%",
            border: "4px solid #334155",
          }}
        />

        {/* Text */}
        <div style={{ marginLeft: "48px" }}>
          <h1 style={{ fontSize: "56px", margin: 0 }}>
            {username}
          </h1>

          <p
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              marginTop: "12px",
            }}
          >
            Developer Portfolio
          </p>

          {/* Tech stack */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  fontSize: "18px",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
