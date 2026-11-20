const DEFAULT_NEXT_PATH = "/box";

function isSafePath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("\\") || value.includes("://")) return false;
  if (/[\u0000-\u001F\u007F]/.test(value)) return false;
  return true;
}

function pathForms(value: string): string[] | null {
  const forms = [value];
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      forms.push(decoded);
      current = decoded;
    } catch {
      return null;
    }
  }
  return forms;
}

export function safeNextPath(value: string | null | undefined, fallback = DEFAULT_NEXT_PATH): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  const forms = pathForms(trimmed);
  if (!forms || forms.some((form) => !isSafePath(form))) return fallback;
  return trimmed;
}
