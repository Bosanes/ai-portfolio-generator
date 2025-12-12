type Project = {
  name: string;
  language?: string;
  url?: string;
  ai_summary: string;
};

export default function DarkTemplate({
  username,
  bio,
  projects,
}: {
  username: string;
  bio?: string;
  projects: Project[];
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 rounded-2xl bg-neutral-900 p-8 text-white border border-neutral-800">
        <p className="text-sm text-neutral-400">AI Portfolio</p>

        <h1 className="text-4xl font-bold mt-2">
          {username}
        </h1>

        <p className="text-neutral-200 mt-3">
          {bio || "Projects and summaries generated from GitHub."}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.name}
            className="rounded-2xl bg-neutral-950 p-6 text-white border border-neutral-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {p.name}
                </h2>

                {p.language && (
                  <p className="text-sm text-neutral-400 mt-1">
                    {p.language}
                  </p>
                )}
              </div>

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-300 hover:underline"
                >
                  GitHub →
                </a>
              )}
            </div>

            <p className="mt-4 text-neutral-200 leading-relaxed">
              {p.ai_summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
