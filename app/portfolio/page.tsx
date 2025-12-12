"use client";

import { useEffect, useState } from "react";

type Project = {
  name: string;
  language?: string;
  url?: string;
  ai_summary: string;
};

export default function PortfolioPage() {
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePortfolio() {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setError(null);
    setLoading(true);
    setProjects([]);

    try {
      // 1) Fetch GitHub repos for the entered username
      const ghRes = await fetch(
        `/api/github/import?username=${encodeURIComponent(username)}`
      );

      if (!ghRes.ok) {
        throw new Error("Failed to fetch GitHub repositories.");
      }

      const ghData = await ghRes.json();

      // 2) Send repos to AI summary API (mocked)
      const aiRes = await fetch("/api/github/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: ghData.projects }),
      });

      if (!aiRes.ok) {
        throw new Error("Failed to generate project summaries.");
      }

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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          AI Developer Portfolio Generator
        </h1>
        <p className="text-gray-600 mb-8">
          Enter a GitHub username to generate a professional developer portfolio.
        </p>

        {/* Input section */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="GitHub username (e.g. Bosanes)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring"
          />
          <button
            onClick={generatePortfolio}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 mb-6">
            {error}
          </p>
        )}

        {/* Results */}
        {projects.length > 0 && (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <h2 className="text-xl font-semibold">
                  {project.name}
                </h2>

                {project.language && (
                  <p className="text-sm text-gray-500">
                    Tech: {project.language}
                  </p>
                )}

                <p className="mt-3 text-gray-700">
                  {project.ai_summary}
                </p>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:underline"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
