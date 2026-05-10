export type SeedTool = {
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

export const TOOLS: SeedTool[] = [
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
      "Creator: $39/month annual ($49 monthly). Pro: $59/month annual ($69 monthly). Business: custom. 7-day free trial.",
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
    tagline: "AI-native GTM platform for sales and marketing",
    description:
      "Copy.ai has fully pivoted from an AI writing tool to a GTM AI platform — and was acquired by Fullcast in October 2025. Workflows automate multi-step prospect research, personalised outreach, ad copy, and pipeline orchestration, integrating with HubSpot, Salesforce, and Zapier. The original copy-generation surface remains as one of many wedges into the broader GTM platform.",
    websiteUrl: "https://www.copy.ai",
    logoUrl: "https://logo.clearbit.com/copy.ai",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier. Starter: ~$49/month. Advanced: ~$249/month. Enterprise/GTM wedges: custom-quoted.",
    launchedYear: 2020,
    roles: ["marketer", "sales-professional", "entrepreneur"],
    tags: ["gtm", "sales", "outreach", "automation", "hubspot", "salesforce", "acquired-by-fullcast"],
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
    tagline: "AI SEO and Generative Engine Optimization platform",
    description:
      "Writesonic repositioned in 2024-2025 from an AI writer to an AI SEO and 'Generative Engine Optimization' (GEO) platform. The product now bundles content generation with audits, brand-voice consistency checks, and tooling specifically for ranking inside AI search surfaces (Perplexity, Google AI Overviews, ChatGPT search). Chatsonic and Botsonic remain available but no longer anchor the positioning.",
    websiteUrl: "https://writesonic.com",
    logoUrl: "https://logo.clearbit.com/writesonic.com",
    categorySlug: "writing-tools",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Starter: ~$79/month annual. Growth: ~$399/month. Higher tiers: $199-$999+. Free trial only — no permanent free tier.",
    launchedYear: 2020,
    roles: ["marketer", "writer"],
    tags: ["seo", "generative-engine-optimization", "geo", "content-marketing", "ai-search"],
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
    name: "Mem",
    tagline: "AI thought partner with self-organising notes",
    description:
      "Mem 2.0 (relaunched late 2025/early 2026) repositions the product from a notes app to an 'AI thought partner' — chat-driven knowledge work over an automatically organised personal knowledge base. The AI writes directly in notes, surfaces related material as you type, captures web clips, and integrates with Slack and Gmail.",
    websiteUrl: "https://mem.ai",
    logoUrl: "https://logo.clearbit.com/mem.ai",
    categorySlug: "productivity",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails: "Free: 25 notes + 25 chats/month. Pro: $12/month. Teams: custom.",
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
  {
    slug: "lindy-ai",
    name: "Lindy",
    tagline: "Build AI employees that handle your busywork",
    description:
      "Lindy is a no-code platform for building autonomous AI agents (\"Lindies\") that handle email triage, calendar scheduling, CRM updates, customer support, and recruiting workflows. Users describe a goal in natural language and connect tools — Lindy plans, executes, and learns from feedback. It supports 3,000+ integrations, multi-agent orchestration, and trigger-based automation.",
    websiteUrl: "https://lindy.ai",
    logoUrl: "https://logo.clearbit.com/lindy.ai",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 400 credits/month. Pro: $49.99/month. Business: $199.99/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["entrepreneur", "operations-manager", "sales-professional", "recruiter"],
    tags: ["ai-agents", "no-code", "email", "scheduling", "multi-agent"],
    accentColor: "#7C3AED",
    securityScore: 68,
    securityAnalysis:
      "Lindy connects to email, calendar, and CRM with OAuth. SOC 2 Type II in progress. Agents act on your behalf — review permissions and triggers carefully.",
    dataPrivacyNotes:
      "Workflow data and integration content processed on Lindy's infrastructure. Enterprise plan offers custom data handling.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "crew-ai",
    name: "CrewAI",
    tagline: "Open-source framework for multi-agent AI systems",
    description:
      "CrewAI is an open-source Python framework for orchestrating role-playing autonomous AI agents that work together as a crew. Each agent has a role, goal, and tools; the crew coordinates tasks, delegates between agents, and shares context to complete complex objectives. CrewAI Enterprise adds a hosted control plane, observability, and a no-code studio for building agent crews.",
    websiteUrl: "https://crewai.com",
    logoUrl: "https://logo.clearbit.com/crewai.com",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Open-source framework: free (MIT). CrewAI Enterprise (hosted control plane, observability): custom pricing.",
    launchedYear: 2024,
    roles: ["developer", "data-scientist", "entrepreneur"],
    tags: ["multi-agent", "open-source", "python", "framework", "orchestration"],
    accentColor: "#FF5A1F",
    securityScore: 84,
    securityAnalysis:
      "CrewAI runs locally as a Python library — code never leaves your environment unless you call hosted LLM APIs. Enterprise platform is SOC 2 Type II in progress.",
    dataPrivacyNotes:
      "Self-hosted: full data sovereignty. Hosted Enterprise: agent execution data retained for observability; DPA available.",
    complianceBadges: [],
  },

  // ── Code Assistants (additional) ──────────────────────────────────────────
  {
    slug: "claude-code",
    name: "Claude Code",
    tagline: "Anthropic's terminal-native agentic coding tool",
    description:
      "Claude Code is Anthropic's official command-line coding agent. It runs directly in the terminal with access to your repository, can plan and execute multi-step changes, run tests, and iterate on failures — all powered by the latest Claude models. It supports custom slash commands, hooks, MCP servers, and IDE integrations for VS Code and JetBrains. The Agent SDK lets developers embed Claude Code's loop into their own tools.",
    websiteUrl: "https://www.anthropic.com/claude-code",
    logoUrl: "https://logo.clearbit.com/anthropic.com",
    categorySlug: "code-assistants",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Pay-as-you-go via Anthropic API tokens, or included in Claude Pro ($20/month) and Max plans. Enterprise via Anthropic and AWS Bedrock.",
    launchedYear: 2025,
    roles: ["developer", "security-engineer"],
    tags: ["agentic-coding", "terminal", "anthropic", "mcp", "claude"],
    accentColor: "#D97706",
    securityScore: 86,
    securityAnalysis:
      "Claude Code runs locally and asks for permission before destructive actions. API traffic is governed by Anthropic's commercial terms, including a no-training pledge for API customers and zero-data-retention options for enterprise.",
    dataPrivacyNotes:
      "Code is sent to Anthropic's API for inference but is not used for training. Enterprise customers can opt into ZDR.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA", "ISO27001"],
  },
  {
    slug: "bolt-new",
    name: "Bolt.new",
    tagline: "Prompt, run, edit, and deploy full-stack web apps from your browser",
    description:
      "Bolt.new (by StackBlitz) is a browser-based AI development environment that spins up a full-stack app from a single prompt. It runs Node.js entirely in the browser via WebContainers, lets the AI install packages, edit files, and run dev servers, and can deploy to Netlify with one click. Popular with founders, designers, and PMs validating ideas before involving engineering.",
    websiteUrl: "https://bolt.new",
    logoUrl: "https://logo.clearbit.com/stackblitz.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: limited tokens/day. Pro: $20/month. Pro 50: $50/month. Pro 100: $100/month. Teams: $30/user/month.",
    launchedYear: 2024,
    roles: ["developer", "designer", "entrepreneur", "product-manager"],
    tags: ["full-stack", "in-browser", "webcontainers", "deploy", "prototyping"],
    accentColor: "#1389FD",
    securityScore: 70,
    securityAnalysis:
      "Bolt runs in-browser via StackBlitz WebContainers; project files live in the browser sandbox. StackBlitz is SOC 2 Type II certified. Deployments inherit the security posture of the connected provider (Netlify, Supabase).",
    dataPrivacyNotes:
      "Project source and prompts processed by Bolt's backend models. Pro plans support private projects with stricter retention.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "lovable",
    name: "Lovable",
    tagline: "Build full-stack apps by chatting with an AI",
    description:
      "Lovable (formerly GPT Engineer) is an AI app builder that turns natural-language prompts into deployable React + Tailwind + Supabase applications. It generates the codebase, handles auth, databases, and deployments, and lets users iterate by chatting. Targeted at founders and PMs who want to ship MVPs without writing code, while still producing real, exportable codebases.",
    websiteUrl: "https://lovable.dev",
    logoUrl: "https://logo.clearbit.com/lovable.dev",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 5 daily messages. Pro: $25/month. Teams: $30/user/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["developer", "entrepreneur", "designer", "product-manager"],
    tags: ["app-builder", "react", "supabase", "no-code", "full-stack"],
    accentColor: "#F472B6",
    securityScore: 68,
    securityAnalysis:
      "Lovable generates code that runs on the user's chosen Supabase + hosting stack. The Lovable platform itself is GDPR-compliant; SOC 2 in progress. Generated apps inherit security posture from their integrations.",
    dataPrivacyNotes:
      "Project files and chat history stored on Lovable's infrastructure. Connected GitHub repos and Supabase projects follow those providers' policies.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "v0",
    name: "v0",
    tagline: "Vercel's generative UI for React and Next.js",
    description:
      "v0 is Vercel's generative UI tool that turns prompts and screenshots into production-ready React, Tailwind, and shadcn/ui components. It supports multi-turn refinement, iterating on layouts, and shipping directly to a Next.js project on Vercel. Tightly integrated with the Vercel platform — generated components plug into your existing project, design system, and deployment pipeline.",
    websiteUrl: "https://v0.dev",
    logoUrl: "https://logo.clearbit.com/vercel.com",
    categorySlug: "design-ux",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: limited credits/month. Premium: $20/month. Team: $30/user/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["developer", "designer", "product-manager"],
    tags: ["generative-ui", "react", "shadcn", "tailwind", "vercel", "next-js"],
    accentColor: "#000000",
    securityScore: 80,
    securityAnalysis:
      "v0 inherits Vercel's enterprise security posture (SOC 2 Type II, ISO 27001). Generated code is reviewable before commit; no opaque runtime dependencies.",
    dataPrivacyNotes:
      "Prompts and generated outputs are retained by Vercel; Enterprise plans include zero-retention and DPA options.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "replit-agent",
    name: "Replit Agent",
    tagline: "AI agent that builds and deploys apps inside Replit",
    description:
      "Replit Agent is an autonomous AI engineer that lives inside the Replit cloud IDE. Given a goal, it scaffolds a project, installs dependencies, writes the code, runs it, debugs issues, and deploys — all inside a Replit workspace with a live preview. It pairs well with Replit Database, Auth, and Deployments for end-to-end app delivery without leaving the browser.",
    websiteUrl: "https://replit.com/ai",
    logoUrl: "https://logo.clearbit.com/replit.com",
    categorySlug: "code-assistants",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Included in Replit Core ($20/month) with monthly Agent credits. Teams: $40/user/month. Pay-as-you-go credits available.",
    launchedYear: 2024,
    roles: ["developer", "entrepreneur", "student", "educator"],
    tags: ["cloud-ide", "autonomous-agent", "deployment", "replit", "browser"],
    accentColor: "#F26207",
    securityScore: 72,
    securityAnalysis:
      "Replit is SOC 2 Type II certified. Agent runs inside isolated Repl containers; secrets are managed via the Replit Secrets manager. Public Repls are world-readable — sensitive work should use private Repls.",
    dataPrivacyNotes:
      "Workspace contents stored on Replit's infrastructure. Teams plan provides org-level controls and audit logs.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "sourcegraph-cody",
    name: "Sourcegraph Cody",
    tagline: "Enterprise AI coding assistant with deep code-graph context",
    description:
      "Cody is Sourcegraph's AI coding assistant designed for large enterprise codebases. It uses Sourcegraph's code graph and indexing to ground completions and chat in your real code, across thousands of repositories. Supports BYO LLM (Anthropic, OpenAI, Google, self-hosted), works in VS Code/JetBrains, and offers an enterprise-only self-hosted deployment for regulated industries.",
    websiteUrl: "https://sourcegraph.com/cody",
    logoUrl: "https://logo.clearbit.com/sourcegraph.com",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: limited completions/chats. Pro: $9/month. Enterprise: $59/user/month with self-hosted option.",
    launchedYear: 2023,
    roles: ["developer", "security-engineer"],
    tags: ["enterprise", "code-graph", "self-hosted", "byo-llm", "monorepo"],
    accentColor: "#F34E3F",
    securityScore: 88,
    securityAnalysis:
      "Sourcegraph offers a self-hosted Cody Enterprise deployment so code never leaves your network. SOC 2 Type II, ISO 27001. BYO-LLM lets you route requests to providers under your existing DPAs.",
    dataPrivacyNotes:
      "Self-hosted Enterprise: full data sovereignty. Cloud: code snippets sent to chosen LLM provider; no training on customer code.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "qodo",
    name: "Qodo",
    tagline: "AI quality agents for code review, tests, and PRs",
    description:
      "Qodo (formerly CodiumAI) focuses on code quality. Its agents generate meaningful unit tests, review pull requests, suggest refactors, and produce code-aware analyses. The Qodo Gen IDE plugin sits alongside completion tools; Qodo Merge automates PR review on GitHub, GitLab, and Bitbucket. Designed to complement rather than replace generic copilots.",
    websiteUrl: "https://qodo.ai",
    logoUrl: "https://logo.clearbit.com/qodo.ai",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Developer: free. Teams: $19/user/month. Enterprise: custom with self-hosted option.",
    launchedYear: 2023,
    roles: ["developer", "security-engineer"],
    tags: ["test-generation", "code-review", "pr-automation", "quality", "ide-plugin"],
    accentColor: "#7C3AED",
    securityScore: 82,
    securityAnalysis:
      "Qodo is SOC 2 Type II certified. Enterprise plan offers a self-hosted deployment. PR review runs in isolated CI environments with scoped tokens.",
    dataPrivacyNotes:
      "Customer code is not used to train models. Enterprise: zero-retention and self-hosted options available.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Chat Assistants (additional) ──────────────────────────────────────────
  {
    slug: "deepseek",
    name: "DeepSeek",
    tagline: "Open-weight reasoning models from DeepSeek AI",
    description:
      "DeepSeek is a Chinese AI lab that publishes open-weight frontier models including DeepSeek-V3 and the DeepSeek-R1 family of reasoning models. Its hosted chat interface offers free access to its reasoning model, while the API provides extremely competitive token pricing. DeepSeek's models are widely deployed via Hugging Face, Ollama, and self-hosted inference stacks.",
    websiteUrl: "https://chat.deepseek.com",
    logoUrl: "https://logo.clearbit.com/deepseek.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Chat: free. API: from $0.14 / 1M input tokens, $0.28 / 1M output tokens (DeepSeek-V3). Open weights free for self-hosting.",
    launchedYear: 2023,
    roles: ["developer", "researcher", "data-scientist", "student"],
    tags: ["open-weights", "reasoning", "low-cost", "self-hostable", "chinese-lab"],
    accentColor: "#1F2937",
    securityScore: 58,
    securityAnalysis:
      "DeepSeek's hosted services route data through infrastructure in China and are subject to Chinese law. Self-hosting open weights is the only way to keep data on-prem; many enterprises restrict use of the hosted endpoint.",
    dataPrivacyNotes:
      "Hosted chat and API: prompts may be retained and used to improve models. Open weights: full data sovereignty when self-hosted.",
    complianceBadges: [],
  },
  {
    slug: "you-com",
    name: "You.com",
    tagline: "AI search and productivity assistant with multiple modes",
    description:
      "You.com is an AI-first search engine and productivity assistant. It offers Smart, Genius, and Research modes that escalate from quick answers to multi-step web research with citations. You.com lets users switch between frontier models (GPT-4o, Claude, Gemini), upload files, and run code. Used by knowledge workers and researchers who want a single interface across providers.",
    websiteUrl: "https://you.com",
    logoUrl: "https://logo.clearbit.com/you.com",
    categorySlug: "chat-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free with limits. Pro: $15/month. Team: $20/user/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["researcher", "writer", "marketer", "student", "analyst"],
    tags: ["ai-search", "multi-model", "research", "citations", "web"],
    accentColor: "#7C3AED",
    securityScore: 72,
    securityAnalysis:
      "You.com is SOC 2 Type II certified. Enterprise plan includes SSO and DPA. Search queries pass through You.com's index plus selected upstream model providers.",
    dataPrivacyNotes:
      "Enterprise: zero-retention with model providers, no training on user data. Free/Pro: chat history stored to power memory.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Image Generation (additional) ─────────────────────────────────────────
  {
    slug: "recraft",
    name: "Recraft",
    tagline: "AI image generation tuned for designers and brand work",
    description:
      "Recraft is a text-to-image platform built around design workflows. Its V3 model (Recraft V3) tops the Artificial Analysis image arena and supports vector output, brand style training, infinite-canvas layout, and precise text rendering. Designers can train custom styles, lock palettes, and generate consistent assets across a campaign.",
    websiteUrl: "https://recraft.ai",
    logoUrl: "https://logo.clearbit.com/recraft.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 50 daily credits. Basic: $12/month. Advanced: $33/month. Pro: $66/month. Enterprise: custom.",
    launchedYear: 2022,
    roles: ["designer", "marketer", "photographer"],
    tags: ["text-to-image", "vector", "brand-style", "design", "typography"],
    accentColor: "#0EA5E9",
    securityScore: 68,
    securityAnalysis:
      "Recraft is GDPR-compliant. Enterprise plan offers DPA and custom data handling. Generated assets license terms vary by plan — review before commercial use.",
    dataPrivacyNotes:
      "Prompts and uploaded references stored on Recraft's infrastructure. Pro plan offers a private mode where outputs are not used in public galleries.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "krea",
    name: "Krea",
    tagline: "Real-time generative image and video canvas",
    description:
      "Krea is a generative creative tool offering real-time image generation, AI video, image enhancement, and a unified canvas across multiple frontier models (FLUX, Stable Diffusion, Imagen, Veo). Its real-time mode lets designers sketch and watch the AI redraw the result instantly, making it useful for ideation and concept iteration.",
    websiteUrl: "https://krea.ai",
    logoUrl: "https://logo.clearbit.com/krea.ai",
    categorySlug: "image-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: limited generations/day. Basic: $10/month. Pro: $35/month. Max: $60/month.",
    launchedYear: 2023,
    roles: ["designer", "video-creator", "photographer", "marketer"],
    tags: ["real-time", "multi-model", "canvas", "image-to-image", "enhance"],
    accentColor: "#F97316",
    securityScore: 65,
    securityAnalysis:
      "Krea relies on third-party model providers; outputs and prompts are processed via those providers and Krea's pipeline. No published SOC 2 / ISO certifications.",
    dataPrivacyNotes:
      "Prompts and uploads retained on Krea's infrastructure. Public/private project visibility configurable per project.",
    complianceBadges: ["GDPR"],
  },

  // ── Audio & Music (additional) ────────────────────────────────────────────
  {
    slug: "play-ht",
    name: "PlayHT",
    tagline: "Realistic AI voice generation and voice agents",
    description:
      "PlayHT generates natural-sounding speech in 140+ languages with hundreds of voices, including instant voice cloning. Its Play 3.0 Mini model is optimised for low-latency real-time use, powering AI phone agents and conversational apps. Used by podcasters, audiobook publishers, and IVR vendors.",
    websiteUrl: "https://play.ht",
    logoUrl: "https://logo.clearbit.com/play.ht",
    categorySlug: "audio-music",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 12,500 words. Creator: $39/month. Unlimited: $99/month. API: usage-based.",
    launchedYear: 2020,
    roles: ["video-creator", "writer", "marketer", "musician", "support-agent"],
    tags: ["text-to-speech", "voice-cloning", "realtime", "voice-agents", "multilingual"],
    accentColor: "#7C3AED",
    securityScore: 70,
    securityAnalysis:
      "PlayHT is SOC 2 Type II certified. Voice cloning requires consent attestation. Enterprise plan supports custom data handling and DPA.",
    dataPrivacyNotes:
      "Cloned voices and generated audio stored on PlayHT's servers. Enterprise plan offers data residency options.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "assemblyai",
    name: "AssemblyAI",
    tagline: "Speech-to-text, summarisation, and audio intelligence APIs",
    description:
      "AssemblyAI provides developer APIs for speech-to-text, speaker diarisation, sentiment analysis, summarisation, and PII redaction. Its Universal-2 model targets sub-1% word-error-rate in English. Used heavily by sales conversation tools, contact centres, and accessibility products.",
    websiteUrl: "https://assemblyai.com",
    logoUrl: "https://logo.clearbit.com/assemblyai.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: $50 in API credits. Pay-as-you-go from $0.37/hour transcription. Enterprise: volume pricing and dedicated SLAs.",
    launchedYear: 2017,
    roles: ["developer", "data-scientist", "support-agent"],
    tags: ["speech-to-text", "api", "diarisation", "audio-intelligence", "pii-redaction"],
    accentColor: "#2563EB",
    securityScore: 84,
    securityAnalysis:
      "AssemblyAI is SOC 2 Type II and HIPAA-eligible. PII redaction available out of the box. Enterprise plan supports VPC deployment and BAA.",
    dataPrivacyNotes:
      "Audio is transcribed on AssemblyAI infrastructure; deletion controls and zero-retention available on enterprise plans.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },

  // ── Productivity (additional) ─────────────────────────────────────────────
  {
    slug: "glean",
    name: "Glean",
    tagline: "Enterprise AI work assistant grounded in your company's data",
    description:
      "Glean is an AI-powered enterprise search and work assistant that connects to 100+ workplace apps (Google Workspace, Slack, Confluence, Salesforce, Jira, GitHub) and lets employees ask questions grounded in their own company data. Glean Assistant adds a Claude/GPT-powered chat that respects per-user permissions and provides citations to source documents.",
    websiteUrl: "https://glean.com",
    logoUrl: "https://logo.clearbit.com/glean.com",
    categorySlug: "productivity",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise only — custom pricing, typically per-seat for orgs of 100+ employees.",
    launchedYear: 2019,
    roles: ["product-manager", "operations-manager", "support-agent", "sales-professional", "researcher"],
    tags: ["enterprise-search", "rag", "permission-aware", "knowledge-management", "assistant"],
    accentColor: "#0EA5E9",
    securityScore: 90,
    securityAnalysis:
      "Glean is SOC 2 Type II, ISO 27001, and HIPAA certified. Permissions are enforced at query time so users only see content they have access to in source systems. Enterprise plan supports VPC deployment.",
    dataPrivacyNotes:
      "Indexed content stays within the customer's tenant; no training on customer data. EU data residency available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },

  // ── Research (additional) ─────────────────────────────────────────────────
  {
    slug: "humata-ai",
    name: "Humata",
    tagline: "Ask questions about any document or PDF",
    description:
      "Humata lets users upload PDFs, papers, or contracts and ask natural-language questions, with citations linking back to specific pages. Used by researchers, lawyers, and analysts to accelerate document review across long technical material.",
    websiteUrl: "https://humata.ai",
    logoUrl: "https://logo.clearbit.com/humata.ai",
    categorySlug: "research",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 60 pages, 10 questions/day. Student: $1.99/month. Pro: $14.99/month. Team: $99/month.",
    launchedYear: 2022,
    roles: ["researcher", "student", "legal-professional", "analyst"],
    tags: ["pdf-qa", "document-search", "citations", "research", "literature"],
    accentColor: "#10B981",
    securityScore: 68,
    securityAnalysis:
      "Humata uses third-party LLMs to process uploaded documents. Team plan offers private workspaces and DPA. No SOC 2 publicly listed.",
    dataPrivacyNotes:
      "Uploaded documents stored on Humata's infrastructure for the lifetime of the project. Pro plan: documents are not used to train models.",
    complianceBadges: ["GDPR"],
  },

  // ── Developer Platforms (additional) ──────────────────────────────────────
  {
    slug: "replicate",
    name: "Replicate",
    tagline: "Run open-source AI models with one HTTP call",
    description:
      "Replicate is a cloud platform for running open-source AI models (image, video, audio, language) behind a single API. Developers can deploy custom models packaged with Cog, version them, and pay only for the compute they use. Used heavily for production deployments of FLUX, Whisper, Llama, Stable Diffusion, and bespoke fine-tunes.",
    websiteUrl: "https://replicate.com",
    logoUrl: "https://logo.clearbit.com/replicate.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Pay-per-second compute (e.g. ~$0.000725/sec on Nvidia A100). Free trial credits for new accounts.",
    launchedYear: 2019,
    roles: ["developer", "data-scientist"],
    tags: ["open-source-models", "api", "cog", "deployment", "gpu"],
    accentColor: "#000000",
    securityScore: 78,
    securityAnalysis:
      "Replicate is SOC 2 Type II certified. Inference runs in isolated containers; deployments support private models and dedicated endpoints on Enterprise plans.",
    dataPrivacyNotes:
      "Inputs and outputs may be retained for short windows for debugging; private deployments support zero-retention.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "groq",
    name: "Groq",
    tagline: "Ultra-fast inference for open-weight LLMs",
    description:
      "Groq runs open-weight LLMs (Llama, Mixtral, Qwen, DeepSeek) on its custom LPU hardware, delivering output speeds that consistently top public benchmarks at hundreds of tokens per second. Used to power voice agents, real-time copilots, and high-throughput batch inference where latency matters more than the absolute frontier.",
    websiteUrl: "https://groq.com",
    logoUrl: "https://logo.clearbit.com/groq.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier with rate limits. Developer: pay-per-token (e.g. Llama 3.1 70B at $0.59/1M input). Enterprise: dedicated capacity.",
    launchedYear: 2016,
    roles: ["developer", "data-scientist"],
    tags: ["fast-inference", "lpu", "open-weights", "llm-api", "real-time"],
    accentColor: "#F55036",
    securityScore: 80,
    securityAnalysis:
      "Groq is SOC 2 Type II certified. GroqCloud Enterprise supports dedicated tenants and BAA. Inputs/outputs not used for model training.",
    dataPrivacyNotes:
      "API traffic processed in Groq's infrastructure with short retention for abuse detection. Enterprise: zero-retention available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "together-ai",
    name: "Together AI",
    tagline: "Inference, fine-tuning, and training for open-source LLMs",
    description:
      "Together AI offers fast, low-cost inference for 200+ open-source LLMs, plus fine-tuning, training clusters, and dedicated endpoints. Popular for teams that want frontier-class quality on open weights with predictable per-token pricing and the option to fine-tune on proprietary data without sharing it with closed-model providers.",
    websiteUrl: "https://together.ai",
    logoUrl: "https://logo.clearbit.com/together.ai",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free credits on signup. Inference pay-per-token. Dedicated endpoints from $0.84/hour. Training clusters: custom.",
    launchedYear: 2022,
    roles: ["developer", "data-scientist", "researcher"],
    tags: ["open-source-llm", "inference", "fine-tuning", "training", "gpu-cluster"],
    accentColor: "#0F766E",
    securityScore: 82,
    securityAnalysis:
      "Together is SOC 2 Type II certified. Dedicated endpoints offer single-tenant deployments. Fine-tuned weights remain customer property.",
    dataPrivacyNotes:
      "Shared inference: prompts not used for training. Dedicated endpoints: full isolation. Enterprise: BAA and DPA available.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },
  {
    slug: "modal",
    name: "Modal",
    tagline: "Serverless cloud for AI, ML, and data workloads",
    description:
      "Modal is a serverless platform for running AI inference, training, batch jobs, and web endpoints from Python — no Docker, no Kubernetes. It provides instant access to GPUs, autoscaling, persistent volumes, and scheduled jobs. Popular for teams shipping custom AI features, fine-tuning loops, and high-throughput batch pipelines.",
    websiteUrl: "https://modal.com",
    logoUrl: "https://logo.clearbit.com/modal.com",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: $30/month in compute. Starter: usage-based. Team: $250/month minimum + usage. Enterprise: custom.",
    launchedYear: 2021,
    roles: ["developer", "data-scientist"],
    tags: ["serverless", "gpu", "python", "ml-infra", "batch"],
    accentColor: "#7FEE64",
    securityScore: 82,
    securityAnalysis:
      "Modal is SOC 2 Type II certified with HIPAA support on Enterprise. Workloads run in isolated firecracker microVMs; secrets are managed natively.",
    dataPrivacyNotes:
      "Customer code and data executed on Modal infrastructure. Enterprise plans provide regional isolation and custom data handling.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },

  // ── Data & Analytics (additional) ─────────────────────────────────────────
  {
    slug: "thoughtspot",
    name: "ThoughtSpot",
    tagline: "AI-powered analytics with natural-language search",
    description:
      "ThoughtSpot is a search-driven analytics platform whose Sage AI lets non-technical users ask data questions in natural language and get charts grounded in governed datasets. It connects to Snowflake, BigQuery, Databricks, and Redshift, generates SQL under the hood, and embeds dashboards into apps via SpotApps and the Embed SDK.",
    websiteUrl: "https://thoughtspot.com",
    logoUrl: "https://logo.clearbit.com/thoughtspot.com",
    categorySlug: "data-analytics",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 5 users on a sample dataset. Team: $1,250/month. Pro: $2,500/month. Enterprise: custom.",
    launchedYear: 2012,
    roles: ["analyst", "data-scientist", "product-manager", "operations-manager"],
    tags: ["bi", "natural-language", "embedded-analytics", "warehouse", "search-analytics"],
    accentColor: "#1F2937",
    securityScore: 86,
    securityAnalysis:
      "ThoughtSpot is SOC 2 Type II, ISO 27001, and HIPAA-eligible. Enterprise plan supports VPC deployment and row-level security tied to the underlying warehouse.",
    dataPrivacyNotes:
      "Data stays in your warehouse; ThoughtSpot only queries it. Sage AI is grounded with metadata, not raw row data, where possible.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },

  // ── Presentations ─────────────────────────────────────────────────────────
  {
    slug: "gamma",
    name: "Gamma",
    tagline: "Generate beautiful presentations, docs, and sites from a prompt",
    description:
      "Gamma turns a prompt or document outline into a polished presentation, doc, or webpage in seconds. It mixes generative layout with editable templates, supports brand kits, image generation, and one-click publishing. Used by founders, marketers, and consultants who need decks fast without fighting PowerPoint.",
    websiteUrl: "https://gamma.app",
    logoUrl: "https://logo.clearbit.com/gamma.app",
    categorySlug: "presentations",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 400 credits. Plus: $10/month. Pro: $20/month. Business: $25/user/month.",
    launchedYear: 2020,
    roles: ["entrepreneur", "marketer", "product-manager", "educator", "sales-professional"],
    tags: ["slides", "presentation", "brand-kit", "templates", "generative-design"],
    accentColor: "#A855F7",
    securityScore: 72,
    securityAnalysis:
      "Gamma is SOC 2 Type II certified and GDPR compliant. Business plan adds SSO and admin controls. Public-by-default sharing — review settings before posting sensitive decks.",
    dataPrivacyNotes:
      "Decks and prompts stored on Gamma's servers. Pro/Business: content not used for model training.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "tome",
    name: "Tome",
    tagline: "AI assistant for sales — research, prep, and outreach",
    description:
      "Tome pivoted from AI presentations to a sales AI assistant in October 2024 (Tome Slides was sunset in early 2025). The current product handles account research, meeting prep, and personalised outreach for sales teams, pulling context from CRM systems and synthesising it into pitch-ready briefs. The original presentation-generation surface is retained mainly as a thin output layer.",
    websiteUrl: "https://tome.app",
    logoUrl: "https://logo.clearbit.com/tome.app",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier. Pro: $20/month. Sales Intelligence and Enterprise tiers custom-priced.",
    launchedYear: 2022,
    roles: ["sales-professional", "marketer", "product-manager", "entrepreneur"],
    tags: ["sales-research", "account-prep", "outreach", "crm", "pivoted-from-presentations"],
    accentColor: "#0EA5E9",
    securityScore: 70,
    securityAnalysis:
      "Tome is SOC 2 Type II certified. Sales tier integrates with Salesforce/HubSpot under read-only OAuth. Decks default to private; explicit sharing required.",
    dataPrivacyNotes:
      "Generated decks and prompts retained on Tome's infrastructure. Sales tier supports DPA and zero-retention.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "beautiful-ai",
    name: "Beautiful.ai",
    tagline: "Smart slide templates that design themselves",
    description:
      "Beautiful.ai uses design rules and AI to keep slides on-brand as you type. Its DesignerBot generates entire decks from a prompt, while the platform's smart templates auto-format charts, lists, and headlines. Used by sales, marketing, and exec teams for repeatable on-brand presentations.",
    websiteUrl: "https://beautiful.ai",
    logoUrl: "https://logo.clearbit.com/beautiful.ai",
    categorySlug: "presentations",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Pro: $12/month. Team: $40/user/month. Enterprise: custom.",
    launchedYear: 2017,
    roles: ["marketer", "sales-professional", "product-manager", "operations-manager"],
    tags: ["slides", "smart-templates", "designerbot", "brand", "team"],
    accentColor: "#FB7185",
    securityScore: 76,
    securityAnalysis:
      "Beautiful.ai is SOC 2 Type II certified. Team plan includes SSO and central brand controls. Decks are private by default; sharing is explicit.",
    dataPrivacyNotes:
      "Decks and brand assets stored on Beautiful.ai's infrastructure. Team/Enterprise: DPA and admin auditing available.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Meeting Assistants ────────────────────────────────────────────────────
  {
    slug: "granola",
    name: "Granola",
    tagline: "AI notepad that turns your meeting notes into great notes",
    description:
      "Granola is a meeting notepad designed for back-to-back call days. Instead of joining as a bot, it transcribes locally on macOS and rewrites your rough notes into structured, shareable summaries. Templates support sales calls, 1:1s, customer interviews, and standups, and outputs sync to Notion, Linear, Slack, and CRMs.",
    websiteUrl: "https://granola.ai",
    logoUrl: "https://logo.clearbit.com/granola.ai",
    categorySlug: "meeting-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 25 meetings. Individual: $18/month. Business: $25/user/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["product-manager", "sales-professional", "operations-manager", "entrepreneur"],
    tags: ["notetaker", "macos", "transcription", "templates", "1-on-1"],
    accentColor: "#16A34A",
    securityScore: 80,
    securityAnalysis:
      "Granola transcribes on-device by default; cleanup uses cloud LLMs. SOC 2 Type II certified. Business plan adds SSO and admin controls.",
    dataPrivacyNotes:
      "Audio is processed locally; only text is sent to LLMs. Enterprise: DPA, zero-retention with model providers.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "fathom",
    name: "Fathom",
    tagline: "Free AI meeting assistant for Zoom, Meet, and Teams",
    description:
      "Fathom records, transcribes, and summarises your video calls and pushes structured notes and action items into your CRM. It is widely used because the core product is free for individual users; paid tiers add team analytics, advanced CRM sync, and call coaching. Strong default integration set across Salesforce, HubSpot, Slack, and Notion.",
    websiteUrl: "https://fathom.video",
    logoUrl: "https://logo.clearbit.com/fathom.video",
    categorySlug: "meeting-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free for individuals. Premium: $19/user/month. Team Edition: $32/user/month. Enterprise: custom.",
    launchedYear: 2020,
    roles: ["sales-professional", "product-manager", "operations-manager", "support-agent"],
    tags: ["zoom", "google-meet", "teams", "crm-sync", "free"],
    accentColor: "#7C3AED",
    securityScore: 84,
    securityAnalysis:
      "Fathom is SOC 2 Type II certified, GDPR and HIPAA compliant. Recordings encrypted in transit and at rest. Team plan includes SSO and granular admin controls.",
    dataPrivacyNotes:
      "Recordings and transcripts stored on Fathom's infrastructure with configurable retention. No training on customer data.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },
  {
    slug: "read-ai",
    name: "Read AI",
    tagline: "Meeting, email, and message copilot with engagement analytics",
    description:
      "Read AI provides AI summaries and engagement analytics across meetings, email threads, and chat. Beyond transcription, it scores sentiment, attention, and meeting effectiveness, surfaces follow-ups across tools, and helps managers understand how their orgs communicate.",
    websiteUrl: "https://read.ai",
    logoUrl: "https://logo.clearbit.com/read.ai",
    categorySlug: "meeting-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 5 meetings/month. Pro: $19.75/month. Enterprise: $29.75/user/month.",
    launchedYear: 2021,
    roles: ["operations-manager", "product-manager", "sales-professional", "recruiter"],
    tags: ["meeting-analytics", "email-summary", "engagement", "zoom", "outlook"],
    accentColor: "#F97316",
    securityScore: 76,
    securityAnalysis:
      "Read AI is SOC 2 Type II certified. Enterprise plan adds SSO, role-based access, and DPA. Engagement analytics raise privacy considerations — review with legal/HR before company-wide rollout.",
    dataPrivacyNotes:
      "Recordings and analytics stored on Read AI's infrastructure. Enterprise: configurable retention and admin controls.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Sales & Marketing ─────────────────────────────────────────────────────
  {
    slug: "clay",
    name: "Clay",
    tagline: "AI-driven prospecting and data enrichment for GTM teams",
    description:
      "Clay combines 100+ data providers, AI research agents, and a spreadsheet-style canvas to build hyper-personalised outbound campaigns. RevOps and growth teams use it to enrich leads, run AI research at scale, write personalised first lines, and orchestrate multi-step workflows into Salesforce, HubSpot, and outbound tools.",
    websiteUrl: "https://clay.com",
    logoUrl: "https://logo.clearbit.com/clay.com",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100 credits/month. Starter: $134/month. Explorer: $314/month. Pro: $720/month. Enterprise: custom.",
    launchedYear: 2017,
    roles: ["sales-professional", "marketer", "operations-manager"],
    tags: ["prospecting", "enrichment", "outbound", "data-providers", "spreadsheet"],
    accentColor: "#A855F7",
    securityScore: 78,
    securityAnalysis:
      "Clay is SOC 2 Type II certified. Enterprise plan includes SSO, audit logs, and DPA. AI research uses third-party LLM providers under zero-retention agreements.",
    dataPrivacyNotes:
      "Workflow data stored on Clay's infrastructure. Customer prospect lists are not used to train models.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "lavender",
    name: "Lavender",
    tagline: "AI email coach for sales teams",
    description:
      "Lavender is a sales email coach that scores drafts in real time, suggests rewrites, and pulls prospect context from LinkedIn, news, and CRM. Reps get inline feedback on tone, length, and personalisation before they hit send; managers see team-level analytics on what wins replies.",
    websiteUrl: "https://lavender.ai",
    logoUrl: "https://logo.clearbit.com/lavender.ai",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Basic: free. Starter: $29/user/month. Pro: $49/user/month. Teams: custom.",
    launchedYear: 2020,
    roles: ["sales-professional", "marketer"],
    tags: ["sales-email", "coaching", "personalisation", "outbound", "gmail"],
    accentColor: "#8B5CF6",
    securityScore: 74,
    securityAnalysis:
      "Lavender is SOC 2 Type II certified. Browser extension reads only the active email composer; OAuth-scoped data access. Teams plan adds SSO and DPA.",
    dataPrivacyNotes:
      "Email drafts processed via LLM providers under zero-retention agreements. Customer email content not used for training.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "11x",
    name: "11x",
    tagline: "Autonomous AI sales reps that prospect and book meetings",
    description:
      "11x deploys autonomous \"AI workers\" — Alice (SDR) and Mike (voice) — that find prospects, run multichannel outbound, qualify leads, and book meetings on a human rep's behalf. Built for revenue teams that want to scale outbound without proportionally scaling headcount.",
    websiteUrl: "https://11x.ai",
    logoUrl: "https://logo.clearbit.com/11x.ai",
    categorySlug: "sales-marketing",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise pricing — custom annual contracts based on volume of leads.",
    launchedYear: 2023,
    roles: ["sales-professional", "operations-manager", "entrepreneur"],
    tags: ["ai-sdr", "autonomous", "voice-agent", "outbound", "multichannel"],
    accentColor: "#0F172A",
    securityScore: 70,
    securityAnalysis:
      "11x is SOC 2 Type II certified. AI agents act on customer infrastructure with scoped tokens; all outbound is logged and reviewable. Strong human-in-the-loop guardrails advised given autonomous outreach.",
    dataPrivacyNotes:
      "Prospect data and CRM content processed on 11x infrastructure. Enterprise: DPA, dedicated tenants available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "apollo-ai",
    name: "Apollo.io",
    tagline: "End-to-end sales platform with AI-assisted workflows",
    description:
      "Apollo.io combines a 275M+ contact database, sequencing, dialing, and analytics into one platform. Its AI features include AI Power-ups (research and personalisation), AI assistants for email writing, and conversation intelligence for calls. Widely used by SMB and mid-market sales teams as a Salesloft/Outreach + ZoomInfo alternative.",
    websiteUrl: "https://apollo.io",
    logoUrl: "https://logo.clearbit.com/apollo.io",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100 credits/month. Basic: $59/user/month. Professional: $99/user/month. Organization: $149/user/month.",
    launchedYear: 2015,
    roles: ["sales-professional", "marketer", "operations-manager"],
    tags: ["sales-platform", "data-provider", "sequencing", "dialer", "conversation-intel"],
    accentColor: "#2563EB",
    securityScore: 78,
    securityAnalysis:
      "Apollo is SOC 2 Type II certified, GDPR and CCPA compliant. Enterprise (Organization) plan adds SSO and audit logs. Contact data sourcing has been the subject of GDPR scrutiny — review usage policies.",
    dataPrivacyNotes:
      "Customer CRM data and call recordings processed on Apollo's infrastructure. EU data residency available on Organization plan.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "hubspot-breeze",
    name: "HubSpot Breeze",
    tagline: "AI copilot, agents, and intelligence built into HubSpot CRM",
    description:
      "Breeze is HubSpot's family of AI features spanning a Copilot (in-app assistant), Agents (prospecting, social, customer support), and Intelligence (data enrichment and scoring). It runs natively on HubSpot CRM data, letting marketing, sales, and service teams automate research, drafting, and lead qualification without leaving the platform.",
    websiteUrl: "https://hubspot.com/products/artificial-intelligence",
    logoUrl: "https://logo.clearbit.com/hubspot.com",
    categorySlug: "sales-marketing",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free CRM tier with limited Breeze features. Marketing/Sales/Service Hubs from $20/user/month. Enterprise: custom.",
    launchedYear: 2024,
    roles: ["marketer", "sales-professional", "support-agent", "operations-manager"],
    tags: ["crm", "ai-agents", "copilot", "marketing-automation", "service"],
    accentColor: "#FF7A59",
    securityScore: 86,
    securityAnalysis:
      "HubSpot is SOC 2 Type II, ISO 27001/27018, and HIPAA-eligible on Enterprise. Breeze AI features inherit HubSpot's security controls; AI processing has zero data retention with model providers.",
    dataPrivacyNotes:
      "CRM data stays in HubSpot; only minimal context is sent to LLMs for AI features. EU data residency available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },

  // ── Customer Support ──────────────────────────────────────────────────────
  {
    slug: "intercom-fin",
    name: "Intercom Fin",
    tagline: "AI agent that resolves customer support conversations",
    description:
      "Fin is Intercom's AI customer support agent. It reads your help centre, past conversations, and connected systems, then resolves up to 70% of inbound questions via chat, email, and phone — handing off to humans only when needed. Pricing is outcomes-based: customers pay per resolved conversation rather than per seat.",
    websiteUrl: "https://intercom.com/fin",
    logoUrl: "https://logo.clearbit.com/intercom.com",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "$0.99 per resolved conversation, on top of an Intercom plan ($29+/seat/month). Enterprise: custom volume pricing.",
    launchedYear: 2023,
    roles: ["support-agent", "operations-manager", "product-manager"],
    tags: ["ai-agent", "deflection", "help-center", "outcome-pricing", "omnichannel"],
    accentColor: "#1F2937",
    securityScore: 86,
    securityAnalysis:
      "Intercom is SOC 2 Type II, ISO 27001, GDPR, and HIPAA-eligible. Fin uses retrieval-augmented generation grounded in customer-provided sources and supports content guardrails.",
    dataPrivacyNotes:
      "Customer conversation data not used to train shared models. EU data residency available. DPA included on Pro+ plans.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },
  {
    slug: "decagon",
    name: "Decagon",
    tagline: "Generative AI agents for customer experience",
    description:
      "Decagon builds enterprise AI customer-support agents grounded in policies, knowledge bases, and operational systems. It supports chat, email, voice, and SMS, with action-taking capabilities (refunds, returns, account changes) governed by guardrails. Used by consumer brands and fintechs replacing first-line tier-1 support.",
    websiteUrl: "https://decagon.ai",
    logoUrl: "https://logo.clearbit.com/decagon.ai",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise only — custom pricing typically based on conversation volume.",
    launchedYear: 2023,
    roles: ["support-agent", "operations-manager"],
    tags: ["ai-agent", "voice", "actions", "knowledge-base", "enterprise"],
    accentColor: "#0EA5E9",
    securityScore: 84,
    securityAnalysis:
      "Decagon is SOC 2 Type II certified with HIPAA available. Agents operate under explicit policy guardrails and full conversation logging for audit. PII handling tunable per integration.",
    dataPrivacyNotes:
      "Customer data processed in dedicated tenants. No training on customer conversations. DPA provided.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA"],
  },
  {
    slug: "ada-cx",
    name: "Ada",
    tagline: "AI customer service automation platform",
    description:
      "Ada is an enterprise AI customer service platform with a no-code agent builder, multilingual support across 50+ languages, and integrations into Zendesk, Salesforce, Shopify, and custom backends. Its Reasoning Engine grounds answers in connected knowledge while letting non-engineers configure flows and guardrails.",
    websiteUrl: "https://ada.cx",
    logoUrl: "https://logo.clearbit.com/ada.cx",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise only — custom pricing based on automated resolutions.",
    launchedYear: 2014,
    roles: ["support-agent", "operations-manager", "marketer"],
    tags: ["chatbot", "multilingual", "no-code", "zendesk", "salesforce"],
    accentColor: "#6D28D9",
    securityScore: 86,
    securityAnalysis:
      "Ada is SOC 2 Type II, ISO 27001, GDPR, HIPAA, and PCI DSS aligned. Enterprise plan supports VPC deployment, SSO, and granular role-based access.",
    dataPrivacyNotes:
      "Customer conversations processed within Ada's tenant; no training on customer data. Regional data residency available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },

  // ── Education & Learning ──────────────────────────────────────────────────
  {
    slug: "khanmigo",
    name: "Khanmigo",
    tagline: "Khan Academy's AI tutor for students and teachers",
    description:
      "Khanmigo is Khan Academy's AI tutor and teaching assistant powered by GPT-4. For students it gives Socratic-style hints rather than answers; for teachers it generates lesson plans, rubrics, and student-progress summaries. Available free for U.S. K-12 districts via Khan Academy's nonprofit programme.",
    websiteUrl: "https://khanmigo.ai",
    logoUrl: "https://logo.clearbit.com/khanacademy.org",
    categorySlug: "education",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free for U.S. teachers and many districts. Khanmigo for Families: $4/month or $44/year. Districts: custom.",
    launchedYear: 2023,
    roles: ["educator", "student"],
    tags: ["tutor", "k-12", "math", "socratic", "lesson-plans"],
    accentColor: "#14BF96",
    securityScore: 84,
    securityAnalysis:
      "Khan Academy is a 501(c)(3) nonprofit with FERPA, COPPA, and SOPIPA-aligned policies for student data. Khanmigo conversations are monitored for safety; the system is designed for under-18 use.",
    dataPrivacyNotes:
      "Student conversations used for safety review and product improvement; not sold to advertisers. Districts can negotiate FERPA-aligned DPAs.",
    complianceBadges: ["FERPA", "COPPA", "GDPR"],
  },
  {
    slug: "magicschool",
    name: "MagicSchool",
    tagline: "AI platform for teachers, schools, and students",
    description:
      "MagicSchool gives teachers 80+ AI tools for lesson planning, IEPs, rubrics, differentiated assignments, and parent communication. It also offers a moderated student experience (MagicStudent) with strict guardrails. Used by 5,000+ schools across the U.S. and beyond.",
    websiteUrl: "https://magicschool.ai",
    logoUrl: "https://logo.clearbit.com/magicschool.ai",
    categorySlug: "education",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free for individual educators (limited tools). Plus: $99.96/year. Schools/Districts: custom per-seat.",
    launchedYear: 2023,
    roles: ["educator", "student"],
    tags: ["lesson-planning", "k-12", "ieps", "rubrics", "guardrails"],
    accentColor: "#F472B6",
    securityScore: 82,
    securityAnalysis:
      "MagicSchool is SOC 2 Type II certified, FERPA, COPPA, and SOPIPA aligned. Student tier has additional content filters and prevents misuse for academic dishonesty.",
    dataPrivacyNotes:
      "Student data not used to train models or sold. School DPAs and data residency available on enterprise plans.",
    complianceBadges: ["SOC2", "GDPR", "FERPA", "COPPA"],
  },
  {
    slug: "duolingo-max",
    name: "Duolingo Max",
    tagline: "AI-powered language learning with personalised tutoring",
    description:
      "Duolingo Max is the GPT-4-powered tier of Duolingo. It introduces Roleplay (open-ended chat with AI characters), Explain My Answer (personalised feedback on mistakes), and Video Call (real-time conversation with an AI character). Designed to bridge structured drills and real-world conversation practice.",
    websiteUrl: "https://duolingo.com/max",
    logoUrl: "https://logo.clearbit.com/duolingo.com",
    categorySlug: "education",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Duolingo Max: $29.99/month or $167.99/year (rolls up Super features plus AI). Family plan available.",
    launchedYear: 2023,
    roles: ["student", "educator"],
    tags: ["language-learning", "roleplay", "voice-tutor", "personalisation", "consumer"],
    accentColor: "#58CC02",
    securityScore: 80,
    securityAnalysis:
      "Duolingo is GDPR, CCPA, and COPPA-aligned. AI features run on third-party LLMs under enterprise agreements. Conversations are stored to power streaks, achievements, and quality monitoring.",
    dataPrivacyNotes:
      "Conversation transcripts retained for product improvement; not used to train external models.",
    complianceBadges: ["GDPR", "COPPA"],
  },

  // ── Legal ─────────────────────────────────────────────────────────────────
  {
    slug: "harvey",
    name: "Harvey",
    tagline: "Generative AI built for elite law firms and in-house teams",
    description:
      "Harvey is an enterprise AI platform for legal work. It supports drafting, contract analysis, due diligence, regulatory research, and litigation support across multiple jurisdictions. Backed by partnerships with leading law firms (Allen & Overy, PwC) and OpenAI, Harvey is built specifically for the precision and confidentiality demands of law.",
    websiteUrl: "https://harvey.ai",
    logoUrl: "https://logo.clearbit.com/harvey.ai",
    categorySlug: "legal",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise only — custom annual contracts; not generally available to small firms.",
    launchedYear: 2022,
    roles: ["legal-professional", "researcher"],
    tags: ["law", "contract-analysis", "due-diligence", "litigation", "enterprise"],
    accentColor: "#1E293B",
    securityScore: 90,
    securityAnalysis:
      "Harvey is SOC 2 Type II, ISO 27001, and ISO 27018 certified. Customer matter data is never used for training. Per-firm tenants and strict access controls suitable for privileged work.",
    dataPrivacyNotes:
      "All matter data stored in dedicated tenants. DPA, BAA, and regional data residency available.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "spellbook",
    name: "Spellbook",
    tagline: "AI contract drafting and review inside Microsoft Word",
    description:
      "Spellbook is a Microsoft Word add-in for transactional lawyers that drafts and reviews contracts using GPT-4. It suggests redlines, flags missing clauses, identifies risks, and writes clauses on demand grounded in a precedent library. Designed for fast adoption — installs as a Word ribbon, no separate workspace.",
    websiteUrl: "https://spellbook.legal",
    logoUrl: "https://logo.clearbit.com/spellbook.legal",
    categorySlug: "legal",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails: "Solo: $99/user/month. Team: $169/user/month. Enterprise: custom.",
    launchedYear: 2022,
    roles: ["legal-professional"],
    tags: ["contract-drafting", "word-addin", "redlines", "transactional", "precedents"],
    accentColor: "#7C3AED",
    securityScore: 86,
    securityAnalysis:
      "Spellbook is SOC 2 Type II certified. Documents processed under enterprise OpenAI agreement with zero data retention. Enterprise plan adds SSO and DPA.",
    dataPrivacyNotes:
      "Document content not used to train models. Matter content can be deleted on demand; configurable retention.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Finance & Accounting ──────────────────────────────────────────────────
  {
    slug: "vic-ai",
    name: "Vic.ai",
    tagline: "AI-driven accounts payable automation",
    description:
      "Vic.ai automates AP from invoice capture through approvals and posting. Its models read invoices with high accuracy, learn each company's coding rules over time, and reduce manual touches. Integrates with Sage Intacct, NetSuite, QuickBooks, Microsoft Dynamics, and Workday.",
    websiteUrl: "https://vic.ai",
    logoUrl: "https://logo.clearbit.com/vic.ai",
    categorySlug: "finance-accounting",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise only — custom pricing based on invoice volume.",
    launchedYear: 2017,
    roles: ["finance-professional", "operations-manager"],
    tags: ["accounts-payable", "invoice-automation", "erp", "ocr", "approvals"],
    accentColor: "#1E40AF",
    securityScore: 86,
    securityAnalysis:
      "Vic.ai is SOC 2 Type II certified. Customer invoice data is processed in isolated tenants with role-based access. Enterprise plan supports SSO and audit logs.",
    dataPrivacyNotes:
      "Invoice data not used to train shared models. Per-tenant learning. EU data residency available.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "finchat",
    name: "FinChat",
    tagline: "AI research copilot for stock and equity analysis",
    description:
      "FinChat is a financial research platform that combines fundamental data, charts, and an AI assistant trained on 100,000+ public companies. Analysts and individual investors use it to summarise earnings calls, compare KPIs, and ask questions like \"how has gross margin trended for cloud names since 2020?\" with cited sources.",
    websiteUrl: "https://finchat.io",
    logoUrl: "https://logo.clearbit.com/finchat.io",
    categorySlug: "finance-accounting",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: limited queries. Plus: $35/month. Pro: $79/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["finance-professional", "analyst", "researcher"],
    tags: ["equity-research", "earnings", "kpi", "charting", "citations"],
    accentColor: "#0EA5E9",
    securityScore: 76,
    securityAnalysis:
      "FinChat is SOC 2 Type II certified. Customer queries and watchlists stored on FinChat infrastructure. Enterprise plan supports SSO and DPA.",
    dataPrivacyNotes:
      "Public market data sourced from licensed providers. Queries not used for model training. EU data residency available on Enterprise.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "pilot",
    name: "Pilot",
    tagline: "AI-augmented bookkeeping, tax, and CFO services",
    description:
      "Pilot delivers full-service bookkeeping, tax, and fractional CFO support augmented by AI. Its software automates transaction categorisation, reconciliations, and reporting; human accountants oversee the books and provide strategic advice. Used by venture-backed startups and SMBs across the U.S.",
    websiteUrl: "https://pilot.com",
    logoUrl: "https://logo.clearbit.com/pilot.com",
    categorySlug: "finance-accounting",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Bookkeeping: from $499/month based on monthly expenses. Tax: from $2,450/year. CFO services: custom.",
    launchedYear: 2017,
    roles: ["finance-professional", "entrepreneur", "operations-manager"],
    tags: ["bookkeeping", "tax", "cfo", "startups", "managed-service"],
    accentColor: "#F97316",
    securityScore: 84,
    securityAnalysis:
      "Pilot is SOC 2 Type II certified, encrypts data in transit and at rest, and uses role-based access for staff accountants. Customer financial data handled under strict access controls.",
    dataPrivacyNotes:
      "Customer financials accessed only by assigned Pilot staff and tools. Data retained under engagement terms; deletable on offboarding.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── Security & Compliance ─────────────────────────────────────────────────
  {
    slug: "vanta-ai",
    name: "Vanta",
    tagline: "AI-driven trust and compliance automation",
    description:
      "Vanta automates SOC 2, ISO 27001, HIPAA, GDPR, and 25+ other frameworks. Its AI features include Vanta AI for control mapping, evidence collection, and questionnaire automation — drafting answers to security reviews from your existing policies and reducing manual work for security and GRC teams.",
    websiteUrl: "https://vanta.com",
    logoUrl: "https://logo.clearbit.com/vanta.com",
    categorySlug: "security-compliance",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Core: from $7,500/year. Growth and Enterprise tiers add additional frameworks and AI features.",
    launchedYear: 2018,
    roles: ["security-engineer", "operations-manager", "entrepreneur"],
    tags: ["compliance", "soc2", "iso27001", "questionnaire-ai", "grc"],
    accentColor: "#0EA5E9",
    securityScore: 92,
    securityAnalysis:
      "Vanta is SOC 2 Type II, ISO 27001, ISO 27017/27018 certified. AI features run on isolated infrastructure with zero retention; questionnaire AI grounded only in customer-provided policies.",
    dataPrivacyNotes:
      "Customer policy and evidence data processed in dedicated tenants. AI does not train on customer documents.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA"],
  },
  {
    slug: "snyk-deepcode",
    name: "Snyk DeepCode AI",
    tagline: "AI-powered SAST and code-fix automation",
    description:
      "Snyk DeepCode AI uses a hybrid of symbolic engines and LLMs to find and automatically fix vulnerabilities in code, open-source dependencies, containers, and IaC. It ships as the AI engine inside Snyk's developer security platform and integrates into IDEs, GitHub, GitLab, and Bitbucket.",
    websiteUrl: "https://snyk.io/platform/deepcode-ai",
    logoUrl: "https://logo.clearbit.com/snyk.io",
    categorySlug: "security-compliance",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free for individual developers and small teams. Team: $25/contributor/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["security-engineer", "developer"],
    tags: ["sast", "auto-fix", "vulnerability", "iac", "open-source"],
    accentColor: "#4C0EE9",
    securityScore: 90,
    securityAnalysis:
      "Snyk is SOC 2 Type II, ISO 27001, and ISO 27018 certified. DeepCode models run within Snyk's infrastructure; customer source code is not used to train the underlying models.",
    dataPrivacyNotes:
      "Code analysed in-process and discarded; AI fixes derived from non-customer training data. Enterprise: VPC and on-prem options.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001"],
  },
  {
    slug: "microsoft-security-copilot",
    name: "Microsoft Security Copilot",
    tagline: "Generative AI assistant for security operations",
    description:
      "Microsoft Security Copilot is a SecOps assistant that triages incidents, summarises threats, runs investigations across Microsoft Defender, Sentinel, Intune, Entra, and Purview, and produces incident reports. Charged via Security Compute Units (SCUs) provisioned in Azure.",
    websiteUrl: "https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    categorySlug: "security-compliance",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "$4/SCU/hour, billed via Azure. Typical deployments start at 1–3 SCUs (~$2,920–$8,760/month).",
    launchedYear: 2024,
    roles: ["security-engineer", "operations-manager"],
    tags: ["secops", "incident-response", "defender", "sentinel", "azure"],
    accentColor: "#0078D4",
    securityScore: 92,
    securityAnalysis:
      "Microsoft Security Copilot inherits the Microsoft 365 / Azure compliance posture (SOC 2, ISO 27001/27018, FedRAMP High, HIPAA). Data stays within tenant boundaries; no training on customer prompts.",
    dataPrivacyNotes:
      "Customer prompts and outputs not used for training. Regional data residency tied to Azure region selection.",
    complianceBadges: ["SOC2", "GDPR", "ISO27001", "HIPAA", "FedRAMP"],
  },

  // ── 3D & CAD ──────────────────────────────────────────────────────────────
  {
    slug: "spline",
    name: "Spline",
    tagline: "Collaborative 3D design tool with AI generation",
    description:
      "Spline is a browser-based 3D design tool used to build interactive scenes for websites, products, and games. Its AI features include text-to-3D generation, AI texturing, and a code-export pipeline. Designers use it as a 3D Figma equivalent, with real-time collaboration and embeddable scenes.",
    websiteUrl: "https://spline.design",
    logoUrl: "https://logo.clearbit.com/spline.design",
    categorySlug: "3d-cad",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 2 editors, public scenes. Super: $9/editor/month. Super Team: $14/editor/month.",
    launchedYear: 2020,
    roles: ["designer", "developer", "video-creator"],
    tags: ["3d-design", "browser", "collaboration", "text-to-3d", "interactive"],
    accentColor: "#A855F7",
    securityScore: 70,
    securityAnalysis:
      "Spline is GDPR-compliant. Public scenes are world-readable — Super tier is required for private projects. No SOC 2 publicly listed; review fit for enterprise use.",
    dataPrivacyNotes:
      "Scene data and assets stored on Spline infrastructure. AI generation routes through third-party model providers.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "meshy",
    name: "Meshy",
    tagline: "Text and image to high-quality 3D models",
    description:
      "Meshy generates production-ready 3D meshes from text prompts or reference images, with PBR textures and rigging support. Used by indie game developers, AR/VR creators, and product designers to skip the early modelling stage. Outputs export to GLB, FBX, OBJ, and USDZ for downstream tooling.",
    websiteUrl: "https://meshy.ai",
    logoUrl: "https://logo.clearbit.com/meshy.ai",
    categorySlug: "3d-cad",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 200 credits/month. Pro: $20/month. Max: $60/month. Studio: $120/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["designer", "video-creator", "developer"],
    tags: ["text-to-3d", "image-to-3d", "pbr", "game-assets", "ar-vr"],
    accentColor: "#F97316",
    securityScore: 68,
    securityAnalysis:
      "Meshy is GDPR-compliant. Generated assets are owned by the user under commercial-use terms. Public/private project visibility configurable per project.",
    dataPrivacyNotes:
      "Prompts, references, and generated meshes retained on Meshy infrastructure. Enterprise plan offers private deployments.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "luma-ai",
    name: "Luma AI (Dream Machine)",
    tagline: "Text- and image-to-video via Dream Machine",
    description:
      "Luma AI began with neural radiance fields for 3D capture, but the company has now centred its product line on Dream Machine — a text/image-to-video generator powered by the Ray2/Ray3 models. NeRF capture and Genie (text-to-3D) remain on the platform but Dream Machine is the flagship, putting Luma squarely in the video-generation race alongside Sora, Veo, Kling, and Seedance.",
    websiteUrl: "https://lumalabs.ai",
    logoUrl: "https://logo.clearbit.com/lumalabs.ai",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free credits. Paid plans roughly $9.99-$94.99/month. API: ~$0.32/megapixel usage-based.",
    launchedYear: 2021,
    roles: ["video-creator", "designer", "marketer"],
    tags: ["text-to-video", "dream-machine", "ray3", "nerf-legacy", "trending-2026"],
    accentColor: "#1E1B4B",
    securityScore: 70,
    securityAnalysis:
      "Luma is GDPR-compliant. API users retain ownership of generated content. Mobile capture sessions stored under user accounts.",
    dataPrivacyNotes:
      "Captures and generations retained on Luma infrastructure. Unlimited and API plans support private content; public sharing is opt-in.",
    complianceBadges: ["GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Code Assistants ──────────────────────────
  {
    slug: "zed",
    name: "Zed",
    tagline: "Rust-built, AI-native code editor",
    description:
      "Zed is a GPU-accelerated code editor written in Rust by the team behind Atom. Released 1.0 on April 29, 2026, it ships with a built-in agent panel, multi-buffer editing, real-time collaboration, and tight integration with frontier models. Personal mode supports BYOK for any provider; the Pro tier includes Zed-hosted models and prompt routing.",
    websiteUrl: "https://zed.dev",
    logoUrl: "https://logo.clearbit.com/zed.dev",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Personal: free (BYOK). Pro: $20/month (Zed-hosted models, $20 in token credits, 2-week trial). Business plan available.",
    launchedYear: 2023,
    roles: ["developer"],
    tags: ["code-editor", "rust", "gpu-accelerated", "agent-panel", "trending-2026"],
    accentColor: "#0FA5C9",
    securityScore: 72,
    securityAnalysis:
      "Zed's editor core is open source. Pro routes through Zed-hosted infrastructure with no-training pledges from underlying providers; Personal/BYOK keeps prompts within the user's chosen provider. Business plan adds DPA terms.",
    dataPrivacyNotes:
      "The editor is local. Pro mode sends prompts via Zed servers; BYOK avoids Zed-side retention.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "warp",
    name: "Warp",
    tagline: "Agentic terminal with native AI",
    description:
      "Warp is a modern terminal that pairs traditional shell commands with an agent that can plan, execute, and debug multi-step tasks across your local environment. Founded in 2020 with a public launch in 2022, the platform consolidated to a single Build tier in late 2025 and now positions itself as an 'agentic development environment' rather than a terminal alone.",
    websiteUrl: "https://www.warp.dev",
    logoUrl: "https://logo.clearbit.com/warp.dev",
    categorySlug: "code-assistants",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 75-150 AI credits/month. Build: $20/user/month (1,500 credits, BYOK supported). Business: $50/user/month.",
    launchedYear: 2022,
    roles: ["developer"],
    tags: ["terminal", "agentic-coding", "shell", "automation", "trending-2026"],
    accentColor: "#16A34A",
    securityScore: 73,
    securityAnalysis:
      "Warp is SOC 2 Type II certified. Commands and outputs can stay local; AI prompts are sent to Warp's infrastructure. Business tier adds DPA terms and admin controls.",
    dataPrivacyNotes:
      "Free/Build tiers may retain prompts unless privacy mode is enabled. Business: zero-retention agreement with model providers and BYOK options.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "factory-ai",
    name: "Factory",
    tagline: "Agent-native development with Droids",
    description:
      "Factory is an agent-native software development platform built around 'Droids' — autonomous coding agents that take a spec, plan changes across a repo, run tests, and open PRs. Series B in September 2025 ($50M) and a reported Series C in 2026 (~$1.5B valuation) positioned it as a leading enterprise SWE-agent vendor.",
    websiteUrl: "https://factory.ai",
    logoUrl: "https://logo.clearbit.com/factory.ai",
    categorySlug: "code-assistants",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Pay-as-you-go credits ($10 minimum). Team and Enterprise plans quote-based.",
    launchedYear: 2023,
    roles: ["developer"],
    tags: ["autonomous-agent", "droids", "enterprise", "swe-agent", "trending-2026"],
    accentColor: "#1E40AF",
    securityScore: 76,
    securityAnalysis:
      "Factory targets enterprise customers with SOC 2 Type II compliance. Repo access is scoped via OAuth; Droids run in isolated sandboxes. Audit logs are available on Enterprise.",
    dataPrivacyNotes:
      "Code touched by Droids is not used for training. Sandboxes destroyed after each run.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Automation / Agents ──────────────────────
  {
    slug: "genspark",
    name: "Genspark",
    tagline: "AI super-agent that researches, builds, and acts",
    description:
      "Genspark is an AI 'super agent' workspace combining deep research, document generation, web automation, and outbound phone calls into a single interface. Backed by a $275M Series B at $1.25B valuation in November 2025, the Super Agent product (April 2025) competes directly with Manus and OpenAI Operator.",
    websiteUrl: "https://www.genspark.ai",
    logoUrl: "https://logo.clearbit.com/genspark.ai",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 100-200 credits/day. Plus: $24.99/month (10,000 credits). Pro: $249.99/month.",
    launchedYear: 2024,
    roles: ["entrepreneur", "researcher", "marketer", "operations-manager"],
    tags: ["super-agent", "deep-research", "automation", "voice-actions", "trending-2026"],
    accentColor: "#F97316",
    securityScore: 70,
    securityAnalysis:
      "Genspark provides standard SaaS controls. Enterprise contracts include DPAs; Super Agent actions are logged for replay and audit.",
    dataPrivacyNotes:
      "Free tier conversations may be reviewed for quality. Pro and Enterprise plans support data retention controls.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "manus",
    name: "Manus",
    tagline: "Autonomous general-purpose AI agent",
    description:
      "Manus is an autonomous general-purpose AI agent from Butterfly Effect that completes complex multi-step tasks — research reports, spreadsheets, app prototypes — with minimal supervision. Meta announced an acquisition in December 2025, but it was blocked by China's NDRC in April 2026 and Manus remains independent.",
    websiteUrl: "https://manus.im",
    logoUrl: "https://logo.clearbit.com/manus.im",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: ~300 daily credits + 1,000 signup credits. Paid tiers reportedly $39-$199/month (verify on the live site).",
    launchedYear: 2025,
    roles: ["entrepreneur", "researcher", "analyst", "operations-manager"],
    tags: ["autonomous-agent", "multi-step", "browser-automation", "trending-2026"],
    accentColor: "#7C3AED",
    securityScore: 65,
    securityAnalysis:
      "Manus runs tasks in isolated cloud sandboxes. Standard SaaS protections apply; enterprise security details are not yet broadly published. Tasks involving credentials should use scoped, ephemeral access.",
    dataPrivacyNotes:
      "Conversations and task artifacts are stored under the user's account. Free-tier usage may inform model improvements.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "letta",
    name: "Letta",
    tagline: "Stateful agent framework with long-term memory",
    description:
      "Letta (formerly MemGPT) is an open-source framework for building stateful AI agents with persistent memory hierarchies — agents that remember previous conversations and learn over time. Spun out of UC Berkeley with $10M seed funding; Letta Code launched in April 2026 to bring stateful agents into IDE workflows.",
    websiteUrl: "https://www.letta.com",
    logoUrl: "https://logo.clearbit.com/letta.com",
    categorySlug: "automation",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Framework: Apache-licensed open source. Letta Cloud: free tier; paid plans from ~$20/month.",
    launchedYear: 2024,
    roles: ["developer", "data-scientist"],
    tags: ["agent-framework", "memory", "open-source", "memgpt", "trending-2026"],
    accentColor: "#0891B2",
    securityScore: 70,
    securityAnalysis:
      "Open-source framework can be self-hosted with full control. Letta Cloud applies standard SaaS controls; enterprise SOC 2 in progress per company communications.",
    dataPrivacyNotes:
      "Self-hosted deployments retain all data on customer infrastructure. Cloud accounts isolate per-tenant memory state.",
    complianceBadges: ["GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Customer Support ─────────────────────────
  {
    slug: "sierra",
    name: "Sierra",
    tagline: "Enterprise AI agents for customer experience",
    description:
      "Sierra builds branded conversational AI agents for enterprise customer experience. Founded by Bret Taylor (ex-Salesforce co-CEO) and Clay Bavor (ex-Google), the company raised $950M at a $15B valuation in May 2026 with a reported ~$150M ARR. Pricing is outcomes-based — customers pay per resolved interaction rather than per seat.",
    websiteUrl: "https://sierra.ai",
    logoUrl: "https://logo.clearbit.com/sierra.ai",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Outcomes-based: charged per resolved interaction. No public list price.",
    launchedYear: 2023,
    roles: ["support-agent", "operations-manager", "product-manager"],
    tags: ["enterprise", "outcomes-based", "voice-and-chat", "agent-platform", "trending-2026"],
    accentColor: "#0F172A",
    securityScore: 86,
    securityAnalysis:
      "Sierra is SOC 2 Type II certified with HIPAA-eligible deployments and PCI scope for financial-services customers. Per-tenant isolation; agents operate within scoped tools defined by the customer.",
    dataPrivacyNotes:
      "Customer data is contractually isolated and not used for training Sierra's foundation models. Logging is configurable per deployment.",
    complianceBadges: ["SOC2", "GDPR", "HIPAA", "ISO27001"],
  },
  {
    slug: "cresta",
    name: "Cresta",
    tagline: "Generative AI for the contact center",
    description:
      "Cresta is a generative-AI platform for contact centers offering real-time agent assist, virtual agents, and post-call analytics. Series D in November 2024 ($125M, ~$1.6B valuation) put it among the leaders alongside Sierra and Decagon for enterprise voice support deployments.",
    websiteUrl: "https://cresta.com",
    logoUrl: "https://logo.clearbit.com/cresta.com",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Enterprise quote-based; per-seat plus feature-tier annual contracts.",
    launchedYear: 2017,
    roles: ["support-agent", "sales-professional", "operations-manager"],
    tags: ["contact-center", "agent-assist", "voice-analytics", "real-time", "trending-2026"],
    accentColor: "#9333EA",
    securityScore: 84,
    securityAnalysis:
      "Cresta is SOC 2 Type II and HIPAA certified. PII redaction is built into the call-analysis pipeline. Deployments support BYOK and regional data residency.",
    dataPrivacyNotes:
      "Call transcripts and recordings are tenant-isolated and not used to train Cresta's shared models without explicit consent.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR", "ISO27001"],
  },
  {
    slug: "forethought",
    name: "Forethought",
    tagline: "Generative AI for ticket deflection and agent assist",
    description:
      "Forethought is a generative AI customer-support platform combining ticket triage, deflection, agent assist, and post-resolution insights. Zendesk announced an all-cash acquisition in March 2026; the product remains available standalone pending close. Median ACV around $56-60K/year.",
    websiteUrl: "https://forethought.ai",
    logoUrl: "https://logo.clearbit.com/forethought.ai",
    categorySlug: "customer-support",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Quote-based; bundles platform + ticket-deflection usage. Median ACV ~$56-60K/year.",
    launchedYear: 2018,
    roles: ["support-agent", "operations-manager"],
    tags: ["ticket-deflection", "agent-assist", "zendesk", "acquisition-pending", "trending-2026"],
    accentColor: "#1D4ED8",
    securityScore: 80,
    securityAnalysis:
      "Forethought is SOC 2 Type II certified with HIPAA support. Acquisition by Zendesk (announced March 2026) places future security alignment under Zendesk's enterprise stack.",
    dataPrivacyNotes:
      "Customer ticket data is tenant-isolated and not used for training. DPA available on enterprise contracts.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Sales & Marketing ────────────────────────
  {
    slug: "artisan",
    name: "Artisan",
    tagline: "AI SDR Ava for outbound prospecting",
    description:
      "Artisan's flagship product is Ava, an AI Sales Development Representative that researches accounts, writes personalised cold outbound, manages cadences, and books meetings autonomously. $25M Series A in April 2025 brought funding to ~$46M with ~$5M ARR across 250+ customers.",
    websiteUrl: "https://www.artisan.co",
    logoUrl: "https://logo.clearbit.com/artisan.co",
    categorySlug: "sales-marketing",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Employee tier: ~$600/month annual. Accelerate: ~$2,000/month. Enterprise: custom.",
    launchedYear: 2023,
    roles: ["sales-professional", "marketer"],
    tags: ["ai-sdr", "outbound", "prospecting", "automation", "trending-2026"],
    accentColor: "#DC2626",
    securityScore: 72,
    securityAnalysis:
      "Artisan is SOC 2 Type II certified. CRM integrations operate via scoped OAuth. Prospect data is held under customer contract.",
    dataPrivacyNotes:
      "Outbound copy and prospect research stored on Artisan infrastructure. Enterprise plan includes DPA and data residency options.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "unify",
    name: "Unify",
    tagline: "Warm-outbound GTM with intent and AI research",
    description:
      "Unify combines intent signals, AI account research, and multichannel sequencing into a 'warm outbound' GTM platform. Series B in July 2025 raised $40M at $260M valuation. From the OpenAI Converge cohort and used by GTM teams at Ramp, Justworks, and others.",
    websiteUrl: "https://www.unifygtm.com",
    logoUrl: "https://logo.clearbit.com/unifygtm.com",
    categorySlug: "sales-marketing",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Growth: ~$1,740/month annual. Pro and Enterprise: custom-quoted.",
    launchedYear: 2023,
    roles: ["sales-professional", "marketer", "operations-manager"],
    tags: ["intent-data", "warm-outbound", "gtm", "sequencing", "trending-2026"],
    accentColor: "#0EA5E9",
    securityScore: 74,
    securityAnalysis:
      "Unify is SOC 2 Type II certified. Data enrichment uses third-party intent providers under existing DPAs.",
    dataPrivacyNotes:
      "Customer CRM data and prospect interactions are tenant-isolated. Not used to improve shared models.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "regie-ai",
    name: "Regie.ai",
    tagline: "Agentic sales engagement with RegieOne",
    description:
      "Regie.ai's RegieOne combines AI prospecting, sequencing, and a 'Force Multiplier Rep' agent that handles top-of-funnel outbound autonomously. $30M Series B in February 2025 with reported 300% YoY ARR growth. Targets mid-market and enterprise sales teams replacing manual SDR motions.",
    websiteUrl: "https://www.regie.ai",
    logoUrl: "https://logo.clearbit.com/regie.ai",
    categorySlug: "sales-marketing",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Starts ~$180/user/month. Force Multiplier Rep: ~$499/user/month. RegieOne enterprise: custom (10-seat min).",
    launchedYear: 2020,
    roles: ["sales-professional", "marketer"],
    tags: ["sales-engagement", "agentic-sdr", "outbound", "sequences", "trending-2026"],
    accentColor: "#9F1239",
    securityScore: 73,
    securityAnalysis:
      "Regie.ai is SOC 2 Type II certified with optional DPA. Email account integrations use OAuth-scoped delegation.",
    dataPrivacyNotes:
      "CRM and prospect data is kept tenant-isolated. Enterprise plan supports zero-retention with model providers.",
    complianceBadges: ["SOC2", "GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Legal ────────────────────────────────────
  {
    slug: "legora",
    name: "Legora",
    tagline: "Collaborative AI workspace for legal teams",
    description:
      "Legora is a collaborative AI workspace for legal teams — drafting, document review, and case research over uploaded matter files. Series D in March 2026 hit $5.55B valuation with $100M+ ARR, making it the closest rival to Harvey for global firm deployments.",
    websiteUrl: "https://legora.com",
    logoUrl: "https://logo.clearbit.com/legora.com",
    categorySlug: "legal",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Per-seat enterprise pricing; not publicly listed. Quote-based.",
    launchedYear: 2023,
    roles: ["legal-professional"],
    tags: ["contract-review", "drafting", "case-research", "trending-2026"],
    accentColor: "#0F766E",
    securityScore: 82,
    securityAnalysis:
      "Legora is SOC 2 Type II and ISO 27001 certified. Tenant-isolated matter rooms; per-firm encryption keys on enterprise plans.",
    dataPrivacyNotes:
      "Client matter content is contractually excluded from model training. EU and UK data residency options available.",
    complianceBadges: ["SOC2", "ISO27001", "GDPR"],
  },
  {
    slug: "eve-legal",
    name: "Eve",
    tagline: "AI for plaintiff-side law firms",
    description:
      "Eve is purpose-built for plaintiff-side law firms — case intake, demand letters, medical-records summarisation, and case-strategy analysis. Series B in September 2025 raised $103M at a $1B+ valuation; 450+ firm customers as of late 2025.",
    websiteUrl: "https://www.eve.legal",
    logoUrl: "https://logo.clearbit.com/eve.legal",
    categorySlug: "legal",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Quote-based; pricing not disclosed publicly.",
    launchedYear: 2023,
    roles: ["legal-professional"],
    tags: ["plaintiff", "case-intake", "demand-letters", "medical-records", "trending-2026"],
    accentColor: "#7C2D12",
    securityScore: 80,
    securityAnalysis:
      "Eve is SOC 2 Type II certified. PHI handled under HIPAA-aligned controls for medical-records workflows. Per-firm tenant isolation.",
    dataPrivacyNotes:
      "Client case data is not used for training Eve's shared models. Audit logs and admin retention controls available.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Video Generation ─────────────────────────
  {
    slug: "kling",
    name: "Kling AI",
    tagline: "Text- and image-to-video from Kuaishou",
    description:
      "Kling is Kuaishou's flagship video-generation model, competing at the top end with Sora and Veo. Kling 3.0 (February 2026) supports multi-shot scenes, character consistency, and fine motion control. Reported ~$240M ARR run rate makes it one of the largest standalone video-AI products globally.",
    websiteUrl: "https://klingai.com",
    logoUrl: "https://logo.clearbit.com/klingai.com",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 66 credits/day. Standard: $10/month. Pro: $25.99/month. Premier: $64.99/month. Ultra: $180/month.",
    launchedYear: 2024,
    roles: ["video-creator", "marketer", "designer"],
    tags: ["text-to-video", "image-to-video", "kuaishou", "multi-shot", "trending-2026"],
    accentColor: "#DC2626",
    securityScore: 60,
    securityAnalysis:
      "Kling is operated from China by Kuaishou. Public-facing controls follow standard SaaS practices; enterprise compliance with Western frameworks (SOC 2, GDPR) is not formally published. Review fit for sensitive corporate content.",
    dataPrivacyNotes:
      "Generated videos and prompts are retained on Kuaishou infrastructure. Credentials and data subject to Chinese data laws.",
    complianceBadges: [],
  },
  {
    slug: "google-veo",
    name: "Google Veo",
    tagline: "DeepMind text-to-video with native audio",
    description:
      "Veo is Google DeepMind's text-to-video model, available via Gemini, AI Studio, Flow, and Vertex AI. Veo 3 introduced native audio generation alongside 4K video; Veo 3.1 added improved camera control and longer clips. Pricing spans consumer Google AI subscriptions and per-second Vertex API billing.",
    websiteUrl: "https://deepmind.google/models/veo/",
    logoUrl: "https://logo.clearbit.com/deepmind.google",
    categorySlug: "video-generation",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free via Google Flow (limited). Google AI Pro: $19.99/month. Google AI Ultra: $249.99/month. Gemini API: $0.75/sec.",
    launchedYear: 2024,
    roles: ["video-creator", "marketer", "designer"],
    tags: ["text-to-video", "deepmind", "native-audio", "vertex-ai", "trending-2026"],
    accentColor: "#4285F4",
    securityScore: 88,
    securityAnalysis:
      "Veo runs on Google Cloud / Vertex AI infrastructure with full SOC 2, ISO 27001, ISO 27701, HIPAA-eligible workloads, and GDPR alignment. Vertex API supports VPC-SC and CMEK.",
    dataPrivacyNotes:
      "Vertex AI customer prompts and outputs are not used for training. Consumer Gemini surface follows Google's standard consumer data policy.",
    complianceBadges: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
  },
  {
    slug: "seedance",
    name: "Seedance",
    tagline: "ByteDance's text-to-video model",
    description:
      "Seedance is ByteDance's text-to-video model, primarily accessed through Volcengine API or ByteDance's consumer apps Jimeng and Dreamina. Seedance 2.0 (February 2026) added stronger character consistency and multi-second extensions. Frequently reaches the top of leaderboards alongside Sora and Veo.",
    websiteUrl: "https://seed.bytedance.com/en/seedance2_0",
    logoUrl: "https://logo.clearbit.com/bytedance.com",
    categorySlug: "video-generation",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "API: ~$0.092/sec (480p) to $0.199/sec (720p) via Volcengine. Jimeng/Dreamina consumer plans from ~$9.60/month.",
    launchedYear: 2025,
    roles: ["video-creator", "marketer"],
    tags: ["text-to-video", "bytedance", "volcengine", "character-consistency", "trending-2026"],
    accentColor: "#FF4500",
    securityScore: 60,
    securityAnalysis:
      "Seedance is operated by ByteDance via Volcengine. Enterprise compliance with Western frameworks is not broadly documented; review carefully for sensitive use.",
    dataPrivacyNotes:
      "Prompts and outputs are processed on Volcengine infrastructure subject to Chinese data laws.",
    complianceBadges: [],
  },

  // ── 2025-2026 trending refresh ─ Developer Platforms ──────────────────────
  {
    slug: "fireworks-ai",
    name: "Fireworks AI",
    tagline: "Fast inference and fine-tuning for production AI",
    description:
      "Fireworks AI is a generative-AI inference platform optimised for low-latency serving of open and proprietary models. Customers fine-tune, host, and serve models with usage-based pricing. October 2025 funding put valuation at $4B with growing enterprise traction for production GenAI workloads.",
    websiteUrl: "https://fireworks.ai",
    logoUrl: "https://logo.clearbit.com/fireworks.ai",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Serverless tokens: $0.10/M (<4B params), $0.20/M (4-16B), $0.90/M (16B+). GPU on-demand: $2.90-$9/hr. $1 free credit.",
    launchedYear: 2022,
    roles: ["developer", "data-scientist"],
    tags: ["inference", "fine-tuning", "open-models", "low-latency", "trending-2026"],
    accentColor: "#F43F5E",
    securityScore: 80,
    securityAnalysis:
      "Fireworks is SOC 2 Type II compliant. Enterprise plans support VPC deployment and zero-retention. Models can run isolated to avoid cross-tenant leakage.",
    dataPrivacyNotes:
      "Inference inputs/outputs are not used to train shared models. Enterprise: BYOC and dedicated deployments for regulated workloads.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },
  {
    slug: "cerebras",
    name: "Cerebras",
    tagline: "Wafer-scale inference at chart-topping speed",
    description:
      "Cerebras builds wafer-scale AI hardware and offers a cloud inference service that delivers some of the fastest token-generation rates publicly available. Cerebras Inference (2024) and pay-per-token (2025 GA) brought hosted access to Llama and Qwen variants on dedicated CS-3 systems.",
    websiteUrl: "https://www.cerebras.ai",
    logoUrl: "https://logo.clearbit.com/cerebras.ai",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free: 1M tokens/day. Pay-per-token from $10 deposit. Code Pro: $50/month. Code Max: $200/month. Tokens: $0.60-$3.90/M.",
    launchedYear: 2016,
    roles: ["developer", "data-scientist"],
    tags: ["inference", "wafer-scale", "llama", "ultra-low-latency", "trending-2026"],
    accentColor: "#EF4444",
    securityScore: 82,
    securityAnalysis:
      "Cerebras Cloud is SOC 2 Type II certified. Enterprise contracts support VPC isolation and dedicated wafer allocation. Inputs not used for retraining.",
    dataPrivacyNotes:
      "Tokens processed within tenant boundaries. Dedicated deployments offered for regulated/sovereign workloads.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "mastra",
    name: "Mastra",
    tagline: "TypeScript framework for AI agents",
    description:
      "Mastra is an open-source TypeScript framework for building AI agents and workflows, from the team behind Gatsby. YC W25 cohort with $13M seed (October 2025); Mastra 1.0 launched January 2026. Provides primitives for tools, workflows, memory, RAG, and evaluation.",
    websiteUrl: "https://mastra.ai",
    logoUrl: "https://logo.clearbit.com/mastra.ai",
    categorySlug: "developer-platforms",
    hasFree: true,
    pricingModel: "open_source",
    pricingDetails:
      "Framework: open source (Apache 2.0). Mastra Cloud: paid hosting tiers (pricing not consistently published).",
    launchedYear: 2024,
    roles: ["developer", "data-scientist"],
    tags: ["typescript", "agent-framework", "open-source", "yc-w25", "trending-2026"],
    accentColor: "#8B5CF6",
    securityScore: 70,
    securityAnalysis:
      "Open-source framework can be self-hosted with full control. Mastra Cloud applies standard SaaS controls; enterprise security details still maturing as the company scales.",
    dataPrivacyNotes:
      "Self-hosted: data stays on customer infrastructure. Cloud: tenant-isolated; enterprise DPA available on request.",
    complianceBadges: ["GDPR"],
  },

  // ── 2025-2026 trending refresh ─ Security & Compliance ────────────────────
  {
    slug: "cyera",
    name: "Cyera",
    tagline: "AI-native data security posture management",
    description:
      "Cyera is an AI-native Data Security Posture Management (DSPM) platform that discovers, classifies, and protects sensitive data across cloud, SaaS, and on-prem. Series F in January 2026 hit a $9B valuation with >$100M ARR and ~1/5 of the Fortune 500 as customers.",
    websiteUrl: "https://www.cyera.com",
    logoUrl: "https://logo.clearbit.com/cyera.com",
    categorySlug: "security-compliance",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails: "Enterprise quote-only. Pricing not published.",
    launchedYear: 2021,
    roles: ["security-engineer", "operations-manager"],
    tags: ["dspm", "data-security", "cloud", "fortune-500", "trending-2026"],
    accentColor: "#0F172A",
    securityScore: 90,
    securityAnalysis:
      "Cyera is SOC 2 Type II and ISO 27001 certified, with FedRAMP-aligned deployments for federal customers. Agentless scanning operates with read-only IAM scope.",
    dataPrivacyNotes:
      "Cyera scans metadata and samples; full data never leaves the customer environment. Per-tenant key management on enterprise plans.",
    complianceBadges: ["SOC2", "ISO27001", "GDPR", "FedRAMP"],
  },
  {
    slug: "prompt-security",
    name: "Prompt Security",
    tagline: "Runtime security for GenAI usage and apps",
    description:
      "Prompt Security protects employees' GenAI usage and homegrown LLM apps from prompt injection, data leakage, and policy violations. Acquired by SentinelOne (~$250M, August 2025), the platform now anchors SentinelOne's Singularity AI suite while continuing to be sold standalone.",
    websiteUrl: "https://prompt.security",
    logoUrl: "https://logo.clearbit.com/prompt.security",
    categorySlug: "security-compliance",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Enterprise quote-only. Sold standalone or as part of SentinelOne Singularity AI.",
    launchedYear: 2023,
    roles: ["security-engineer"],
    tags: ["llm-security", "prompt-injection", "sentinelone", "runtime-protection", "trending-2026"],
    accentColor: "#7E22CE",
    securityScore: 85,
    securityAnalysis:
      "Prompt Security operates as a secure proxy for LLM traffic. SOC 2 Type II certified; deployed in customer VPC or as managed service. Inherits SentinelOne's enterprise security posture post-acquisition.",
    dataPrivacyNotes:
      "Prompts and responses scanned in-line; can be configured for full pass-through or content redaction. No customer data used to train shared models.",
    complianceBadges: ["SOC2", "ISO27001", "GDPR"],
  },
  {
    slug: "lakera",
    name: "Lakera",
    tagline: "Real-time AI guardrails against prompt injection",
    description:
      "Lakera provides real-time AI/LLM guardrails — prompt-injection detection, data-leak prevention, and abuse monitoring. Acquired by Check Point in September 2025; now anchors Check Point's AI Security Center of Excellence in Zurich while continuing as a standalone product.",
    websiteUrl: "https://www.lakera.ai",
    logoUrl: "https://logo.clearbit.com/lakera.ai",
    categorySlug: "security-compliance",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Community: free. Paid plans reportedly from ~$99/month. Enterprise: custom.",
    launchedYear: 2021,
    roles: ["security-engineer", "developer"],
    tags: ["ai-guardrails", "prompt-injection", "check-point", "real-time", "trending-2026"],
    accentColor: "#15803D",
    securityScore: 84,
    securityAnalysis:
      "Lakera is SOC 2 Type II certified with ISO 27001 alignment. Inherits Check Point's enterprise security stack post-acquisition. Detection runs as proxy or SDK with low-latency inference.",
    dataPrivacyNotes:
      "Inputs scanned in-line; logs configurable for retention/redaction. No customer prompts used to train shared models.",
    complianceBadges: ["SOC2", "ISO27001", "GDPR"],
  },

  // ── New category ─ Voice Agents ───────────────────────────────────────────
  {
    slug: "vapi",
    name: "Vapi",
    tagline: "Developer platform for voice AI agents",
    description:
      "Vapi is a developer-focused voice AI platform — bring your own STT/LLM/TTS, get low-latency conversational telephony agents in production with a few lines of code. Series A in December 2024 (Bessemer-led, $20M); estimated $8M revenue in 2025.",
    websiteUrl: "https://vapi.ai",
    logoUrl: "https://logo.clearbit.com/vapi.ai",
    categorySlug: "voice-agents",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Platform: $0.05/min orchestration. All-in (with STT/LLM/TTS/telephony): $0.13-$0.33/min.",
    launchedYear: 2022,
    roles: ["developer", "support-agent", "operations-manager"],
    tags: ["voice-ai", "telephony", "developer-platform", "low-latency", "trending-2026"],
    accentColor: "#16A34A",
    securityScore: 75,
    securityAnalysis:
      "Vapi is SOC 2 Type II and HIPAA-eligible. PII redaction available on calls; recordings/transcripts stored under customer contract. Per-call API key scoping supported.",
    dataPrivacyNotes:
      "Transcripts retention configurable; enterprise plan supports zero-retention with model providers and BYOK.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },
  {
    slug: "retell-ai",
    name: "Retell AI",
    tagline: "Low-latency voice AI agents for telephony",
    description:
      "Retell AI is a YC-backed voice agent platform focused on low-latency conversational telephony with strong barge-in handling and natural turn-taking. Pay-as-you-go pricing makes it popular with developers and SMBs deploying voice agents over phone lines.",
    websiteUrl: "https://retellai.com",
    logoUrl: "https://logo.clearbit.com/retellai.com",
    categorySlug: "voice-agents",
    hasFree: true,
    pricingModel: "paid",
    pricingDetails:
      "Pay-as-you-go from $0.07/min. All-in: $0.13-$0.31/min. $10 free credits. Enterprise: down to $0.05/min.",
    launchedYear: 2023,
    roles: ["developer", "support-agent"],
    tags: ["voice-ai", "telephony", "low-latency", "yc", "trending-2026"],
    accentColor: "#7C3AED",
    securityScore: 73,
    securityAnalysis:
      "Retell is SOC 2 Type II certified with HIPAA support. Calls processed in tenant-scoped pipelines; PII redaction available.",
    dataPrivacyNotes:
      "Recordings retention configurable per project. Enterprise plan supports zero-retention with model providers.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },
  {
    slug: "bland-ai",
    name: "Bland AI",
    tagline: "Enterprise AI voice agents at scale",
    description:
      "Bland AI builds enterprise-scale voice agents for inbound and outbound calling — custom-tuned voices, dialer integrations, and end-to-end pipelines. The tiered pricing model introduced in December 2025 trades pure usage for predictable monthly fees plus per-minute rates.",
    websiteUrl: "https://bland.ai",
    logoUrl: "https://logo.clearbit.com/bland.ai",
    categorySlug: "voice-agents",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "$0.09/min connected + $0.015/short-attempt. Build plan: $299/month. Start and Scale tiers available.",
    launchedYear: 2023,
    roles: ["developer", "sales-professional", "support-agent"],
    tags: ["voice-ai", "outbound", "dialer", "enterprise", "trending-2026"],
    accentColor: "#1E3A8A",
    securityScore: 73,
    securityAnalysis:
      "Bland is SOC 2 Type II compliant. Enterprise customers can deploy in dedicated environments with BYOK and custom retention policies.",
    dataPrivacyNotes:
      "Call recordings and transcripts retention configurable. Enterprise plan supports DPA, zero-retention, and HIPAA.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },
  {
    slug: "synthflow",
    name: "Synthflow",
    tagline: "No-code voice AI for enterprise call automation",
    description:
      "Synthflow is a no-code voice AI platform aimed at non-developer teams deploying call automation — appointment scheduling, lead qualification, basic support. $20M raise in June 2025. Pricing model has been in flux as the company moves from pure usage-based to tiered subscriptions.",
    websiteUrl: "https://synthflow.ai",
    logoUrl: "https://logo.clearbit.com/synthflow.ai",
    categorySlug: "voice-agents",
    hasFree: false,
    pricingModel: "paid",
    pricingDetails:
      "Voice: $0.09/min + LLM $0.02-$0.04/min. Tiered plans reportedly $29-$249/month. Enterprise: ~$15K/year minimum.",
    launchedYear: 2023,
    roles: ["operations-manager", "sales-professional", "support-agent", "entrepreneur"],
    tags: ["voice-ai", "no-code", "call-automation", "enterprise", "trending-2026"],
    accentColor: "#0EA5E9",
    securityScore: 70,
    securityAnalysis:
      "Synthflow is SOC 2 Type II compliant. Pricing and enterprise terms have evolved during 2025; verify current contract terms during procurement.",
    dataPrivacyNotes:
      "Call recordings retained on Synthflow infrastructure. Enterprise plan supports DPA and configurable retention.",
    complianceBadges: ["SOC2", "GDPR"],
  },
  {
    slug: "parloa",
    name: "Parloa",
    tagline: "Enterprise contact-center AI agent platform",
    description:
      "Parloa is an enterprise AI agent management platform for contact centers — voice and chat workflows, deep CRM/ticketing integrations, and conversation analytics. Series D in January 2026 raised $350M at a $3B valuation; >$50M ARR with 150% NRR.",
    websiteUrl: "https://www.parloa.com",
    logoUrl: "https://logo.clearbit.com/parloa.com",
    categorySlug: "voice-agents",
    hasFree: false,
    pricingModel: "enterprise",
    pricingDetails:
      "Enterprise only. Reported ~$300K/year minimum; ACVs typically >$350K/year.",
    launchedYear: 2018,
    roles: ["support-agent", "operations-manager"],
    tags: ["contact-center", "enterprise", "voice-and-chat", "ccaas", "trending-2026"],
    accentColor: "#1E40AF",
    securityScore: 86,
    securityAnalysis:
      "Parloa is SOC 2 Type II, ISO 27001, and PCI-DSS certified for financial-services customers. EU data residency native; deployed across regulated industries (banking, telco, healthcare).",
    dataPrivacyNotes:
      "Customer call data is tenant-isolated and not used for training. Per-customer data retention and redaction policies enforced.",
    complianceBadges: ["SOC2", "ISO27001", "PCI", "GDPR"],
  },

  // ── New category ─ Browser Agents ─────────────────────────────────────────
  {
    slug: "browser-use",
    name: "Browser Use",
    tagline: "Open-source library for AI browser agents",
    description:
      "Browser Use is an open-source library and managed cloud that lets AI agents control real web browsers — fill forms, click through workflows, scrape sites that resist headless tools. $17M seed in March 2025 (Felicis-led); YC W25; one of the most-starred GitHub projects in agent infrastructure.",
    websiteUrl: "https://browser-use.com",
    logoUrl: "https://logo.clearbit.com/browser-use.com",
    categorySlug: "browser-agents",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "OSS: free. Cloud: $10 free credit, then $0.01/task init + per-step model costs (1.2x model rate or BYOK + 0.2x orchestration).",
    launchedYear: 2024,
    roles: ["developer", "data-scientist", "operations-manager"],
    tags: ["browser-automation", "open-source", "yc-w25", "agent-infra", "trending-2026"],
    accentColor: "#F59E0B",
    securityScore: 68,
    securityAnalysis:
      "Open source enables full self-hosting. Cloud SOC 2 Type II in progress per project communications. Sessions run in isolated containers; credentials should use scoped, ephemeral vaulting.",
    dataPrivacyNotes:
      "Self-hosted: full control. Cloud: session artifacts retained per account; not used for training. BYOK supported to keep model traffic out of Browser Use's infrastructure.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "browserbase",
    name: "Browserbase",
    tagline: "Headless browser infrastructure for AI agents",
    description:
      "Browserbase provides managed headless browsers built specifically for AI agents — anti-bot mitigation, session replay, and observability across millions of agent sessions. Series B in June 2025 brought funding to $40M at $300M valuation; 50M sessions and 1,000+ customers in 2025.",
    websiteUrl: "https://www.browserbase.com",
    logoUrl: "https://logo.clearbit.com/browserbase.com",
    categorySlug: "browser-agents",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Free tier. Developer: $20/month. Startup: $99/month. Scale: custom.",
    launchedYear: 2024,
    roles: ["developer", "data-scientist", "operations-manager"],
    tags: ["headless-browser", "agent-infra", "session-replay", "stealth", "trending-2026"],
    accentColor: "#1F2937",
    securityScore: 78,
    securityAnalysis:
      "Browserbase is SOC 2 Type II certified with HIPAA support. Each session runs in a dedicated container; session artifacts encrypted at rest with per-tenant keys.",
    dataPrivacyNotes:
      "Page content is tenant-isolated and not used for any shared training. Enterprise plan supports VPC peering and configurable retention.",
    complianceBadges: ["SOC2", "HIPAA", "GDPR"],
  },
  {
    slug: "steel-dev",
    name: "Steel",
    tagline: "Open-source headless browser API",
    description:
      "Steel is an open-source headless browser API for AI agents — a minimalist alternative to Browserbase with a focus on developer experience. 6.5K+ GitHub stars; generous free tier on the cloud and several paid tiers based on browser-hours.",
    websiteUrl: "https://steel.dev",
    logoUrl: "https://logo.clearbit.com/steel.dev",
    categorySlug: "browser-agents",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "OSS: free. Cloud: $29/month (290 hrs), $99/month (1,238 hrs), $499/month (9,980 hrs). Enterprise: custom.",
    launchedYear: 2024,
    roles: ["developer", "data-scientist"],
    tags: ["browser-automation", "open-source", "agent-infra", "developer-experience", "trending-2026"],
    accentColor: "#0EA5E9",
    securityScore: 70,
    securityAnalysis:
      "Open-source core can be self-hosted. Cloud applies standard SaaS practices; enterprise SOC 2 in progress. Sessions are container-isolated.",
    dataPrivacyNotes:
      "Self-hosted: full control. Cloud: page content tenant-isolated and not used for training shared models.",
    complianceBadges: ["GDPR"],
  },
  {
    slug: "comet",
    name: "Comet (Perplexity)",
    tagline: "Perplexity's agentic web browser",
    description:
      "Comet is Perplexity's agentic web browser — search and chat-driven navigation, summarisation, and multi-tab task execution. Launched July 2025 as a $200/month Max-only product, then made free worldwide on October 2, 2025. The Comet Plus add-on at $5/month adds paywalled-content access.",
    websiteUrl: "https://www.perplexity.ai/comet",
    logoUrl: "https://logo.clearbit.com/perplexity.ai",
    categorySlug: "browser-agents",
    hasFree: true,
    pricingModel: "freemium",
    pricingDetails:
      "Comet: free worldwide. Comet Plus add-on: $5/month. Perplexity Pro: $20/month. Perplexity Max: $200/month unlocks more.",
    launchedYear: 2025,
    roles: ["researcher", "writer", "marketer", "analyst"],
    tags: ["browser", "perplexity", "agentic", "consumer", "trending-2026"],
    accentColor: "#0EA5E9",
    securityScore: 72,
    securityAnalysis:
      "Comet runs on Perplexity's infrastructure with SOC 2 alignment. Browser actions are scoped per session; sensitive site interactions can be excluded from history.",
    dataPrivacyNotes:
      "Browsing history may inform Perplexity's search context unless the user opts out. Perplexity Enterprise tier offers stricter retention controls.",
    complianceBadges: ["SOC2", "GDPR"],
  },
];
