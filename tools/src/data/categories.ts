import type { InsertCategory } from "@workspace/db";

// sortOrder: lower = displayed earlier. featured: shown in the trending strip.
// Buckets reflect the 2025-2026 trend ranking — see PR description for rationale.
export const CATEGORIES: InsertCategory[] = [
  // ── 🔥 Hot / featured ─────────────────────────────────────────────────────
  {
    slug: "code-assistants",
    name: "Code Assistants",
    description:
      "AI-powered coding tools, IDE plugins, and autonomous software engineering agents that help write, review, and debug code.",
    icon: "code-2",
    sortOrder: 10,
    featured: true,
  },
  {
    slug: "automation",
    name: "Automation",
    description:
      "AI-powered workflow automation, agent builders, no-code integrations, and multi-step task orchestration platforms.",
    icon: "workflow",
    sortOrder: 20,
    featured: true,
  },
  {
    slug: "video-generation",
    name: "Video Generation",
    description:
      "AI platforms for generating, editing, and enhancing video content including text-to-video and avatar-based videos.",
    icon: "video",
    sortOrder: 30,
    featured: true,
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    description:
      "AI agents and copilots that resolve tickets, deflect support volume, and assist human agents in customer service.",
    icon: "headphones",
    sortOrder: 40,
    featured: true,
  },
  {
    slug: "sales-marketing",
    name: "Sales & Marketing",
    description:
      "AI-powered prospecting, outbound, CRM, lead enrichment, and revenue-team copilots for sales and growth.",
    icon: "target",
    sortOrder: 50,
    featured: true,
  },
  {
    slug: "legal",
    name: "Legal",
    description:
      "AI tools for contract review, legal drafting, case research, and law-firm copilots built on top of frontier models.",
    icon: "scale",
    sortOrder: 60,
    featured: true,
  },
  {
    slug: "developer-platforms",
    name: "Developer Platforms",
    description:
      "AI infrastructure, model hubs, vector databases, LLM frameworks, inference, and APIs for building AI-powered applications.",
    icon: "cpu",
    sortOrder: 70,
    featured: true,
  },
  {
    slug: "security-compliance",
    name: "Security & Compliance",
    description:
      "AI copilots and agents for application security, threat detection, vulnerability triage, and compliance automation (SOC2, ISO, GDPR).",
    icon: "shield",
    sortOrder: 80,
    featured: true,
  },
  {
    slug: "voice-agents",
    name: "Voice Agents",
    description:
      "Real-time voice AI for telephony, contact centres, and voice-first applications — from SDKs (Vapi, Retell) to deployed contact-centre agents.",
    icon: "phone",
    sortOrder: 90,
    featured: true,
  },
  {
    slug: "browser-agents",
    name: "Browser Agents",
    description:
      "AI agents that drive a real browser to research, fill forms, and complete multi-step tasks on behalf of a user.",
    icon: "globe",
    sortOrder: 100,
    featured: true,
  },

  // ── 🌤 Warm ───────────────────────────────────────────────────────────────
  {
    slug: "chat-assistants",
    name: "Chat Assistants",
    description:
      "General-purpose conversational AI assistants capable of reasoning, answering questions, and completing complex text tasks.",
    icon: "message-circle",
    sortOrder: 110,
    featured: false,
  },
  {
    slug: "image-generation",
    name: "Image Generation",
    description:
      "AI tools for generating, editing, and transforming images and artwork from text prompts or reference images.",
    icon: "image",
    sortOrder: 120,
    featured: false,
  },
  {
    slug: "audio-music",
    name: "Audio & Music",
    description:
      "AI tools for voice synthesis, cloning, music generation, podcast editing, and audio enhancement.",
    icon: "music",
    sortOrder: 130,
    featured: false,
  },
  {
    slug: "design-ux",
    name: "Design & UX",
    description:
      "AI tools for UI/UX design, logo creation, background removal, prototyping, and visual brand development.",
    icon: "palette",
    sortOrder: 140,
    featured: false,
  },
  {
    slug: "meeting-assistants",
    name: "Meeting Assistants",
    description:
      "AI notetakers, transcription bots, and live meeting copilots that record, summarise, and extract action items from calls.",
    icon: "mic",
    sortOrder: 150,
    featured: false,
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    description:
      "AI-powered data analysis, business intelligence, predictive analytics, and no-code data science tools.",
    icon: "bar-chart-2",
    sortOrder: 160,
    featured: false,
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    description:
      "AI for FP&A, accounting automation, AP/AR, financial research, and analyst copilots inside spreadsheets and ERPs.",
    icon: "calculator",
    sortOrder: 170,
    featured: false,
  },
  {
    slug: "education",
    name: "Education & Learning",
    description:
      "AI tutors, learning platforms, classroom copilots, and study aids for students, teachers, and lifelong learners.",
    icon: "graduation-cap",
    sortOrder: 180,
    featured: false,
  },
  {
    slug: "3d-cad",
    name: "3D & CAD",
    description:
      "AI tools for 3D asset generation, neural radiance fields, CAD copilots, and text-to-3D modelling for games, AR/VR, and product design.",
    icon: "box",
    sortOrder: 190,
    featured: false,
  },

  // ── 💤 Mature / saturated ─────────────────────────────────────────────────
  {
    slug: "writing-tools",
    name: "Writing Tools",
    description:
      "AI writing assistants for long-form content, marketing copy, grammar correction, and brand voice generation.",
    icon: "pen-line",
    sortOrder: 260,
    featured: false,
  },
  {
    slug: "productivity",
    name: "Productivity",
    description:
      "AI tools for note-taking, knowledge management, enterprise search, and workplace productivity.",
    icon: "zap",
    sortOrder: 270,
    featured: false,
  },
  {
    slug: "research",
    name: "Research",
    description:
      "AI-powered research assistants for literature review, academic paper search, citation analysis, and knowledge synthesis.",
    icon: "search",
    sortOrder: 280,
    featured: false,
  },
  {
    slug: "presentations",
    name: "Presentations",
    description:
      "AI tools for generating slides, decks, and visual stories from prompts, documents, or outlines.",
    icon: "presentation",
    sortOrder: 290,
    featured: false,
  },
];
