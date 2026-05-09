import type { InsertCategory } from "@workspace/db";

export const CATEGORIES: InsertCategory[] = [
  {
    slug: "code-assistants",
    name: "Code Assistants",
    description:
      "AI-powered coding tools, IDE plugins, and autonomous software engineering agents that help write, review, and debug code.",
    icon: "code-2",
  },
  {
    slug: "chat-assistants",
    name: "Chat Assistants",
    description:
      "General-purpose conversational AI assistants capable of reasoning, answering questions, and completing complex text tasks.",
    icon: "message-circle",
  },
  {
    slug: "image-generation",
    name: "Image Generation",
    description:
      "AI tools for generating, editing, and transforming images and artwork from text prompts or reference images.",
    icon: "image",
  },
  {
    slug: "video-generation",
    name: "Video Generation",
    description:
      "AI platforms for generating, editing, and enhancing video content including text-to-video and avatar-based videos.",
    icon: "video",
  },
  {
    slug: "audio-music",
    name: "Audio & Music",
    description:
      "AI tools for voice synthesis, cloning, music generation, podcast editing, and audio enhancement.",
    icon: "music",
  },
  {
    slug: "writing-tools",
    name: "Writing Tools",
    description:
      "AI writing assistants for long-form content, marketing copy, grammar correction, and brand voice generation.",
    icon: "pen-line",
  },
  {
    slug: "research",
    name: "Research",
    description:
      "AI-powered research assistants for literature review, academic paper search, citation analysis, and knowledge synthesis.",
    icon: "search",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description:
      "AI tools for meeting transcription, note-taking, knowledge management, and workplace productivity.",
    icon: "zap",
  },
  {
    slug: "developer-platforms",
    name: "Developer Platforms",
    description:
      "AI infrastructure, model hubs, vector databases, LLM frameworks, and APIs for building AI-powered applications.",
    icon: "cpu",
  },
  {
    slug: "design-ux",
    name: "Design & UX",
    description:
      "AI tools for UI/UX design, logo creation, background removal, prototyping, and visual brand development.",
    icon: "palette",
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    description:
      "AI-powered data analysis, business intelligence, predictive analytics, and no-code data science tools.",
    icon: "bar-chart-2",
  },
  {
    slug: "automation",
    name: "Automation",
    description:
      "AI-powered workflow automation, agent builders, no-code integrations, and multi-step task orchestration platforms.",
    icon: "workflow",
  },
  {
    slug: "presentations",
    name: "Presentations",
    description:
      "AI tools for generating slides, decks, and visual stories from prompts, documents, or outlines.",
    icon: "presentation",
  },
  {
    slug: "meeting-assistants",
    name: "Meeting Assistants",
    description:
      "AI notetakers, transcription bots, and live meeting copilots that record, summarise, and extract action items from calls.",
    icon: "mic",
  },
  {
    slug: "sales-marketing",
    name: "Sales & Marketing",
    description:
      "AI-powered prospecting, outbound, CRM, lead enrichment, and revenue-team copilots for sales and growth.",
    icon: "target",
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    description:
      "AI agents and copilots that resolve tickets, deflect support volume, and assist human agents in customer service.",
    icon: "headphones",
  },
  {
    slug: "education",
    name: "Education & Learning",
    description:
      "AI tutors, learning platforms, classroom copilots, and study aids for students, teachers, and lifelong learners.",
    icon: "graduation-cap",
  },
  {
    slug: "legal",
    name: "Legal",
    description:
      "AI tools for contract review, legal drafting, case research, and law-firm copilots built on top of frontier models.",
    icon: "scale",
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    description:
      "AI for FP&A, accounting automation, AP/AR, financial research, and analyst copilots inside spreadsheets and ERPs.",
    icon: "calculator",
  },
  {
    slug: "security-compliance",
    name: "Security & Compliance",
    description:
      "AI copilots and agents for application security, threat detection, vulnerability triage, and compliance automation (SOC2, ISO, GDPR).",
    icon: "shield",
  },
  {
    slug: "3d-cad",
    name: "3D & CAD",
    description:
      "AI tools for 3D asset generation, neural radiance fields, CAD copilots, and text-to-3D modelling for games, AR/VR, and product design.",
    icon: "box",
  },
];
