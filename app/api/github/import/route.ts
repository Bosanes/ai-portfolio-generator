import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Missing ?username=" },
      { status: 400 }
    );
  }

  try {
    // Fetch repositories
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          "User-Agent": "portfolio-generator",
          Accept: "application/vnd.github+json",
        },
      }
    ).then((res) => res.json());

    // Fetch README for each repo
    const reposWithReadme = await Promise.all(
      repos.map(async (repo: any) => {
        const readmeRes = await fetch(
          `https://raw.githubusercontent.com/${username}/${repo.name}/main/README.md`
        );

        let readme = "";
        if (readmeRes.ok) readme = await readmeRes.text();

        return {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          updated_at: repo.updated_at,
          readme,
        };
      })
    );

    return NextResponse.json({
      username,
      projects: reposWithReadme,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to import GitHub data", details: err },
      { status: 500 }
    );
  }
}
