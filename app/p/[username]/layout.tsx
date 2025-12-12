import type { Metadata } from "next";

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

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
