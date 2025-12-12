"use client";

import { useState } from "react";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";

type Project = {
  name: string;
  language?: string;
  url?: string;
  ai_summary: string;
};

export default function PortfolioPage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<"minimal" | "dark">("minimal");

  async function generatePortfolio() {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setError(null);
    setLoading(true);
    setProjects([]);

    try {
      const ghRes = await fetch(
        `/api/github/import?username=${encodeURIComponent(username)}`
      );
      if (!ghRes.ok) throw new Error("Failed to fetch GitHub repositories.");
      const ghData = await ghRes.json();

      const aiRes = await fetch("/api/github/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: ghData.projects }),
      });
      if (!aiRes.ok) throw new Error("Failed to generate summaries.");
      const aiData = await aiRes.json();

      setProjects(aiData.projects);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          AI Developer Portfolio Generator
        </h1>
        <p className="text-gray-600 mb-8">
          Enter a GitHub username to generate a professional developer portfolio.
        </p>

        {/* Username input */}
        <div className="flex flex-wrap gap-3 mb-3">
          <input
            type="text"
            placeholder="GitHub username (e.g. Bosanes)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 min-w-[220px] rounded-lg border px-4 py-2"
          />
          <button
            onClick={generatePortfolio}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {/* Bio input */}
        <textarea
          placeholder="Short bio (e.g. Full-stack developer focused on modern web technologies)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 mb-6"
          rows={2}
        />

        {/* Template selector */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-gray-600">Template:</span>

          <button
            onClick={() => setTemplate("minimal")}
            className={`rounded-lg px-3 py-1 text-sm border ${
              template === "minimal"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            Minimal
          </button>

          <button
            onClick={() => setTemplate("dark")}
            className={`rounded-lg px-3 py-1 text-sm border ${
              template === "dark"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            Dark
          </button>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {/* Results */}
        {projects.length > 0 && (
          <div
            className={
              template === "dark"
                ? "bg-neutral-950 p-6 rounded-2xl"
                : ""
            }
          >
            {template === "minimal" ? (
              <MinimalTemplate
                username={username}
                bio={bio}
                projects={projects}
              />
            ) : (
              <DarkTemplate
                username={username}
                bio={bio}
                projects={projects}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
