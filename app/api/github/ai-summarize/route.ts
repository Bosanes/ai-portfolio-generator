import { NextResponse } from "next/server";

function mockSummary(project: any) {
  const tech = project.language || "modern web technologies";
  return `This project demonstrates practical experience with ${tech}. It focuses on building functional and maintainable solutions while applying real-world development practices. The project highlights problem-solving skills, clean code structure, and hands-on implementation experience.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projects = body.projects;

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "projects must be an array" },
        { status: 400 }
      );
    }

    const summarizedProjects = projects.map((project) => ({
      ...project,
      ai_summary: mockSummary(project),
    }));

    return NextResponse.json({ projects: summarizedProjects });
  } catch (error) {
    return NextResponse.json(
      { error: "Mock AI generation failed" },
      { status: 500 }
    );
  }
}
