type Project = {
  name: string;
  language?: string;
  url?: string;
  ai_summary: string;
};

export default function MinimalTemplate({
  username,
  projects,
}: {
  username: string;
  projects: Project[];
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">{username}</h1>
        <p className="text-gray-600 mt-2">
          Developer portfolio generated from GitHub.
        </p>
      </header>

      <div className="space-y-6">
        {projects.map((p) => (
          <article key={p.name} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                {p.language && (
                  <p className="text-sm text-gray-500 mt-1">Tech: {p.language}</p>
                )}
              </div>

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  GitHub →
                </a>
              )}
            </div>

            <p className="mt-3 text-gray-700">{p.ai_summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
