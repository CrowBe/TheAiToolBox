import { db, pool } from "@workspace/db";
import {
  categoriesTable,
  rolesTable,
  toolsTable,
  type InsertCategory,
  type InsertRole,
} from "@workspace/db";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const CATEGORIES: InsertCategory[] = [
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
];

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

const ROLES: InsertRole[] = [
  {
    slug: "developer",
    name: "Developer",
    description:
      "Software engineers, full-stack developers, and DevOps professionals building and maintaining software systems.",
  },
  {
    slug: "designer",
    name: "Designer",
    description:
      "UI/UX designers, graphic designers, and visual artists creating digital products and brand assets.",
  },
  {
    slug: "marketer",
    name: "Marketer",
    description:
      "Marketing professionals, copywriters, and growth hackers creating and distributing content to drive business results.",
  },
  {
    slug: "researcher",
    name: "Researcher",
    description:
      "Academic researchers, scientists, and knowledge workers conducting literature reviews and synthesising information.",
  },
  {
    slug: "writer",
    name: "Writer",
    description:
      "Content writers, journalists, bloggers, and authors producing long-form text for various audiences.",
  },
  {
    slug: "data-scientist",
    name: "Data Scientist",
    description:
      "Data scientists, ML engineers, and analysts working with large datasets and machine learning models.",
  },
  {
    slug: "product-manager",
    name: "Product Manager",
    description:
      "Product managers and strategists defining product vision, roadmaps, and user requirements.",
  },
  {
    slug: "student",
    name: "Student",
    description:
      "Students and lifelong learners using AI to accelerate their education and skill development.",
  },
  {
    slug: "entrepreneur",
    name: "Entrepreneur",
    description:
      "Founders and business owners using AI to build products and run their businesses more efficiently.",
  },
  {
    slug: "video-creator",
    name: "Video Creator",
    description:
      "YouTubers, video editors, and content creators producing video content for online platforms.",
  },
];

// ---------------------------------------------------------------------------
// Tools seed data
// Each entry uses category slugs (resolved to IDs at insert time)
// ---------------------------------------------------------------------------

type SeedTool = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  categorySlug: string;
  hasFree: boolean;
  pricingModel: "free" | "freemium" | "paid" | "enterprise" | "open_source";
  pricingDetails: string;
  launchedYear: number;
  roles: string[];
  tags: string[];
  accentColor: string;
  securityScore: number;
  securityAnalysis: string;
  dataPrivacyNotes: string;
  complianceBadges: string[];
};

const TOOLS: SeedTool[] = [
  // ── Code Assistants ────────────────────────────────────────────────────────
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    tagline: "Your AI pair programmer",
    description:
      "GitHub Copilot is an AI pair programmer that offers autocomplete-style suggestions as you code. Powered by OpenAI Codex and GPT-4, it integrates directly into VS Code, JetBrains, Neovim, and other editors. It understands context from your entire codebase, suggests whole lines or entire functions, and can generate tests, documentation, and boilerplate. The Business and Enterprise tiers add org-wide policy controls, audit logs, and IP indemnity.",
    websiteUrl: "https://github.com/features/copilot",
    logoUrl: "https://logo.clearbit.com/github.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free for verified students and OSS maintainers. Individual: $10/month. Business: $19/user/month. Enterprise: $39/user/month.",
    launchedYear: 2021,
    roles: ["developer"],
    tags: [
      "code-completion",
      "pair-programming",
      "ide-plugin",
      "openai",
      "github",
    ],
    accentColor: "#238636",
    securityScore: 82,
    securityAnalysis:
      "GitHub Copilot operates under Microsoft and GitHub's enterprise security infrastructure. Code sent to the model is filtered for PII and secrets. Business/Enterprise plans offer a no-training pledge, content exclusions, and audit logs. SOC 2 Type II certified.",
    dataPrivacyNotes:
      "On Individual plans, telemetry and snippet data may be used to improve the model unless opted out. Business and Enterprise plans disable training on your code by default.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "cursor",
    name: "Cursor",
    tagline: "The AI-first code editor",
    description:
      "Cursor is a VS Code fork rebuilt from the ground up to work with AI. It features Cmd-K for in-place code edits, a chat panel with full codebase context, multi-file edits, terminal awareness, and an Agent mode that can autonomously run commands and iterate on bugs. Cursor uses frontier models (GPT-4o, Claude 3.5/3.7 Sonnet) and offers a privacy mode that prevents your code from being stored on their servers.",
    websiteUrl: "https://cursor.com",
    logoUrl: "https://logo.clearbit.com/cursor.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Hobby: free (2,000 completions/month). Pro: $20/month. Business: $40/user/month.",
    launchedYear: 2023,
    roles: ["developer"],
    tags: [
      "ide",
      "code-editor",
      "agentic-coding",
      "multi-file-edit",
      "codebase-context",
    ],
    accentColor: "#8B5CF6",
    securityScore: 75,
    securityAnalysis:
      "Cursor offers a Privacy Mode that prevents code from being stored or used for training. Without it, prompts and code snippets may be retained. The company is SOC 2 Type II certified. Self-hosting options are not available.",
    dataPrivacyNotes:
      "Privacy Mode routes requests through Cursor's servers but prevents logging. Business plans include a zero-data-retention agreement with model providers.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    tagline: "Agentic IDE that keeps you in flow",
    description:
      "Windsurf (by Codeium) is an agentic IDE built to keep developers in a state of flow. Its Cascade agent can plan, execute multi-step coding tasks, run terminal commands, browse the web for docs, and iterate until tests pass — all without constant prompting. Windsurf uses Codeium's own models alongside frontier models and integrates deep codebase indexing for context-aware suggestions across large projects.",
    websiteUrl: "https://windsurf.com",
    logoUrl: "https://logo.clearbit.com/windsurf.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier with limited credits. Pro: $15/month. Teams: $35/user/month.",
    launchedYear: 2024,
    roles: ["developer"],
    tags: ["agentic-coding", "ide", "cascade-agent", "codeium", "autonomous"],
    accentColor: "#06B6D4",
    securityScore: 72,
    securityAnalysis:
      "Windsurf uses Codeium's privacy-first infrastructure. Enterprise plans include a no-training pledge and data processing agreements. The Cascade agent executes terminal commands, so careful code review is advised.",
    dataPrivacyNotes:
      "Free-tier usage may contribute to model improvements. Pro and Team plans offer a no-training pledge.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "tabnine",
    name: "Tabnine",
    tagline: "Private AI assistant for software development",
    description:
      "Tabnine is an AI code assistant focused on privacy and enterprise security. It can run fully on-premises, ensuring your code never leaves your infrastructure. Tabnine supports 80+ programming languages and integrates with all major IDEs. It learns from your codebase to provide personalised suggestions while offering strong data governance controls. Its AI agents can generate, test, fix, and review code autonomously.",
    websiteUrl: "https://tabnine.com",
    logoUrl: "https://logo.clearbit.com/tabnine.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Basic: free. Pro: $12/user/month. Enterprise: custom pricing with on-premises deployment option.",
    launchedYear: 2019,
    roles: ["developer"],
    tags: [
      "code-completion",
      "on-premises",
      "privacy-first",
      "enterprise",
      "multi-language",
    ],
    accentColor: "#7C3AED",
    securityScore: 88,
    securityAnalysis:
      "Tabnine is the strongest enterprise-security option in this category. It offers on-premises deployment (code never leaves your network), SOC 2 Type II certification, GDPR compliance, and a no-training pledge on customer code. Fine-tuning happens on isolated per-customer models.",
    dataPrivacyNotes:
      "Enterprise plan: completely air-gapped option available. Pro plan: code is processed in ephemeral sessions and not stored for training.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "amazon-q-developer",
    name: "Amazon Q Developer",
    tagline: "AWS's AI-powered developer assistant",
    description:
      "Amazon Q Developer (formerly CodeWhisperer) is AWS's AI coding assistant that understands your cloud architecture. It generates code suggestions, scans for security vulnerabilities, optimises AWS service usage, and can automatically upgrade legacy code. Deeply integrated with AWS services, it excels at infrastructure-as-code, Lambda functions, CDK, and CloudFormation templates. The free tier offers generous limits for individual developers.",
    websiteUrl: "https://aws.amazon.com/q/developer",
    logoUrl: "https://logo.clearbit.com/aws.amazon.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Individual tier: free (unlimited code suggestions, 50 security scans/month). Pro: $19/user/month.",
    launchedYear: 2022,
    roles: ["developer"],
    tags: [
      "aws",
      "cloud",
      "security-scanning",
      "iac",
      "code-completion",
      "amazon",
    ],
    accentColor: "#FF9900",
    securityScore: 86,
    securityAnalysis:
      "Amazon Q Developer benefits from AWS's mature security infrastructure. It includes a built-in security vulnerability scanner (OWASP, CWE). Code snippets processed under AWS data processing terms. Pro tier has a no-training pledge. FISMA Moderate authorisation.",
    dataPrivacyNotes:
      "Free tier may use content to improve models. Pro tier: content is not used for training AWS or third-party models.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },
  {
    slug: "codeium",
    name: "Codeium",
    tagline: "Free AI code acceleration toolkit",
    description:
      "Codeium provides fast, free AI code completion for individual developers across 70+ languages and 40+ editors. It uses its own purpose-built models optimised for speed and accuracy. Beyond simple autocomplete, Codeium offers a chat interface, codebase-aware search, and natural language code editing. It powers Windsurf (its agentic IDE) and offers enterprise on-premises deployment.",
    websiteUrl: "https://codeium.com",
    logoUrl: "https://logo.clearbit.com/codeium.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Individual: free forever. Teams: $12/user/month. Enterprise: custom with on-premises option.",
    launchedYear: 2022,
    roles: ["developer"],
    tags: ["code-completion", "free", "multi-language", "ide-plugin", "fast"],
    accentColor: "#09B6A2",
    securityScore: 74,
    securityAnalysis:
      "Codeium has SOC 2 Type II certification. Enterprise plans offer on-premises deployment. Individual tier sends code snippets to Codeium's servers for model inference.",
    dataPrivacyNotes:
      "Individual free tier: usage data helps improve models. Enterprise: no training on customer code, isolated model deployment available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "devin",
    name: "Devin",
    tagline: "The first fully autonomous AI software engineer",
    description:
      "Devin by Cognition AI is the first AI agent capable of autonomously completing entire software engineering tasks end-to-end. Given a task description, Devin plans, writes code, runs tests, debugs failures, browses documentation, and iterates until done — in its own sandboxed development environment with a shell, browser, and code editor. It collaborates asynchronously, reporting progress via Slack or the web interface.",
    websiteUrl: "https://cognition.ai",
    logoUrl: "https://logo.clearbit.com/cognition.ai",
    categorySlug: "code-assistants",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Teams: $500/month for 250 ACUs (Agent Compute Units). Additional ACUs available. Enterprise: custom pricing.",
    launchedYear: 2024,
    roles: ["developer", "entrepreneur"],
    tags: ["autonomous-agent", "swe-agent", "sandboxed", "end-to-end", "slack"],
    accentColor: "#F59E0B",
    securityScore: 70,
    securityAnalysis:
      "Devin runs in isolated sandboxes and does not have access to your production systems by default. Credentials passed to Devin should be scoped to minimum necessary permissions. SOC 2 Type II in progress.",
    dataPrivacyNotes:
      "Task sessions and interactions are retained for debugging and model improvement. Enterprise plans include data isolation agreements.",
    complianceBadges: ["SOC2"],
  },
  {
    slug: "aider",
    name: "Aider",
    tagline: "AI pair programming in your terminal",
    description:
      "Aider is an open-source AI pair programming tool that runs in your terminal and edits code in your local git repository. You describe changes in natural language, and Aider applies them across multiple files, commits with meaningful messages, and runs tests — all while keeping you in full control. It works with all major LLMs (GPT-4o, Claude, Gemini, local models) and integrates naturally with your existing git workflow.",
    websiteUrl: "https://aider.chat",
    logoUrl: "https://logo.clearbit.com/aider.chat",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Free and open source (MIT). You pay only for the underlying LLM API tokens you use (e.g. OpenAI, Anthropic).",
    launchedYear: 2023,
    roles: ["developer"],
    tags: [
      "open-source",
      "terminal",
      "git-integration",
      "multi-model",
      "local",
    ],
    accentColor: "#10B981",
    securityScore: 90,
    securityAnalysis:
      "Aider is fully open source and runs locally. Your code is only sent to whichever LLM API you configure. Using local models (Ollama) means zero data leaves your machine. No vendor lock-in or proprietary data collection.",
    dataPrivacyNotes:
      "Code privacy depends entirely on your chosen LLM provider. With local models, nothing leaves your machine.",
    complianceBadges: [],
  },
  {
    slug: "continue",
    name: "Continue",
    tagline: "Open-source AI code assistant for any LLM",
    description:
      "Continue is an open-source VS Code and JetBrains extension that brings AI-assisted coding to any LLM you choose — cloud or local. It supports chat, autocomplete, inline edits, codebase indexing, and custom slash commands. Because it's model-agnostic, teams can switch between OpenAI, Anthropic, Mistral, Ollama, or their own fine-tuned models. Continue's hub lets organisations share prompt libraries and configurations.",
    websiteUrl: "https://continue.dev",
    logoUrl: "https://logo.clearbit.com/continue.dev",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Free and open source. Continue Hub (team features): $20/user/month.",
    launchedYear: 2023,
    roles: ["developer"],
    tags: [
      "open-source",
      "model-agnostic",
      "vs-code",
      "jetbrains",
      "local-llm",
    ],
    accentColor: "#3B82F6",
    securityScore: 88,
    securityAnalysis:
      "Continue is open source and self-hostable. With local models, no code leaves your machine. Cloud model usage follows the privacy policy of your chosen provider. No telemetry collected by default.",
    dataPrivacyNotes:
      "Privacy is fully controlled by the user's model choice. Local models ensure complete data sovereignty.",
    complianceBadges: [],
  },
  {
    slug: "supermaven",
    name: "Supermaven",
    tagline: "The fastest AI code completion",
    description:
      "Supermaven is an AI code completion tool built for speed, featuring a 1 million token context window that allows it to understand your entire codebase at once. It uses a custom Babble architecture trained specifically for code completion, delivering suggestions noticeably faster than GPT-4-based tools. Supermaven integrates as a VS Code extension and JetBrains plugin, and was acquired by Codeium in 2024.",
    websiteUrl: "https://supermaven.com",
    logoUrl: "https://logo.clearbit.com/supermaven.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails: "Free tier available. Pro: $10/month.",
    launchedYear: 2024,
    roles: ["developer"],
    tags: ["code-completion", "fast", "large-context", "vs-code", "jetbrains"],
    accentColor: "#6366F1",
    securityScore: 68,
    securityAnalysis:
      "Supermaven processes code on its own servers. Following the Codeium acquisition, it inherits Codeium's SOC 2 certified infrastructure. Privacy policy is actively being updated post-acquisition.",
    dataPrivacyNotes:
      "Code snippets used for context are sent to Supermaven servers. Pro users have reduced data retention.",
    complianceBadges: ["SOC2"],
  },
  {
    slug: "cline",
    name: "Cline",
    tagline: "Autonomous coding agent in VS Code",
    description:
      "Cline is an open-source autonomous coding agent that runs inside VS Code. It can create files, edit code, run terminal commands, and use a browser — asking your permission before each potentially impactful action. Cline is model-agnostic, supporting OpenAI, Anthropic, Google Gemini, Bedrock, and local models. It provides a detailed cost tracker so you always know what API spend a task will incur.",
    websiteUrl: "https://github.com/cline/cline",
    logoUrl: "https://logo.clearbit.com/github.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Free and open source. You pay only for the underlying LLM API tokens you use.",
    launchedYear: 2024,
    roles: ["developer"],
    tags: [
      "open-source",
      "autonomous-agent",
      "vs-code",
      "model-agnostic",
      "permission-based",
    ],
    accentColor: "#EF4444",
    securityScore: 85,
    securityAnalysis:
      "Cline requires explicit user approval before running shell commands or making file changes, minimising blast radius. Being open source, the code is fully auditable. Privacy depends on chosen LLM provider.",
    dataPrivacyNotes:
      "No data collected by Cline itself. All data flows directly to your chosen LLM API provider.",
    complianceBadges: [],
  },

  // ── Chat Assistants ────────────────────────────────────────────────────────
  {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline: "OpenAI's flagship conversational AI",
    description:
      "ChatGPT is the world's most widely used AI assistant, powered by GPT-4o and o1/o3 reasoning models. It supports text, images, files, voice, and video in its interface. Features include persistent memory, custom GPTs, a code interpreter (Python sandbox), web browsing, image generation via DALL-E 3, and an API. The Enterprise tier adds SSO, admin controls, expanded context windows, and a zero-data-retention policy.",
    websiteUrl: "https://chatgpt.com",
    logoUrl: "https://logo.clearbit.com/openai.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier (GPT-4o mini). Plus: $20/month (GPT-4o, o1). Pro: $200/month (o1 Pro, unlimited). Team: $25/user/month. Enterprise: custom.",
    launchedYear: 2022,
    roles: [
      "developer",
      "writer",
      "marketer",
      "researcher",
      "student",
      "entrepreneur",
      "product-manager",
    ],
    tags: ["gpt-4", "multimodal", "plugins", "memory", "code-interpreter"],
    accentColor: "#10A37F",
    securityScore: 80,
    securityAnalysis:
      "OpenAI has SOC 2 Type II certification. The Enterprise plan comes with zero data retention by default, SSO, and an admin dashboard. Free and Plus users' conversations may be used for training unless opted out.",
    dataPrivacyNotes:
      "Free/Plus: conversations used for model training unless disabled in settings. Team/Enterprise: zero-retention policy, no training on your data.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "claude",
    name: "Claude",
    tagline: "Anthropic's safe and capable AI assistant",
    description:
      "Claude is Anthropic's family of AI models — Haiku, Sonnet, and Opus — designed to be safe, helpful, and honest. Claude excels at nuanced reasoning, long-context document analysis (up to 200K tokens), coding, research synthesis, and following precise instructions. It supports a files API, tool use, and multi-turn conversations. Anthropic's Constitutional AI training approach aims to reduce harmful outputs. The API provides access to all model tiers.",
    websiteUrl: "https://claude.ai",
    logoUrl: "https://logo.clearbit.com/anthropic.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier (Claude Haiku/Sonnet with limits). Pro: $20/month. Team: $25/user/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: [
      "developer",
      "writer",
      "researcher",
      "marketer",
      "student",
      "product-manager",
    ],
    tags: [
      "constitutional-ai",
      "long-context",
      "reasoning",
      "safety-focused",
      "200k-context",
    ],
    accentColor: "#D97706",
    securityScore: 83,
    securityAnalysis:
      "Anthropic holds SOC 2 Type II certification and publishes a detailed privacy policy. Claude models are trained with Constitutional AI to reduce harmful outputs. Enterprise plans include zero-data retention and a Business Associate Agreement.",
    dataPrivacyNotes:
      "Free/Pro: conversations may inform model improvements. Team/Enterprise: zero-retention, no training on customer data.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },
  {
    slug: "gemini",
    name: "Gemini",
    tagline: "Google's multimodal AI assistant",
    description:
      "Gemini is Google's family of multimodal AI models (Nano, Flash, Pro, Ultra, and 2.0 Experimental) powering both the consumer Gemini app and Google Workspace AI features. It features a 1 million token context window, native image/audio/video understanding, Google Search grounding for real-time information, and deep integration with Google Docs, Gmail, and Meet. The Gemini API (via Google AI Studio and Vertex AI) enables enterprise deployment.",
    websiteUrl: "https://gemini.google.com",
    logoUrl: "https://logo.clearbit.com/google.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Gemini app: free (Gemini 2.0 Flash). Advanced: $19.99/month (Ultra model, 2TB storage). Google One AI Premium: bundled. Enterprise via Vertex AI: usage-based.",
    launchedYear: 2023,
    roles: [
      "developer",
      "writer",
      "researcher",
      "marketer",
      "student",
      "product-manager",
    ],
    tags: ["multimodal", "google-search", "1m-context", "vertex-ai", "grounding"],
    accentColor: "#4285F4",
    securityScore: 85,
    securityAnalysis:
      "Google AI products inherit Google's mature security infrastructure with ISO 27001, SOC 2/3, and GDPR compliance. Workspace AI adds admin controls and zero-retention options. Consumer Gemini data is used for product improvement by default.",
    dataPrivacyNotes:
      "Consumer app: conversations reviewed by human reviewers unless opted out. Workspace/Enterprise: admin controls, DPA available, no training on customer data.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "microsoft-copilot",
    name: "Microsoft Copilot",
    tagline: "AI assistant built into Microsoft 365",
    description:
      "Microsoft Copilot (formerly Bing Chat) is Microsoft's AI assistant powered by GPT-4 and DALL-E 3, available as a standalone app and deeply embedded in Microsoft 365 apps. In Word it drafts and edits documents; in Excel it analyses data and builds charts; in Teams it summarises meetings; in Outlook it drafts emails. It also features web search grounding, image generation, and voice interaction.",
    websiteUrl: "https://copilot.microsoft.com",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Copilot: free. Copilot Pro: $20/user/month (priority GPT-4 access, M365 integration). Microsoft 365 Copilot (enterprise): $30/user/month on top of M365 subscription.",
    launchedYear: 2023,
    roles: ["writer", "marketer", "product-manager", "entrepreneur", "student"],
    tags: ["microsoft-365", "office", "teams", "web-search", "enterprise"],
    accentColor: "#0078D4",
    securityScore: 84,
    securityAnalysis:
      "Microsoft Copilot inherits Microsoft's enterprise-grade security stack with ISO 27001, SOC 1/2, GDPR, and FedRAMP compliance. M365 Copilot is built on Microsoft's EU Data Boundary for European customers. Prompts and responses are not used to train OpenAI foundation models.",
    dataPrivacyNotes:
      "Consumer Copilot: interactions may improve Microsoft services. M365 Copilot (enterprise): zero training on tenant data, data stays in your Microsoft 365 compliance boundary.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },
  {
    slug: "perplexity",
    name: "Perplexity AI",
    tagline: "The AI-powered answer engine with citations",
    description:
      "Perplexity AI is a conversational search engine that answers questions with cited, real-time web sources. Unlike traditional chatbots, every answer includes inline citations so you can verify sources. It supports text, image, and file uploads, offers different focus modes (Web, Academic, YouTube, Reddit, Wolfram Alpha), and has a growing library of Pages — shareable research reports. The Pro plan unlocks advanced models and unlimited file analysis.",
    websiteUrl: "https://perplexity.ai",
    logoUrl: "https://logo.clearbit.com/perplexity.ai",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier (5 Pro searches/day). Pro: $20/month or $200/year (unlimited Pro searches, file uploads, API access).",
    launchedYear: 2022,
    roles: ["researcher", "student", "writer", "marketer", "product-manager"],
    tags: ["search", "citations", "real-time", "academic", "answer-engine"],
    accentColor: "#20B2AA",
    securityScore: 72,
    securityAnalysis:
      "Perplexity is SOC 2 Type II certified. Conversations are retained for 30 days by default. No on-premises option. Enterprise tier adds SSO and admin controls.",
    dataPrivacyNotes:
      "Conversations retained for 30 days by default, used to improve Perplexity's services. Pro users can request deletion. Enterprise: DPA available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "grok",
    name: "Grok",
    tagline: "xAI's real-time AI with a rebellious streak",
    description:
      "Grok is xAI's AI assistant with real-time access to X (Twitter) posts and the web, giving it uniquely up-to-date knowledge. It offers a 'fun mode' with fewer restrictions and a reasoning model (Grok-3 Think) for step-by-step problem solving. Available to X Premium+ subscribers and via xAI's standalone app, Grok supports code generation, image creation, and document analysis.",
    websiteUrl: "https://x.ai",
    logoUrl: "https://logo.clearbit.com/x.ai",
    categorySlug: "chat-assistants",
    hasFree: false,
    pricingModel: "freemium",
    pricingDetails:
      "Available with X Premium ($8/month) and X Premium+ ($16/month). xAI API: usage-based pricing.",
    launchedYear: 2023,
    roles: ["writer", "marketer", "researcher", "developer"],
    tags: ["x-twitter", "real-time", "reasoning", "image-generation", "xai"],
    accentColor: "#000000",
    securityScore: 65,
    securityAnalysis:
      "xAI is a newer company with a growing security posture. Detailed third-party audits and certifications are not yet widely published. Real-time X data access raises unique privacy considerations.",
    dataPrivacyNotes:
      "Conversations used to improve Grok. X posts used as training data. Limited opt-out controls available.",
    complianceBadges: [],
  },
  {
    slug: "mistral-le-chat",
    name: "Le Chat",
    tagline: "Mistral AI's fast and open conversational assistant",
    description:
      "Le Chat is Mistral AI's consumer chat product, offering access to Mistral's frontier models including Mistral Large, Mistral Small, and the Pixtral multimodal model. It features web search, file analysis, image generation (via Black Forest Labs Flux), and canvas-style document editing. Le Chat emphasises European data sovereignty, with servers in the EU. The underlying Mistral models are also available open-weight for self-hosting.",
    websiteUrl: "https://chat.mistral.ai",
    logoUrl: "https://logo.clearbit.com/mistral.ai",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier with standard models. Pro: €14.99/month (priority access, advanced models). API: usage-based.",
    launchedYear: 2024,
    roles: ["developer", "writer", "researcher", "marketer"],
    tags: ["european-ai", "open-weight", "gdpr-native", "multimodal", "fast"],
    accentColor: "#FF7000",
    securityScore: 78,
    securityAnalysis:
      "Mistral AI is headquartered in France and processes data within the EU, providing strong GDPR compliance by design. Mistral holds ISO 27001 certification. Open-weight models can be self-hosted for maximum data control.",
    dataPrivacyNotes:
      "Data processed in EU. Free tier conversations may be used for model improvement. API users: zero retention option available. Open-weight models: full data sovereignty when self-hosted.",
    complianceBadges: ["GDPR", "ISO27001"],
  },
  {
    slug: "meta-ai",
    name: "Meta AI",
    tagline: "Meta's free AI assistant powered by Llama",
    description:
      "Meta AI is Meta's free AI assistant powered by Llama 4 and available across WhatsApp, Instagram, Messenger, Facebook, and as a standalone app and website. It supports text, image generation (via Meta's own Emu model), real-time search, and a code interpreter. Llama models are open-weight and available for self-hosting, making the underlying technology fully auditable and deployable on private infrastructure.",
    websiteUrl: "https://meta.ai",
    logoUrl: "https://logo.clearbit.com/meta.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "free",
    pricingDetails:
      "Completely free via Meta apps and meta.ai. Llama models available for self-hosting at no software cost.",
    launchedYear: 2023,
    roles: ["student", "writer", "marketer", "entrepreneur"],
    tags: ["llama", "open-weight", "free", "whatsapp", "instagram", "social"],
    accentColor: "#1877F2",
    securityScore: 68,
    securityAnalysis:
      "Meta AI leverages Meta's security infrastructure but conversations are integrated into Meta's social advertising ecosystem. Llama models are open-weight and fully auditable. Self-hosted Llama deployments provide complete data control.",
    dataPrivacyNotes:
      "Conversations on Meta platforms may be used to improve Meta products and ad targeting. For privacy-sensitive use, self-hosting Llama is recommended.",
    complianceBadges: ["GDPR"],
  },

  // ── Image Generation ──────────────────────────────────────────────────────
  {
    slug: "midjourney",
    name: "Midjourney",
    tagline: "The world's most popular AI image generator",
    description:
      "Midjourney is a generative AI art platform known for producing exceptionally aesthetic, painterly images from text prompts. Operated via Discord and its own web interface, it offers fine-grained style control through parameters like aspect ratio, stylisation, chaos, and weirdness. Version 6 brought photorealism; version 6.1 improved coherence and text rendering. Niji mode specialises in anime and illustrated styles. Images are widely used in commercial creative work.",
    websiteUrl: "https://midjourney.com",
    logoUrl: "https://logo.clearbit.com/midjourney.com",
    categorySlug: "image-generation",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Basic: $10/month (200 images). Standard: $30/month (15h fast GPU). Pro: $60/month (30h fast GPU, stealth mode). Mega: $120/month.",
    launchedYear: 2022,
    roles: ["designer", "marketer", "video-creator", "entrepreneur"],
    tags: [
      "text-to-image",
      "aesthetic",
      "discord",
      "photorealism",
      "anime",
      "commercial",
    ],
    accentColor: "#000000",
    securityScore: 60,
    securityAnalysis:
      "Midjourney's primary interface (Discord) raises security considerations as prompts are visible in shared channels unless using DMs. The web interface is more private. Content moderation is active but not exhaustive.",
    dataPrivacyNotes:
      "Images generated are public by default on lower tiers. Pro/Mega plans include Stealth Mode for private generations. All prompts and outputs may be used to train Midjourney's models.",
    complianceBadges: [],
  },
  {
    slug: "dalle3",
    name: "DALL-E 3",
    tagline: "OpenAI's photorealistic text-to-image model",
    description:
      "DALL-E 3 is OpenAI's most advanced image generation model, accessible via ChatGPT and the OpenAI API. It greatly improved prompt adherence compared to DALL-E 2, faithfully rendering complex scenes, accurate text, and fine details. Integrated directly into ChatGPT, users can refine images with conversational follow-up prompts. The API enables programmatic access with automatic content policy enforcement.",
    websiteUrl: "https://openai.com/dall-e-3",
    logoUrl: "https://logo.clearbit.com/openai.com",
    categorySlug: "image-generation",
    hasFree: false,
    pricingModel: "freemium",
    pricingDetails:
      "Available via ChatGPT Plus ($20/month). API: $0.04–$0.12 per image depending on quality and resolution.",
    launchedYear: 2023,
    roles: ["designer", "marketer", "writer", "entrepreneur"],
    tags: [
      "text-to-image",
      "openai",
      "prompt-adherence",
      "chatgpt-integration",
      "api",
    ],
    accentColor: "#10A37F",
    securityScore: 78,
    securityAnalysis:
      "DALL-E 3 inherits OpenAI's SOC 2 security controls. Automatic content policy filtering rejects harmful prompts. Images include C2PA metadata for provenance. API usage subject to OpenAI's usage policies.",
    dataPrivacyNotes:
      "Images generated via ChatGPT subject to ChatGPT privacy policy. API images not used for training by default.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "stable-diffusion",
    name: "Stable Diffusion",
    tagline: "The foundational open-source image generation model",
    description:
      "Stable Diffusion is Stability AI's open-source latent diffusion model that democratised AI image generation. Available as a free model download, it can run on consumer hardware (GPU with 4GB VRAM). Its open-weight nature has spawned a vast ecosystem — ComfyUI, Automatic1111, InvokeAI, and thousands of community fine-tunes (LoRAs, textual inversions). SD 1.5, SDXL, and SD3 are the major version lines. Used in commercial products, games, and research.",
    websiteUrl: "https://stability.ai",
    logoUrl: "https://logo.clearbit.com/stability.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Model weights: free. DreamStudio (Stability AI's cloud interface): credits-based, from $10. Commercial licence requires Stability AI membership from $20/month.",
    launchedYear: 2022,
    roles: ["designer", "developer", "video-creator"],
    tags: [
      "open-source",
      "local",
      "fine-tuning",
      "comfyui",
      "lora",
      "community",
    ],
    accentColor: "#8B5CF6",
    securityScore: 92,
    securityAnalysis:
      "When run locally, Stable Diffusion provides complete data sovereignty — no internet connection required, no data transmitted. The open-weight nature allows full code auditing. Cloud deployments (DreamStudio) are subject to Stability AI's privacy policy.",
    dataPrivacyNotes:
      "Local deployment: maximum privacy, no data leaves your machine. Cloud/API: prompts and images may be retained per Stability AI policy.",
    complianceBadges: [],
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    tagline: "Commercially safe AI image generation for creatives",
    description:
      "Adobe Firefly is Adobe's family of generative AI models trained exclusively on licensed content from Adobe Stock, openly licensed images, and public domain works — making it commercially safe for professional use. Available in Photoshop, Illustrator, Express, and standalone, it offers text-to-image, generative fill, generative expand, text effects, and vector re-colouring. Adobe provides IP indemnity to enterprise customers using Firefly.",
    websiteUrl: "https://firefly.adobe.com",
    logoUrl: "https://logo.clearbit.com/adobe.com",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier (25 Firefly credits/month). Creative Cloud plans from $54.99/month include generous Firefly credits. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["designer", "marketer", "video-creator"],
    tags: [
      "commercially-safe",
      "ip-indemnity",
      "photoshop",
      "illustrator",
      "generative-fill",
    ],
    accentColor: "#FF0000",
    securityScore: 82,
    securityAnalysis:
      "Adobe Firefly meets Adobe's enterprise security standards with SOC 2 Type II, ISO 27001, and GDPR compliance. Enterprise customers receive IP indemnification. Firefly models are trained only on licensed content.",
    dataPrivacyNotes:
      "Adobe does not train Firefly on user content without permission. Enterprise: data processing agreement available, content protected from training use.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    tagline: "AI image generation with industry-leading text rendering",
    description:
      "Ideogram is an AI image generation platform that excels at rendering coherent, accurate text within images — a historically difficult task for diffusion models. It supports photorealistic and illustrated styles, offers magic prompt enhancement, and features an editing canvas. Ideogram 2.0 introduced poster-quality typography and improved composition. API access enables commercial product integrations.",
    websiteUrl: "https://ideogram.ai",
    logoUrl: "https://logo.clearbit.com/ideogram.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier (10 slow generations/day). Basic: $7/month. Plus: $16/month. Pro: $48/month.",
    launchedYear: 2023,
    roles: ["designer", "marketer"],
    tags: [
      "text-rendering",
      "typography",
      "poster-design",
      "photorealism",
      "api",
    ],
    accentColor: "#FF6B35",
    securityScore: 65,
    securityAnalysis:
      "Ideogram is a newer company without published security certifications. Prompts and outputs are processed on Ideogram's servers. No on-premises option.",
    dataPrivacyNotes:
      "All generations are public by default on lower plans. Private mode available on paid plans. Prompts and images may be used to improve models.",
    complianceBadges: [],
  },
  {
    slug: "leonardo-ai",
    name: "Leonardo.ai",
    tagline: "AI image generation platform for game assets and creative work",
    description:
      "Leonardo.ai is a generative AI platform built for creative professionals and game developers. It offers text-to-image, image-to-image, and 3D texture generation with fine-tuned models for specific styles (DreamShaper, Alchemy, PhotoReal). Its ControlNet integration enables pose and structure transfer. Leonardo's training feature lets users fine-tune custom models on their own assets. A comprehensive API supports production workflows.",
    websiteUrl: "https://leonardo.ai",
    logoUrl: "https://logo.clearbit.com/leonardo.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 150 tokens/day. Apprentice: $10/month. Artisan: $24/month. Maestro: $48/month.",
    launchedYear: 2022,
    roles: ["designer", "video-creator", "developer"],
    tags: [
      "game-assets",
      "fine-tuning",
      "controlnet",
      "3d-texture",
      "api",
      "custom-models",
    ],
    accentColor: "#F59E0B",
    securityScore: 67,
    securityAnalysis:
      "Leonardo.ai has published a security page with basic practices but lacks publicly verified SOC 2 certification. API integrations should use restricted keys.",
    dataPrivacyNotes:
      "Generations are private by default on paid plans. Free tier outputs are public. Custom training data and generated assets stored on Leonardo servers.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "flux",
    name: "Flux",
    tagline: "Black Forest Labs' state-of-the-art open image model",
    description:
      "Flux is a family of open-weight image generation models from Black Forest Labs (founded by the core Stable Diffusion team). Flux.1 models (Schnell, Dev, Pro) set new benchmarks in prompt adherence, realism, and diversity representation. Schnell is Apache 2.0 licensed for commercial use; Dev is for non-commercial research; Pro is API-only. Widely integrated into ComfyUI, Fal.ai, Replicate, and other platforms.",
    websiteUrl: "https://blackforestlabs.ai",
    logoUrl: "https://logo.clearbit.com/blackforestlabs.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Flux.1 Schnell: free Apache 2.0 licence. Flux.1 Dev: free for non-commercial. Flux.1 Pro: API via fal.ai/Replicate, ~$0.05/image.",
    launchedYear: 2024,
    roles: ["designer", "developer", "researcher"],
    tags: [
      "open-weight",
      "apache2",
      "comfyui",
      "state-of-the-art",
      "photorealism",
    ],
    accentColor: "#1A1A1A",
    securityScore: 88,
    securityAnalysis:
      "Flux Schnell running locally provides complete data sovereignty. Open-weight models are fully auditable. Cloud inference via third-party platforms (fal.ai, Replicate) subject to their respective privacy policies.",
    dataPrivacyNotes:
      "Local deployment: no data transmitted. Cloud APIs: subject to provider policies. Apache 2.0 licence for Schnell enables private commercial deployment.",
    complianceBadges: [],
  },

  // ── Video Generation ──────────────────────────────────────────────────────
  {
    slug: "runway",
    name: "Runway",
    tagline: "Professional AI video generation and editing",
    description:
      "Runway is a pioneering AI video platform used by professional filmmakers and creatives. Its Gen-3 Alpha model generates high-quality video from text and images. Runway also offers AI Magic Tools including background removal, rotoscoping, motion tracking, inpainting, and frame interpolation — all browser-based. It was used in the production of films and award-winning music videos. The platform targets professional post-production workflows.",
    websiteUrl: "https://runwayml.com",
    logoUrl: "https://logo.clearbit.com/runwayml.com",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 125 credits/month. Standard: $15/month. Pro: $35/month. Unlimited: $95/month. Enterprise: custom.",
    launchedYear: 2018,
    roles: ["video-creator", "designer", "marketer"],
    tags: [
      "text-to-video",
      "video-editing",
      "professional",
      "gen-3",
      "film",
      "post-production",
    ],
    accentColor: "#EC4899",
    securityScore: 72,
    securityAnalysis:
      "Runway is SOC 2 Type II certified. Enterprise plan includes custom data handling agreements. Generated content and input media may be used to improve models on lower plans.",
    dataPrivacyNotes:
      "Free/Standard: uploaded media and outputs may improve models. Pro+: no training on your content. Enterprise: custom data agreements.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "sora",
    name: "Sora",
    tagline: "OpenAI's breakthrough text-to-video model",
    description:
      "Sora is OpenAI's text-to-video generation model capable of creating realistic, minute-long videos with complex camera movements, accurate physics simulation, and consistent characters. It understands spatial and temporal relationships in video, enabling smooth scene transitions and character continuity. Available via ChatGPT Pro and Plus, Sora Turbo offers fast generation for shorter clips while the full model targets cinematic quality.",
    websiteUrl: "https://openai.com/sora",
    logoUrl: "https://logo.clearbit.com/openai.com",
    categorySlug: "video-generation",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "ChatGPT Plus: $20/month (Sora Turbo, 50 priority videos/month). ChatGPT Pro: $200/month (unlimited Sora). API: enterprise pricing.",
    launchedYear: 2024,
    roles: ["video-creator", "marketer", "designer"],
    tags: [
      "text-to-video",
      "openai",
      "physics-simulation",
      "cinematic",
      "long-form-video",
    ],
    accentColor: "#10A37F",
    securityScore: 78,
    securityAnalysis:
      "Sora inherits OpenAI's SOC 2 security framework. Generated videos include C2PA metadata for provenance. Content policy enforcement is applied to prevent harmful generations.",
    dataPrivacyNotes:
      "Videos generated via ChatGPT subject to OpenAI's privacy policy. Prompts and videos may be used for model improvement unless under Enterprise plan.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "pika",
    name: "Pika",
    tagline: "AI video generation from text and images",
    description:
      "Pika is a generative AI video platform that creates and edits videos from text prompts and images. Pika 2.0 introduced Pikaffects — physics-based effects like crushing, melting, and inflating applied to any subject. It supports aspect ratio control, motion intensity settings, and a lip-sync feature for avatar videos. Pika emphasises ease of use, making AI video accessible to creators without technical backgrounds.",
    websiteUrl: "https://pika.art",
    logoUrl: "https://logo.clearbit.com/pika.art",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 150 credits/month. Basic: $8/month. Standard: $28/month. Pro: $58/month. Unlimited: $98/month.",
    launchedYear: 2023,
    roles: ["video-creator", "marketer", "designer"],
    tags: ["text-to-video", "image-to-video", "effects", "lip-sync", "easy-use"],
    accentColor: "#7C3AED",
    securityScore: 62,
    securityAnalysis:
      "Pika is a Y Combinator-backed startup with a growing security posture. No published SOC 2 certification yet. Uploaded content may be used to train models.",
    dataPrivacyNotes:
      "Uploaded images and videos may be used for model training. Generated content stored on Pika's servers.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "heygen",
    name: "HeyGen",
    tagline: "AI avatar video generation at scale",
    description:
      "HeyGen is an AI video generation platform specialising in talking avatar videos. Users create a digital avatar from a short video clip and then generate videos by typing a script — no camera or studio required. HeyGen supports 40+ languages with lip-sync, voice cloning, video translation (translate any video with lip-synced dubbing), and a streaming avatar API for live interactive avatars. Widely used for sales, training, and localisation.",
    websiteUrl: "https://heygen.com",
    logoUrl: "https://logo.clearbit.com/heygen.com",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 1 video/month. Creator: $29/month. Team: $89/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["marketer", "video-creator", "entrepreneur"],
    tags: [
      "avatar-video",
      "lip-sync",
      "voice-cloning",
      "video-translation",
      "sales",
      "training",
    ],
    accentColor: "#2563EB",
    securityScore: 70,
    securityAnalysis:
      "HeyGen stores avatar and voice models securely and claims SOC 2 compliance. Biometric data (face/voice) used for avatar creation is subject to heightened privacy considerations.",
    dataPrivacyNotes:
      "Avatar images and voice samples are retained to power your avatar. Review data deletion options for biometric data. Enterprise: custom data agreements.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    tagline: "AI video production with photorealistic digital avatars",
    description:
      "Synthesia is an enterprise AI video platform that creates professional training, marketing, and internal communication videos using photorealistic AI avatars. Users type a script, select an avatar and voice, and generate a polished video — no filming or editing required. Synthesia supports 140+ languages, custom avatars, brand kits, and integrations with LMS platforms. It's widely used by L&D teams at Fortune 500 companies.",
    websiteUrl: "https://synthesia.io",
    logoUrl: "https://logo.clearbit.com/synthesia.io",
    categorySlug: "video-generation",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Starter: $22/month. Creator: $67/month. Enterprise: custom. All plans include a set number of video minutes/month.",
    launchedYear: 2017,
    roles: ["marketer", "video-creator", "product-manager", "entrepreneur"],
    tags: [
      "avatar-video",
      "enterprise",
      "training-videos",
      "140-languages",
      "lms",
      "no-camera",
    ],
    accentColor: "#6D28D9",
    securityScore: 80,
    securityAnalysis:
      "Synthesia holds ISO 27001 and SOC 2 Type II certification. Enterprise plan includes a GDPR-compliant DPA, SSO, and admin controls. Avatar biometric data is handled under strict consent frameworks.",
    dataPrivacyNotes:
      "Custom avatar data stored securely and not shared or used to train models. Enterprise: full data processing agreement with geographic data residency options.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "descript",
    name: "Descript",
    tagline: "Edit video and audio by editing text",
    description:
      "Descript is an AI-powered audio and video editor with a revolutionary text-based editing workflow — you edit the transcript and the media edits itself. Features include automatic transcription, filler word removal, Studio Sound (AI audio cleanup), Overdub (voice cloning for corrections), green screen, screen recording, and Underlord AI (automated editing suggestions). Used by podcasters, video creators, and marketing teams.",
    websiteUrl: "https://descript.com",
    logoUrl: "https://logo.clearbit.com/descript.com",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 1 hour transcription/month. Creator: $24/month. Business: $40/month. Enterprise: custom.",
    launchedYear: 2017,
    roles: ["video-creator", "marketer", "writer"],
    tags: [
      "text-based-editing",
      "transcription",
      "podcast",
      "voice-cloning",
      "studio-sound",
    ],
    accentColor: "#7C3AED",
    securityScore: 74,
    securityAnalysis:
      "Descript has SOC 2 Type II certification. Voice data used for Overdub is stored securely and linked to the account. Enterprise includes a DPA.",
    dataPrivacyNotes:
      "Voice models created via Overdub are tied to your account and not shared. Media files stored on Descript's servers. Enterprise: custom retention and DPA.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Audio & Music ─────────────────────────────────────────────────────────
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    tagline: "The most realistic AI voice synthesis platform",
    description:
      "ElevenLabs produces the most natural-sounding AI voice synthesis available, with models that capture nuance, emotion, pacing, and accent. Features include voice cloning (from a 1-minute sample), a 32-language voice library, text-to-speech, speech-to-speech conversion, audiobook production, dubbing, and a real-time conversational AI voice API. Used by publishers, content creators, game developers, and enterprises for IVR and customer service.",
    websiteUrl: "https://elevenlabs.io",
    logoUrl: "https://logo.clearbit.com/elevenlabs.io",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 10,000 characters/month. Starter: $5/month. Creator: $22/month. Pro: $99/month. Scale: $330/month. Enterprise: custom.",
    launchedYear: 2022,
    roles: ["video-creator", "marketer", "writer", "developer"],
    tags: [
      "voice-synthesis",
      "voice-cloning",
      "text-to-speech",
      "dubbing",
      "conversational-ai",
      "32-languages",
    ],
    accentColor: "#F59E0B",
    securityScore: 74,
    securityAnalysis:
      "ElevenLabs is SOC 2 Type II certified. Voice clone data is isolated per account. The platform has anti-abuse measures to prevent non-consensual voice cloning. Enterprise includes a DPA.",
    dataPrivacyNotes:
      "Voice samples used for cloning are stored and processed on ElevenLabs servers. Enterprise customers get data isolation and custom retention policies.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "suno",
    name: "Suno",
    tagline: "Create full songs from a text prompt in seconds",
    description:
      "Suno is an AI music generation platform that creates complete songs — vocals, instruments, and lyrics — from a short text description. Suno v4 produces radio-quality audio with genre, mood, and style control. Users can extend songs, create instrumentals, provide custom lyrics, or remix existing tracks. Songs can be exported as MP3 or shared publicly. Used by musicians for inspiration and non-musicians wanting to create music without instruments.",
    websiteUrl: "https://suno.com",
    logoUrl: "https://logo.clearbit.com/suno.com",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 50 credits/day (10 songs). Pro: $8/month. Premier: $24/month. (Paid plans allow commercial use.)",
    launchedYear: 2023,
    roles: ["video-creator", "marketer", "writer", "student"],
    tags: [
      "music-generation",
      "text-to-music",
      "full-songs",
      "vocals",
      "commercial-licence",
    ],
    accentColor: "#8B5CF6",
    securityScore: 60,
    securityAnalysis:
      "Suno is a newer company without published SOC 2 certification. Generated music and prompts may be used for training. Legal landscape around training data sources is actively contested.",
    dataPrivacyNotes:
      "Free tier generations are public. Paid plans allow private creation and commercial use. Suno is involved in ongoing music industry litigation regarding training data.",
    complianceBadges: [],
  },
  {
    slug: "udio",
    name: "Udio",
    tagline: "High-fidelity AI music creation",
    description:
      "Udio is an AI music generation platform focused on high audio fidelity and expressive control. It creates original songs with vocals and instrumentation from text prompts, with fine-grained controls for genre, instrumentation, tempo, and mood. Udio features a unique stem remixing capability, custom lyrics input, and a community feed for sharing creations. It targets music producers and creative professionals seeking fine-grained control.",
    websiteUrl: "https://udio.com",
    logoUrl: "https://logo.clearbit.com/udio.com",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100 credits/month. Standard: $10/month. Pro: $30/month.",
    launchedYear: 2024,
    roles: ["video-creator", "designer"],
    tags: [
      "music-generation",
      "high-fidelity",
      "stem-remixing",
      "custom-lyrics",
      "producer",
    ],
    accentColor: "#EC4899",
    securityScore: 58,
    securityAnalysis:
      "Udio is a new startup with limited published security documentation. The platform is involved in music industry litigation alongside Suno regarding training data copyright.",
    dataPrivacyNotes:
      "Generated music may be used for model improvement. Commercial licensing available on paid plans. Training data copyright questions remain legally unresolved.",
    complianceBadges: [],
  },
  {
    slug: "murf-ai",
    name: "Murf AI",
    tagline: "Professional AI voiceover for any content",
    description:
      "Murf AI is a text-to-speech platform built for professional voiceover production. It offers 120+ AI voices in 20+ languages with pitch, speed, emphasis, and pause controls. Murf Studio allows adding the voiceover directly to video, images, and music within the platform. Voice cloning is available on higher plans. Used extensively for e-learning, product demos, explainer videos, and podcast production.",
    websiteUrl: "https://murf.ai",
    logoUrl: "https://logo.clearbit.com/murf.ai",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 10 minutes/month. Creator: $29/month. Business: $99/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["marketer", "video-creator", "writer"],
    tags: [
      "text-to-speech",
      "voiceover",
      "e-learning",
      "120-voices",
      "video-studio",
    ],
    accentColor: "#6366F1",
    securityScore: 68,
    securityAnalysis:
      "Murf AI claims SOC 2 compliance. Enterprise plan includes SSO and audit logs. Voice data for cloning stored per account.",
    dataPrivacyNotes:
      "Voiceover data and outputs stored on Murf's servers. Voice clone data isolated per account. Enterprise includes DPA.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "aiva",
    name: "AIVA",
    tagline: "AI music composition for film, games, and content",
    description:
      "AIVA (Artificial Intelligence Virtual Artist) is an AI music composition engine specifically designed for creating cinematic soundtracks, game music, and background scores. It's trained on a large corpus of classical compositions and can generate music in over 250 styles. Users can direct the emotional arc, instrumentation, tempo, and structure. AIVA's compositions are used by game studios, film producers, and YouTubers needing royalty-free music.",
    websiteUrl: "https://aiva.ai",
    logoUrl: "https://logo.clearbit.com/aiva.ai",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 3 downloads/month (non-commercial). Standard: €11/month. Pro: €33/month (commercial rights).",
    launchedYear: 2016,
    roles: ["video-creator", "designer"],
    tags: [
      "music-composition",
      "cinematic",
      "game-music",
      "soundtrack",
      "royalty-free",
      "classical",
    ],
    accentColor: "#1E40AF",
    securityScore: 65,
    securityAnalysis:
      "AIVA is a Luxembourg-based company with GDPR compliance by design. Limited published third-party security certifications. Suitable for smaller-scale use.",
    dataPrivacyNotes:
      "Compositions and account data stored on AIVA's EU servers. GDPR data subject rights supported.",
    complianceBadges: ["GDPR"],
  },

  // ── Writing Tools ─────────────────────────────────────────────────────────
  {
    slug: "jasper",
    name: "Jasper AI",
    tagline: "Enterprise AI content platform for marketing teams",
    description:
      "Jasper is an enterprise-grade AI content platform built for marketing teams. It offers a brand voice system that learns your tone, style, and messaging, ensuring all AI-generated content stays on-brand. Features include long-form content creation, campaign ideation, ad copy generation, a Jasper Art image generator, browser extension, integrations with Surfer SEO, and a multi-model approach (GPT-4, Claude, Gemini). The Team plan adds collaboration and approval workflows.",
    websiteUrl: "https://jasper.ai",
    logoUrl: "https://logo.clearbit.com/jasper.ai",
    categorySlug: "writing-tools",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Creator: $49/month. Pro: $69/month. Business: custom. All plans billed annually.",
    launchedYear: 2021,
    roles: ["marketer", "writer", "entrepreneur"],
    tags: ["marketing", "brand-voice", "enterprise", "seo", "long-form"],
    accentColor: "#F59E0B",
    securityScore: 78,
    securityAnalysis:
      "Jasper is SOC 2 Type II certified. Enterprise plan includes SSO, admin controls, and a DPA. Content processed via leading model providers subject to their security policies.",
    dataPrivacyNotes:
      "Business plan: zero data retention from model providers. Customer content not used to train Jasper's models.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    tagline: "AI-powered GTM platform for go-to-market teams",
    description:
      "Copy.ai has evolved from a simple copy generator to a full Go-To-Market AI platform for sales and marketing teams. Its Workflow feature automates multi-step research and content generation pipelines. It covers prospect research, personalised outreach, blog posts, ad copy, product descriptions, and social content. The platform integrates with HubSpot, Salesforce, and Zapier, and offers a pipeline automation engine called GTM AI.",
    websiteUrl: "https://copy.ai",
    logoUrl: "https://logo.clearbit.com/copy.ai",
    categorySlug: "writing-tools",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 2,000 words/month. Starter: $49/month. Advanced: $249/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["marketer", "writer", "entrepreneur"],
    tags: ["gtm", "sales", "outreach", "automation", "hubspot", "salesforce"],
    accentColor: "#8B5CF6",
    securityScore: 72,
    securityAnalysis:
      "Copy.ai holds SOC 2 Type II certification. Enterprise plan includes SSO and data processing agreements.",
    dataPrivacyNotes:
      "Content generated through Copy.ai may be used to improve models unless on enterprise plan with DPA.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "grammarly",
    name: "Grammarly",
    tagline: "AI writing assistant for correctness, clarity, and tone",
    description:
      "Grammarly is the leading AI writing assistant with over 30 million daily active users. It checks grammar, spelling, punctuation, style, and tone in real time across browsers, Google Docs, Microsoft Office, and desktop apps. GrammarlyGO adds generative AI for drafting, rewriting, and responding. Grammarly Business adds brand tone guidelines, team style guides, and analytics. It integrates with 500,000+ apps and websites.",
    websiteUrl: "https://grammarly.com",
    logoUrl: "https://logo.clearbit.com/grammarly.com",
    categorySlug: "writing-tools",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier. Premium: $12/month. Business: $15/user/month. Enterprise: custom.",
    launchedYear: 2009,
    roles: ["writer", "marketer", "student", "researcher", "product-manager"],
    tags: [
      "grammar",
      "writing-assistant",
      "browser-extension",
      "tone",
      "business-writing",
    ],
    accentColor: "#15A350",
    securityScore: 80,
    securityAnalysis:
      "Grammarly is SOC 2 Type II certified and GDPR compliant. Business plan includes admin controls and DPA. Text is encrypted in transit and at rest. Grammarly processes text to provide corrections but publishes a strict data use policy.",
    dataPrivacyNotes:
      "Text you write is processed on Grammarly's servers for analysis. May be retained to improve AI models. Business: DPA available, data used only for your account.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    tagline: "AI assistant built natively into your Notion workspace",
    description:
      "Notion AI adds generative and analytical AI capabilities directly into Notion's workspace. Users can ask AI to draft, summarise, translate, and improve any page or database, answer questions about their workspace content, and generate action items from meeting notes. Notion AI uses a mix of models including GPT-4 and Claude. It's tightly integrated with Notion's blocks, databases, and collaboration features.",
    websiteUrl: "https://notion.so/product/ai",
    logoUrl: "https://logo.clearbit.com/notion.so",
    categorySlug: "writing-tools",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Notion AI add-on: $10/member/month on top of any Notion plan (Plus: $8/month, Business: $15/month, Enterprise: custom).",
    launchedYear: 2023,
    roles: [
      "writer",
      "product-manager",
      "marketer",
      "researcher",
      "entrepreneur",
    ],
    tags: [
      "productivity",
      "notes",
      "workspace",
      "summarisation",
      "knowledge-management",
    ],
    accentColor: "#000000",
    securityScore: 78,
    securityAnalysis:
      "Notion is SOC 2 Type II certified with ISO 27001. AI queries are sent to third-party model providers. Enterprise includes SSO, audit logs, and custom AI data handling agreements.",
    dataPrivacyNotes:
      "Workspace content queried by AI may be sent to model providers (OpenAI, Anthropic). Enterprise: DPA available, content not used to train models.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "writesonic",
    name: "Writesonic",
    tagline: "AI writing and SEO content platform",
    description:
      "Writesonic is an AI content platform built for SEO-optimised blog posts, landing pages, and marketing copy. Its Chatsonic chatbot integrates Google Search for real-time information. Botsonic allows building custom AI chatbots trained on your data. Key features include a long-form article writer, AI SEO tools, bulk content generation, and a brand voice customisation system. Used by content marketers, SEO teams, and agencies.",
    websiteUrl: "https://writesonic.com",
    logoUrl: "https://logo.clearbit.com/writesonic.com",
    categorySlug: "writing-tools",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 10,000 words/month. Individual: $16/month. Teams: $39/user/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["marketer", "writer"],
    tags: ["seo", "blog", "chatbot", "content-marketing", "bulk-generation"],
    accentColor: "#FF5F6D",
    securityScore: 65,
    securityAnalysis:
      "Writesonic claims SOC 2 compliance but limited third-party verification is published. Enterprise plan includes DPA.",
    dataPrivacyNotes:
      "Content may be used to improve Writesonic models. Enterprise: DPA available with custom data handling.",
    complianceBadges: ["GDPR"],
  },

  // ── Research ──────────────────────────────────────────────────────────────
  {
    slug: "elicit",
    name: "Elicit",
    tagline: "AI research assistant for systematic literature review",
    description:
      "Elicit is an AI research assistant that automates time-consuming parts of systematic literature review. It searches across 200+ million research papers, extracts specific data points from PDFs, synthesises findings across papers, and generates structured evidence tables. Elicit is designed for scientific rigour — it cites specific papers for every claim and shows its reasoning. Used extensively by medical researchers, policy analysts, and PhD students.",
    websiteUrl: "https://elicit.com",
    logoUrl: "https://logo.clearbit.com/elicit.com",
    categorySlug: "research",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: basic search, 5 full-text analyses/month. Plus: $10/month. Enterprise: custom.",
    launchedYear: 2021,
    roles: ["researcher", "student", "data-scientist"],
    tags: [
      "literature-review",
      "academic",
      "evidence-synthesis",
      "systematic-review",
      "pdf-analysis",
    ],
    accentColor: "#7C3AED",
    securityScore: 75,
    securityAnalysis:
      "Elicit uses industry-standard security practices. Research queries and uploaded PDFs are processed on their servers. Suitable for non-sensitive research data.",
    dataPrivacyNotes:
      "Uploaded papers and queries retained to improve Elicit. Sensitive research data should be reviewed carefully before uploading.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "consensus",
    name: "Consensus",
    tagline: "Search the scientific literature with AI",
    description:
      "Consensus is an AI-powered search engine for scientific research. It searches across 200 million research papers and uses GPT-4 to synthesise consensus findings on a research question. The Consensus Meter shows what percentage of studies found positive/negative/mixed results. Features include Copilot for detailed AI summaries, study snapshots, and journal/citation filters. Ideal for medical questions, public health research, and evidence-based decision making.",
    websiteUrl: "https://consensus.app",
    logoUrl: "https://logo.clearbit.com/consensus.app",
    categorySlug: "research",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 20 searches/month. Premium: $11.99/month. Teams: custom.",
    launchedYear: 2022,
    roles: ["researcher", "student", "product-manager"],
    tags: [
      "scientific-search",
      "evidence-synthesis",
      "medical-research",
      "consensus-meter",
    ],
    accentColor: "#2563EB",
    securityScore: 70,
    securityAnalysis:
      "Consensus uses standard security practices. Search queries processed on their servers using GPT-4. No sensitive data handling features advertised.",
    dataPrivacyNotes:
      "Search queries may be used to improve the Consensus product. No personalised data storage beyond account preferences.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "semantic-scholar",
    name: "Semantic Scholar",
    tagline: "Free AI-powered research tool for 200M+ papers",
    description:
      "Semantic Scholar is a free AI-powered research tool developed by the Allen Institute for AI (AI2). It indexes 200+ million academic papers across all fields and uses AI to extract key findings, identify influential citations, provide paper summaries via TLDR, surface related work, and display citation velocity trends. The free API allows building research applications. Used by academics, researchers, and the AI research community.",
    websiteUrl: "https://semanticscholar.org",
    logoUrl: "https://logo.clearbit.com/semanticscholar.org",
    categorySlug: "research",
    hasFree: true,
    pricingModel: "free",
    pricingDetails:
      "Completely free. The Semantic Scholar API is free for non-commercial research use.",
    launchedYear: 2015,
    roles: ["researcher", "student", "data-scientist"],
    tags: ["academic", "citation-analysis", "tldr", "free", "api", "ai2"],
    accentColor: "#1D4ED8",
    securityScore: 80,
    securityAnalysis:
      "Operated by Allen Institute for AI (AI2), a nonprofit research institute. Academic mission with no advertising. Standard security practices for a research institution.",
    dataPrivacyNotes:
      "Minimal personal data collected. Search queries may be used to improve the tool. No commercial data use.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "scite-ai",
    name: "Scite.ai",
    tagline: "Smart citations for research paper discovery",
    description:
      "Scite.ai is an AI-powered research tool that shows how research papers have been cited — specifically distinguishing between supporting, contrasting, and mentioning citations. This allows researchers to see not just how many times a paper is cited, but whether subsequent research supported or contradicted its findings. Features include a reference check tool, an AI assistant for literature review, and a journal-level analysis dashboard.",
    websiteUrl: "https://scite.ai",
    logoUrl: "https://logo.clearbit.com/scite.ai",
    categorySlug: "research",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: basic access. Individual: $20/month. Team: custom. University licences available.",
    launchedYear: 2018,
    roles: ["researcher", "student"],
    tags: ["citation-analysis", "supporting-contrasting", "literature-review"],
    accentColor: "#0EA5E9",
    securityScore: 70,
    securityAnalysis:
      "Scite.ai uses standard security practices appropriate for an academic tool. University licence agreements include institutional data handling terms.",
    dataPrivacyNotes:
      "Minimal personal data beyond account credentials. Research queries processed on Scite's servers.",
    complianceBadges: ["GDPR"],
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    slug: "otter-ai",
    name: "Otter.ai",
    tagline: "AI meeting transcription and real-time notes",
    description:
      "Otter.ai provides real-time AI transcription for meetings, lectures, and interviews. It integrates with Zoom, Google Meet, and Teams to automatically join and transcribe meetings. Features include speaker identification, highlight extraction, action item detection, AI meeting summary, and a searchable meeting archive. OtterPilot joins meetings automatically, while the Otter Chat feature lets you ask questions about past meetings.",
    websiteUrl: "https://otter.ai",
    logoUrl: "https://logo.clearbit.com/otter.ai",
    categorySlug: "productivity",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 300 minutes/month. Pro: $16.99/month. Business: $30/user/month. Enterprise: custom.",
    launchedYear: 2016,
    roles: ["product-manager", "researcher", "entrepreneur", "marketer"],
    tags: [
      "transcription",
      "meeting-notes",
      "zoom",
      "google-meet",
      "action-items",
    ],
    accentColor: "#3B82F6",
    securityScore: 72,
    securityAnalysis:
      "Otter.ai is SOC 2 Type II certified. Business and Enterprise plans include SSO and admin controls. Meeting recordings and transcripts are stored on Otter's servers.",
    dataPrivacyNotes:
      "Meeting transcripts stored and processed on Otter's servers. May be used to improve AI models. Business: DPA available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "fireflies-ai",
    name: "Fireflies.ai",
    tagline: "AI notetaker for every meeting across every platform",
    description:
      "Fireflies.ai is an AI meeting assistant that automatically records, transcribes, and analyses meetings across Zoom, Teams, Meet, Webex, and 40+ other platforms. Its AI generates summaries, extracts action items and decisions, and integrates with CRMs (Salesforce, HubSpot) to auto-populate meeting notes. The Conversation Intelligence feature tracks metrics like talk time, sentiment, and topic trends. A Slack integration delivers summaries instantly.",
    websiteUrl: "https://fireflies.ai",
    logoUrl: "https://logo.clearbit.com/fireflies.ai",
    categorySlug: "productivity",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 800 mins transcription/seat. Pro: $18/seat/month. Business: $29/seat/month. Enterprise: custom.",
    launchedYear: 2016,
    roles: ["product-manager", "marketer", "entrepreneur", "researcher"],
    tags: [
      "meeting-notes",
      "crm-integration",
      "conversation-intelligence",
      "slack",
      "multi-platform",
    ],
    accentColor: "#8B5CF6",
    securityScore: 73,
    securityAnalysis:
      "Fireflies.ai is SOC 2 Type II certified with AES-256 encryption. Business/Enterprise plans add admin controls, role-based permissions, and DPA.",
    dataPrivacyNotes:
      "Meeting recordings stored on Fireflies servers. Free tier data may be used to improve models. Business/Enterprise: custom retention and DPA.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "mem-ai",
    name: "Mem AI",
    tagline: "AI-powered self-organizing knowledge base",
    description:
      "Mem AI is an AI-powered note-taking and knowledge management tool that automatically organises your notes without the need for folders or tags. It uses AI to surface related content, connect ideas across notes, and provide a chat interface that answers questions using your personal knowledge base. Mem's AI writes directly in your notes, captures web clips, and integrates with Slack and Gmail to capture important information.",
    websiteUrl: "https://mem.ai",
    logoUrl: "https://logo.clearbit.com/mem.ai",
    categorySlug: "productivity",
    hasFree: false,
    pricingModel: "freemium",
    pricingDetails: "Free tier available. Mem: $14.99/month. Teams: custom.",
    launchedYear: 2019,
    roles: ["researcher", "writer", "product-manager", "entrepreneur"],
    tags: [
      "knowledge-management",
      "notes",
      "self-organising",
      "personal-ai",
      "slack",
    ],
    accentColor: "#F59E0B",
    securityScore: 68,
    securityAnalysis:
      "Mem uses standard security practices. Notes stored on Mem's servers and processed by their AI. A third-party security audit has been conducted but details aren't publicly published.",
    dataPrivacyNotes:
      "All notes processed by Mem's AI. May be used to improve the product. Sensitive personal information should be stored with awareness of this.",
    complianceBadges: ["GDPR"],
  },

  // ── Developer Platforms ───────────────────────────────────────────────────
  {
    slug: "hugging-face",
    name: "Hugging Face",
    tagline: "The AI community hub for models, datasets, and spaces",
    description:
      "Hugging Face is the central hub of the open-source AI community, hosting 500,000+ AI models, 100,000+ datasets, and 300,000+ demo apps (Spaces). The Transformers library powers model inference across PyTorch, TensorFlow, and JAX. Hugging Face Hub provides versioned model and dataset storage with a Git-based workflow. Inference Endpoints allow deploying any model to dedicated cloud infrastructure. The platform supports text, vision, audio, and multimodal models.",
    websiteUrl: "https://huggingface.co",
    logoUrl: "https://logo.clearbit.com/huggingface.co",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free public hosting. Pro: $9/month. Enterprise Hub: $20/user/month. Inference Endpoints: usage-based from $0.032/hour.",
    launchedYear: 2016,
    roles: ["developer", "data-scientist", "researcher"],
    tags: [
      "model-hub",
      "open-source",
      "transformers",
      "datasets",
      "inference",
      "community",
    ],
    accentColor: "#FFD21E",
    securityScore: 78,
    securityAnalysis:
      "Hugging Face is SOC 2 Type II certified for Enterprise Hub. Private model repositories use access tokens. Spaces run in sandboxed containers. Enterprise Hub adds SSO, audit logs, and isolated storage.",
    dataPrivacyNotes:
      "Public models and datasets are open by default. Private repos are access-controlled. Enterprise: data isolation in dedicated infrastructure.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "langchain",
    name: "LangChain",
    tagline: "Framework for building LLM-powered applications",
    description:
      "LangChain is the most widely adopted framework for building applications with large language models. It provides abstractions for chains (sequential LLM calls), agents (tool-using LLMs), retrieval-augmented generation (RAG), memory, and structured output. LangGraph (its stateful agent framework) and LangSmith (its observability and evaluation platform) extend the ecosystem. Supports Python and JavaScript. Used to build chatbots, research assistants, and autonomous agents.",
    websiteUrl: "https://langchain.com",
    logoUrl: "https://logo.clearbit.com/langchain.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "LangChain OSS: free. LangSmith: Developer free (5,000 traces/month), Plus: $39/month. LangGraph Cloud: custom.",
    launchedYear: 2022,
    roles: ["developer", "data-scientist", "researcher"],
    tags: [
      "rag",
      "agents",
      "llm-framework",
      "open-source",
      "python",
      "javascript",
    ],
    accentColor: "#1C3C3C",
    securityScore: 82,
    securityAnalysis:
      "LangChain is open source and self-hostable. LangSmith (the cloud observability platform) is SOC 2 Type II certified. Self-hosted deployments give complete control over data flow.",
    dataPrivacyNotes:
      "LangChain itself doesn't store data — it routes to your configured LLM providers. LangSmith traces stored on LangChain servers unless self-hosted.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "pinecone",
    name: "Pinecone",
    tagline: "The vector database for AI applications",
    description:
      "Pinecone is a fully managed vector database optimised for similarity search in AI applications. It stores and indexes high-dimensional embeddings from text, images, or audio, enabling fast semantic search, retrieval-augmented generation (RAG), and recommendation systems. Pinecone's serverless tier scales to billions of vectors with pay-per-use pricing. It integrates natively with LangChain, LlamaIndex, OpenAI, and most embedding models.",
    websiteUrl: "https://pinecone.io",
    logoUrl: "https://logo.clearbit.com/pinecone.io",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 5 serverless indexes, 2GB storage. Standard: usage-based from $0.04/write unit. Enterprise: custom.",
    launchedYear: 2021,
    roles: ["developer", "data-scientist"],
    tags: ["vector-database", "rag", "embeddings", "similarity-search", "serverless"],
    accentColor: "#1DB954",
    securityScore: 80,
    securityAnalysis:
      "Pinecone is SOC 2 Type II certified with GDPR compliance. Enterprise plan includes VPC peering, private endpoints, and RBAC. Data encrypted at rest and in transit.",
    dataPrivacyNotes:
      "Vector data stored on Pinecone's infrastructure. Enterprise: dedicated deployment options with data residency control.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "ollama",
    name: "Ollama",
    tagline: "Run large language models locally",
    description:
      "Ollama makes it trivially easy to download and run large language models locally on macOS, Linux, and Windows. With a single command, users can run Llama 3, Mistral, Qwen, Gemma, Phi, Deepseek, and 100+ other models. Ollama provides a local REST API compatible with OpenAI's API format, making it a drop-in replacement for local development. It handles model management, quantisation, and GPU acceleration automatically.",
    websiteUrl: "https://ollama.com",
    logoUrl: "https://logo.clearbit.com/ollama.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Completely free and open source (MIT). You only pay for hardware to run it on.",
    launchedYear: 2023,
    roles: ["developer", "data-scientist", "researcher"],
    tags: ["local-llm", "open-source", "privacy", "llama", "openai-compatible"],
    accentColor: "#000000",
    securityScore: 95,
    securityAnalysis:
      "Ollama provides maximum security — all inference runs locally, no data leaves your machine. Ideal for sensitive enterprise data processing. Full air-gap deployment possible. Open source and fully auditable.",
    dataPrivacyNotes:
      "Zero data transmitted. All models run locally. Complete data sovereignty. Suitable for processing highly sensitive or regulated data.",
    complianceBadges: [],
  },
  {
    slug: "llamaindex",
    name: "LlamaIndex",
    tagline: "Data framework for LLM-powered search and retrieval",
    description:
      "LlamaIndex (formerly GPT Index) is an open-source data framework for building LLM applications over custom data. It specialises in ingesting, structuring, and retrieving data for RAG (Retrieval-Augmented Generation) workflows. LlamaIndex provides 100+ data connectors (PDFs, databases, APIs, websites), advanced indexing strategies, query engines, and evaluation tools. LlamaCloud (the managed service) handles production-grade parsing and indexing.",
    websiteUrl: "https://llamaindex.ai",
    logoUrl: "https://logo.clearbit.com/llamaindex.ai",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "LlamaIndex OSS: free. LlamaCloud: free tier, $30/month, Enterprise: custom.",
    launchedYear: 2022,
    roles: ["developer", "data-scientist"],
    tags: ["rag", "data-connectors", "indexing", "open-source", "python", "typescript"],
    accentColor: "#8B5CF6",
    securityScore: 80,
    securityAnalysis:
      "LlamaIndex is open source and self-hostable. LlamaCloud (managed service) is SOC 2 certified. Self-hosted deployments give complete data control.",
    dataPrivacyNotes:
      "OSS deployment: no data transmitted to LlamaIndex. LlamaCloud: data processed on their infrastructure per their privacy policy.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "weaviate",
    name: "Weaviate",
    tagline: "Open-source AI-native vector database",
    description:
      "Weaviate is an open-source, AI-native vector database that combines vector search with structured data filtering. It supports text, image, and multimodal objects, auto-vectorisation via model integrations (OpenAI, Cohere, HuggingFace), GraphQL and REST APIs, and horizontal scaling. Weaviate Cloud (WCS) is the managed offering. Used widely in production RAG applications, semantic search, and recommendation engines.",
    websiteUrl: "https://weaviate.io",
    logoUrl: "https://logo.clearbit.com/weaviate.io",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "OSS: free self-hosted. Weaviate Cloud: free sandbox, Standard: usage-based, Enterprise: custom.",
    launchedYear: 2019,
    roles: ["developer", "data-scientist"],
    tags: ["vector-database", "open-source", "graphql", "rag", "multimodal", "semantic-search"],
    accentColor: "#00BB7B",
    securityScore: 83,
    securityAnalysis:
      "Weaviate Cloud is SOC 2 Type II certified with GDPR compliance. Self-hosted Weaviate gives complete data sovereignty. Enterprise Cloud includes VPC deployment options.",
    dataPrivacyNotes:
      "Self-hosted: maximum data control. Managed cloud: encrypted storage with EU data residency option for GDPR compliance.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Design & UX ───────────────────────────────────────────────────────────
  {
    slug: "figma-ai",
    name: "Figma AI",
    tagline: "AI-powered features built into your design workflow",
    description:
      "Figma AI integrates generative AI directly into the Figma design platform. Features include First Draft (generate full UI layouts from a prompt), Make Designs (convert text to mockups), Rename Layers (auto-name layers intelligently), Visual Search (find similar components), and AI-powered prototyping suggestions. Figma AI is available to all Figma plans and uses a mix of proprietary and third-party AI models.",
    websiteUrl: "https://figma.com/ai",
    logoUrl: "https://logo.clearbit.com/figma.com",
    categorySlug: "design-ux",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Included in all Figma plans: Free (limited), Professional: $12/editor/month, Organization: $45/editor/month.",
    launchedYear: 2023,
    roles: ["designer", "product-manager", "developer"],
    tags: ["ui-design", "prototyping", "layout-generation", "components", "collaboration"],
    accentColor: "#F24E1E",
    securityScore: 80,
    securityAnalysis:
      "Figma inherits its mature security posture (SOC 2 Type II, ISO 27001) for its AI features. AI prompts and outputs are subject to Figma's data processing terms. Organisation plans include DPA.",
    dataPrivacyNotes:
      "Design files and AI prompts may be processed to improve Figma AI. Organisation plan: DPA available, content not used for training.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "canva-ai",
    name: "Canva AI",
    tagline: "AI design tools for everyone inside Canva",
    description:
      "Canva AI brings a comprehensive suite of generative AI features to Canva's design platform. Magic Studio includes Magic Design (template generation), Magic Write (AI copywriting), Magic Edit (in-image AI editing), Magic Eraser (background removal), Magic Expand (generative image extension), Text to Image, and AI video generation. With 150M+ monthly users, Canva AI is the most accessible AI design tool at scale.",
    websiteUrl: "https://canva.com/ai-image-generator",
    logoUrl: "https://logo.clearbit.com/canva.com",
    categorySlug: "design-ux",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier with limited AI credits. Canva Pro: $15/month (generous AI credits). Canva Teams: $10/user/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["designer", "marketer", "entrepreneur", "video-creator"],
    tags: [
      "design",
      "magic-studio",
      "background-removal",
      "text-to-image",
      "templates",
      "social-media",
    ],
    accentColor: "#00C4CC",
    securityScore: 76,
    securityAnalysis:
      "Canva is ISO 27001 and SOC 2 Type II certified. Enterprise plan includes SSO, DPA, and content controls. AI-generated content and uploaded media processed per Canva's privacy policy.",
    dataPrivacyNotes:
      "Designs and uploaded content may be used to improve Canva AI. Enterprise: content not used for model training, DPA available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "looka",
    name: "Looka",
    tagline: "AI-powered logo design and brand kit generation",
    description:
      "Looka is an AI-powered brand design platform that generates professional logos and complete brand kits. Users answer questions about their industry and style preferences, and Looka's AI generates dozens of logo options. After selecting and customising a logo, users receive a complete brand kit including business cards, social media templates, email signatures, and brand guidelines. No design experience required.",
    websiteUrl: "https://looka.com",
    logoUrl: "https://logo.clearbit.com/looka.com",
    categorySlug: "design-ux",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Logo Package: $65 one-time. Brand Kit subscription: $96/year. Premium: $129/year.",
    launchedYear: 2016,
    roles: ["entrepreneur", "marketer"],
    tags: ["logo-design", "brand-identity", "branding", "no-code", "templates"],
    accentColor: "#6366F1",
    securityScore: 65,
    securityAnalysis:
      "Looka uses standard security practices for its design platform. Payment processing via PCI-DSS compliant providers.",
    dataPrivacyNotes:
      "Brand assets and account data stored on Looka's servers. Design data may be used to improve AI recommendations.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "uizard",
    name: "Uizard",
    tagline: "AI-powered UI prototyping from sketches and prompts",
    description:
      "Uizard is an AI-powered UI design and prototyping tool that lets you create interactive mockups from text prompts, hand-drawn sketches, or screenshots. Its Autodesigner feature generates multi-screen app designs from a single description. Wireframe scanner converts whiteboard photos to editable UI components. Uizard supports mobile, tablet, and web designs with pre-built component libraries. Popular for rapid concept validation with non-designers.",
    websiteUrl: "https://uizard.io",
    logoUrl: "https://logo.clearbit.com/uizard.io",
    categorySlug: "design-ux",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 3 projects, limited AI generations. Pro: $19/month. Business: $49/month.",
    launchedYear: 2019,
    roles: ["designer", "product-manager", "entrepreneur"],
    tags: ["prototyping", "wireframing", "sketch-to-ui", "text-to-ui", "rapid-prototyping"],
    accentColor: "#5B4CF5",
    securityScore: 65,
    securityAnalysis:
      "Uizard follows standard security practices for a SaaS design tool. GDPR compliant. No specific compliance certifications published.",
    dataPrivacyNotes:
      "Design files and AI interactions stored on Uizard servers. May be used to improve AI features.",
    complianceBadges: ["GDPR"],
  },

  // ── Data & Analytics ──────────────────────────────────────────────────────
  {
    slug: "julius-ai",
    name: "Julius AI",
    tagline: "AI data analyst for spreadsheets and databases",
    description:
      "Julius AI is an AI data analyst that lets you have conversations with your data. Upload a CSV, Excel file, or connect a database, then ask questions in plain English — Julius writes and executes the code, produces charts, and explains insights. It handles statistical analysis, data cleaning, forecasting, and visualisation. Supports Python, SQL, and R execution. Used by analysts, researchers, and non-technical business users.",
    websiteUrl: "https://julius.ai",
    logoUrl: "https://logo.clearbit.com/julius.ai",
    categorySlug: "data-analytics",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 15 messages/day. Basic: $20/month. Essential: $28/month. Pro: $50/month.",
    launchedYear: 2023,
    roles: ["data-scientist", "researcher", "entrepreneur", "product-manager"],
    tags: ["data-analysis", "csv", "sql", "charts", "python", "no-code"],
    accentColor: "#7C3AED",
    securityScore: 65,
    securityAnalysis:
      "Julius AI processes uploaded data on their servers. Enterprise plan includes custom data handling. Sensitive data should be anonymised before uploading.",
    dataPrivacyNotes:
      "Uploaded data files stored on Julius's servers for the session. Pro plan: data deleted after session ends.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "hex",
    name: "Hex",
    tagline: "Collaborative AI-powered data notebooks and apps",
    description:
      "Hex is a modern data analytics platform combining SQL, Python, and no-code in a collaborative notebook interface. Hex Magic is its AI assistant that writes and edits SQL and Python, explains code, fixes errors, and generates charts from natural language. Projects can be published as interactive data apps for stakeholders. Hex integrates with all major data warehouses (Snowflake, BigQuery, Redshift) and dbt.",
    websiteUrl: "https://hex.tech",
    logoUrl: "https://logo.clearbit.com/hex.tech",
    categorySlug: "data-analytics",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 1 workspace, 5 projects. Team: $24/user/month. Enterprise: custom.",
    launchedYear: 2021,
    roles: ["data-scientist", "researcher", "product-manager"],
    tags: ["data-notebooks", "sql", "python", "collaboration", "data-apps", "warehouse"],
    accentColor: "#FF5C00",
    securityScore: 78,
    securityAnalysis:
      "Hex is SOC 2 Type II certified. Enterprise plan includes SSO, VPC deployment, and HIPAA compliance option. Data warehouse credentials stored with encryption.",
    dataPrivacyNotes:
      "Query results and notebook content stored on Hex's infrastructure. Enterprise: isolated deployment with custom data residency.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    slug: "zapier",
    name: "Zapier",
    tagline: "AI-powered workflow automation for 7,000+ apps",
    description:
      "Zapier is the leading no-code automation platform connecting 7,000+ apps. Its AI features include Zapier AI (natural language automation builder), AI-powered Zap suggestions, AI by Zapier (use AI steps in any Zap), and AI-powered chatbots with Interfaces. Zapier also offers Tables (a connected database) and Interfaces (a form/page builder). Used by millions of businesses to automate repetitive workflows across marketing, sales, and operations.",
    websiteUrl: "https://zapier.com",
    logoUrl: "https://logo.clearbit.com/zapier.com",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100 tasks/month. Starter: $19.99/month. Professional: $49/month. Team: $69/month. Enterprise: custom.",
    launchedYear: 2011,
    roles: ["marketer", "entrepreneur", "product-manager"],
    tags: ["automation", "no-code", "7000-integrations", "workflow", "ai-actions"],
    accentColor: "#FF4A00",
    securityScore: 80,
    securityAnalysis:
      "Zapier is SOC 2 Type II certified with ISO 27001. Enterprise plan includes SSO, SAML, IP allowlisting, and GDPR DPA. Data encrypted in transit and at rest.",
    dataPrivacyNotes:
      "Zapier processes data passed through Zaps. Data is not shared with third parties and is encrypted. Enterprise: custom data residency options.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "make",
    name: "Make",
    tagline: "Visual AI workflow automation platform",
    description:
      "Make (formerly Integromat) is a powerful visual workflow automation platform that offers far more flexibility than Zapier for complex, multi-path automations. Its canvas-based editor supports conditional logic, data transformation, error handling, iterators, and aggregators. Make's AI tools include built-in OpenAI/Claude/Gemini integration, AI Router for multi-model logic, and an AI-powered scenario builder. Supports 1,500+ apps and custom HTTP connections.",
    websiteUrl: "https://make.com",
    logoUrl: "https://logo.clearbit.com/make.com",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 1,000 ops/month. Core: $9/month. Pro: $16/month. Teams: $29/month. Enterprise: custom.",
    launchedYear: 2012,
    roles: ["developer", "marketer", "entrepreneur"],
    tags: ["automation", "visual-builder", "no-code", "complex-logic", "1500-apps"],
    accentColor: "#6D00CC",
    securityScore: 78,
    securityAnalysis:
      "Make is ISO 27001 and SOC 2 Type II certified. Enterprise includes SSO, custom data regions, and a DPA. Data processed in EU by default (Czech Republic headquarters).",
    dataPrivacyNotes:
      "Data processed through Make scenarios is subject to their privacy policy. EU-based infrastructure provides GDPR compliance. Enterprise: custom data residency.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "n8n",
    name: "n8n",
    tagline: "Open-source workflow automation with AI nodes",
    description:
      "n8n is a source-available workflow automation tool that can be self-hosted for complete data control. It features a visual node editor, 400+ integrations, JavaScript/Python code nodes, and first-class AI support including LangChain nodes, vector store nodes, AI agents, and memory nodes. n8n's AI Agent capability lets you build autonomous agents that use tools and reason across multi-step tasks. Popular with technical teams and enterprises needing data sovereignty.",
    websiteUrl: "https://n8n.io",
    logoUrl: "https://logo.clearbit.com/n8n.io",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Self-hosted: free (source-available, fair-code licence). n8n Cloud: Starter $24/month, Pro $60/month, Enterprise: custom.",
    launchedYear: 2019,
    roles: ["developer", "entrepreneur", "marketer"],
    tags: [
      "open-source",
      "self-hosted",
      "ai-agents",
      "langchain",
      "400-integrations",
      "data-sovereignty",
    ],
    accentColor: "#EA4B71",
    securityScore: 88,
    securityAnalysis:
      "n8n's self-hosted deployment provides complete data sovereignty — no data flows to n8n's servers. The source code is auditable. n8n Cloud is ISO 27001 certified. Enterprise includes SSO and audit logs.",
    dataPrivacyNotes:
      "Self-hosted: maximum data control, zero data to n8n. n8n Cloud: data processed on their infrastructure. Enterprise Cloud: EU data residency option, DPA available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "relevance-ai",
    name: "Relevance AI",
    tagline: "Build and deploy AI agents and tools without code",
    description:
      "Relevance AI is a no-code platform for building, deploying, and managing AI agents and workflows. Users assemble agents from pre-built tools (web search, code execution, data extraction, CRM updates) and define their goals in plain English. The Agent Workforce feature allows multiple agents to collaborate on complex tasks. Relevance AI targets business teams wanting to automate knowledge work without engineering resources.",
    websiteUrl: "https://relevanceai.com",
    logoUrl: "https://logo.clearbit.com/relevanceai.com",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100 credits/day. Starter: $19/month. Team: $99/month. Business: $279/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["entrepreneur", "marketer", "product-manager"],
    tags: ["ai-agents", "no-code", "workforce", "automation", "tool-builder"],
    accentColor: "#2563EB",
    securityScore: 70,
    securityAnalysis:
      "Relevance AI is SOC 2 Type II certified. Enterprise plan includes SSO and custom security agreements. Agents execute with your API keys; credential management is a key security consideration.",
    dataPrivacyNotes:
      "Agent interactions and data processed on Relevance AI's servers. Credentials passed to agents should be minimally scoped. Enterprise: DPA available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
];

// ---------------------------------------------------------------------------
// Seed execution
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // 1. Upsert categories
  console.log(`📂 Seeding ${CATEGORIES.length} categories...`);
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(CATEGORIES)
    .onConflictDoUpdate({
      target: categoriesTable.slug,
      set: {
        name: categoriesTable.name,
        description: categoriesTable.description,
        icon: categoriesTable.icon,
      },
    })
    .returning({ id: categoriesTable.id, slug: categoriesTable.slug });

  const categoryIdBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`   ✓ ${insertedCategories.length} categories upserted\n`);

  // 2. Upsert roles
  console.log(`👤 Seeding ${ROLES.length} roles...`);
  const insertedRoles = await db
    .insert(rolesTable)
    .values(ROLES)
    .onConflictDoUpdate({
      target: rolesTable.slug,
      set: {
        name: rolesTable.name,
        description: rolesTable.description,
      },
    })
    .returning({ id: rolesTable.id, slug: rolesTable.slug });
  console.log(`   ✓ ${insertedRoles.length} roles upserted\n`);

  // 3. Upsert tools
  console.log(`🔧 Seeding ${TOOLS.length} tools...`);
  let toolsImported = 0;
  const toolErrors: string[] = [];

  for (const tool of TOOLS) {
    const categoryId = categoryIdBySlug.get(tool.categorySlug);
    if (!categoryId) {
      toolErrors.push(`Tool "${tool.slug}": unknown categorySlug "${tool.categorySlug}"`);
      continue;
    }

    try {
      await db
        .insert(toolsTable)
        .values({
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          websiteUrl: tool.websiteUrl,
          logoUrl: tool.logoUrl,
          categoryId,
          hasFree: tool.hasFree,
          pricingModel: tool.pricingModel,
          pricingDetails: tool.pricingDetails,
          launchedYear: tool.launchedYear,
          roles: tool.roles,
          tags: tool.tags,
          accentColor: tool.accentColor,
          securityScore: tool.securityScore,
          securityAnalysis: tool.securityAnalysis,
          dataPrivacyNotes: tool.dataPrivacyNotes,
          complianceBadges: tool.complianceBadges,
        })
        .onConflictDoUpdate({
          target: toolsTable.slug,
          set: {
            name: tool.name,
            tagline: tool.tagline,
            description: tool.description,
            websiteUrl: tool.websiteUrl,
            logoUrl: tool.logoUrl,
            categoryId,
            hasFree: tool.hasFree,
            pricingModel: tool.pricingModel,
            pricingDetails: tool.pricingDetails,
            launchedYear: tool.launchedYear,
            roles: tool.roles,
            tags: tool.tags,
            accentColor: tool.accentColor,
            securityScore: tool.securityScore,
            securityAnalysis: tool.securityAnalysis,
            dataPrivacyNotes: tool.dataPrivacyNotes,
            complianceBadges: tool.complianceBadges,
          },
        });
      toolsImported++;
    } catch (err: any) {
      toolErrors.push(`Tool "${tool.slug}": ${err.message}`);
    }
  }

  console.log(`   ✓ ${toolsImported}/${TOOLS.length} tools upserted`);
  if (toolErrors.length > 0) {
    console.error(`   ✗ ${toolErrors.length} errors:`);
    toolErrors.forEach((e) => console.error(`     - ${e}`));
  }

  console.log("\n✅ Seed complete!");
  console.log(`   Categories: ${insertedCategories.length}`);
  console.log(`   Roles:      ${insertedRoles.length}`);
  console.log(`   Tools:      ${toolsImported}`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
