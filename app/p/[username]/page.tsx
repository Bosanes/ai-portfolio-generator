"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";

type Project = {
  name: string;
  language?: string;
  url?: string;
  ai_summary: string;
};

/* ---------------- SEO METADATA ---------------- */

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  const title = `${username} – Developer Portfolio`;
  const description = `AI-generated developer portfolio for ${username}, showcasing GitHub projects and technical skills.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ai-portfolio-generator.vercel.app/p/${username}`,
      siteName: "AI Portfolio Generator",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ---------------- PAGE ---------------- */

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<"minimal" | "dark">("minimal");

  const bio = "Developer portfolio generated from GitHub.";

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const ghRes = await fetch(
          `/api/github/import?username=${encodeURIComponent(username)}`
        );
        if (!ghRes.ok) throw new Error("GitHub user not found");
        const ghData = await ghRes.json();

        const aiRes = await fetch("/api/github/ai-summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: ghData.projects }),
        });
        if (!aiRes.ok) throw new Error("Failed to generate summaries");
        const aiData = await aiRes.json();

        setProjects(aiData.projects);
      } catch (err: any) {
        setError(err.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading portfolio…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/p/${username}`
              )
            }
            className="text-sm rounded-lg border px-3 py-1 hover:bg-gray-100"
          >
            Copy portfolio link
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setTemplate("minimal")}
              className={`px-3 py-1 text-sm rounded border ${
                template === "minimal"
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              Minimal
            </button>

            <button
              onClick={() => setTemplate("dark")}
              className={`px-3 py-1 text-sm rounded border ${
                template === "dark"
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {template === "minimal" ? (
          <MinimalTemplate
            username={username}
            bio={bio}
            projects={projects}
          />
        ) : (
          <div className="bg-neutral-950 p-6 rounded-2xl">
            <DarkTemplate
              username={username}
              bio={bio}
              projects={projects}
            />
          </div>
        )}
      </div>
    </main>
  );
}
