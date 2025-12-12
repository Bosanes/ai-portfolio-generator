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
        <h1 className="text-4xl font-bold text-gray-900">
          {username}
        </h1>
        <p className="text-gray-700 mt-2">
          Developer portfolio generated from GitHub.
        </p>
      </header>

      <div className="space-y-6">
        {projects.map((p) => (
          <article
            key={p.name}
            className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {p.name}
                </h2>

                {p.language && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tech: {p.language}
                  </p>
                )}
              </div>

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-700 font-medium hover:underline"
                >
                  GitHub →
                </a>
              )}
            </div>

            <p className="mt-3 text-gray-800 leading-relaxed">
              {p.ai_summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
