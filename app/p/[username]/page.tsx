"use client";

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

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<"minimal" | "dark">("minimal");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        // 1) GitHub import
        const ghRes = await fetch(
          `/api/github/import?username=${encodeURIComponent(username)}`
        );
        if (!ghRes.ok) throw new Error("GitHub user not found");
        const ghData = await ghRes.json();

        // 2) AI summaries (mock)
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
        {/* Template switcher */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setTemplate("minimal")}
            className={`px-3 py-1 text-sm rounded border ${
              template === "minimal" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Minimal
          </button>
          <button
            onClick={() => setTemplate("dark")}
            className={`px-3 py-1 text-sm rounded border ${
              template === "dark" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Dark
          </button>
        </div>

        {/* Portfolio */}
        {template === "minimal" ? (
          <MinimalTemplate username={username} projects={projects} />
        ) : (
          <div className="bg-neutral-950 p-6 rounded-2xl">
            <DarkTemplate username={username} projects={projects} />
          </div>
        )}
      </div>
    </main>
  );
}
