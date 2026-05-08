import type { InsertRole } from "@workspace/db";

export const ROLES: InsertRole[] = [
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
