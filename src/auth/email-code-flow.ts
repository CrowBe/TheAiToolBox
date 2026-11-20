export const RESEND_COOLDOWN_MS = 30_000;

export const EXTRA_SIGN_UP_MESSAGE =
  "This sign-up needs more than an email address. In Clerk, keep email codes on and turn every other sign-up requirement off, then try again.";

export const EXTRA_SIGN_IN_MESSAGE =
  "This account needs another step besides an email code. Use a different email, or turn that step off in Clerk.";

export const SESSION_TASK_MESSAGE =
  "This account still needs a step this page can't finish. In Clerk, turn off extra requirements, then try again.";

const GENERIC_MESSAGE = "Something went wrong. Try again.";
const WRONG_CODE_MESSAGE = "That code doesn't match. Check the email and try again.";
const EXPIRED_CODE_MESSAGE = "That code has expired. Send a new one.";
const RATE_LIMIT_MESSAGE = "Too many attempts. Wait a moment, then try again.";

export type FlowMode = "sign-in" | "sign-up";

export type FlowResult =
  | { step: "email"; message: string }
  | { step: "code"; mode: FlowMode; message: string }
  | { step: "activate"; mode: FlowMode }
  | { step: "signed-in" };

type ClerkResult = { error: unknown };

export interface EmailCodeClerk {
  signIn: {
    create(params: { identifier: string }): Promise<ClerkResult>;
    emailCode: {
      sendCode(params?: { emailAddress?: string }): Promise<ClerkResult>;
      verifyCode(params: { code: string }): Promise<ClerkResult>;
    };
    readonly status: string | null;
    readonly isTransferable: boolean;
    reset(): Promise<ClerkResult>;
  };
  signUp: {
    create(params: { emailAddress: string }): Promise<ClerkResult>;
    verifications: {
      sendEmailCode(): Promise<ClerkResult>;
      verifyEmailCode(params: { code: string }): Promise<ClerkResult>;
    };
    readonly status: string | null;
    readonly missingFields: readonly string[];
    readonly unverifiedFields: readonly string[];
    reset(): Promise<ClerkResult>;
  };
}

type ErrorRecord = {
  code?: unknown;
  message?: unknown;
  longMessage?: unknown;
  status?: unknown;
  retryAfter?: unknown;
  errors?: unknown;
};

function asRecord(error: unknown): ErrorRecord | null {
  if (!error || typeof error !== "object") return null;
  return error as ErrorRecord;
}

export function clerkCodes(error: unknown): string[] {
  const record = asRecord(error);
  if (!record) return [];
  const codes: string[] = [];
  if (typeof record.code === "string" && record.code !== "api_response_error") codes.push(record.code);
  if (Array.isArray(record.errors)) {
    for (const entry of record.errors) {
      const nested = asRecord(entry);
      if (nested && typeof nested.code === "string" && !codes.includes(nested.code)) codes.push(nested.code);
    }
  }
  return codes;
}

export function isIdentifierNotFound(error: unknown): boolean {
  return clerkCodes(error).includes("form_identifier_not_found");
}

function hasCode(error: unknown, code: string): boolean {
  return clerkCodes(error).includes(code);
}

function isRateLimited(error: unknown): boolean {
  if (hasCode(error, "too_many_requests") || hasCode(error, "signup_rate_limit_exceeded")) return true;
  return asRecord(error)?.status === 429;
}

function isAlreadySignedIn(error: unknown): boolean {
  return hasCode(error, "session_exists") || hasCode(error, "identifier_already_signed_in");
}

function longMessageOf(error: unknown): string | undefined {
  const record = asRecord(error);
  if (!record) return undefined;
  if (Array.isArray(record.errors)) {
    for (const entry of record.errors) {
      const nested = asRecord(entry);
      if (nested && typeof nested.longMessage === "string" && nested.longMessage.trim()) return nested.longMessage;
    }
  }
  if (typeof record.longMessage === "string" && record.longMessage.trim()) return record.longMessage;
  return undefined;
}

export function messageForClerkError(error: unknown): string {
  if (isRateLimited(error)) {
    const retryAfter = asRecord(error)?.retryAfter;
    if (typeof retryAfter === "number" && Number.isFinite(retryAfter) && retryAfter > 0) {
      const seconds = Math.ceil(retryAfter);
      return `Too many attempts. Wait ${seconds} ${seconds === 1 ? "second" : "seconds"}, then try again.`;
    }
    return RATE_LIMIT_MESSAGE;
  }
  if (hasCode(error, "form_code_incorrect") || hasCode(error, "verification_failed")) return WRONG_CODE_MESSAGE;
  if (hasCode(error, "verification_expired") || hasCode(error, "form_code_expired")) return EXPIRED_CODE_MESSAGE;
  if (hasCode(error, "form_param_format_invalid")) return "Enter a valid email address.";
  if (hasCode(error, "user_locked")) return "This account is locked. Wait a bit, then try again.";
  if (hasCode(error, "user_banned") || hasCode(error, "user_deactivated")) {
    return "This account can't sign in. Use a different email.";
  }
  if (
    hasCode(error, "not_allowed_to_sign_up") ||
    hasCode(error, "sign_up_mode_restricted") ||
    hasCode(error, "sign_up_restricted_waitlist")
  ) {
    return "New accounts are turned off for this site. Use an email that already has an account, or allow sign-up in Clerk.";
  }
  if (hasCode(error, "captcha_invalid") || hasCode(error, "captcha_unavailable")) {
    return "The security check failed. Refresh the page and try again.";
  }
  if (hasCode(error, "strategy_for_user_invalid")) {
    return "This account can't use an email code. Turn email codes on in Clerk, then try again.";
  }
  return longMessageOf(error) ?? GENERIC_MESSAGE;
}

export function resendCooldownSeconds(sentAt: number, now: number, cooldownMs = RESEND_COOLDOWN_MS): number {
  const remaining = sentAt + cooldownMs - now;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / 1000);
}

function emailProblem(email: string): string | null {
  const address = email.trim();
  if (!address.includes("@") || address.startsWith("@") || address.endsWith("@")) return "Enter an email address.";
  return null;
}

function signUpNeedsMoreThanEmail(signUp: EmailCodeClerk["signUp"]): boolean {
  if (signUp.missingFields.some((field) => field !== "email_address")) return true;
  if (signUp.unverifiedFields.some((field) => field !== "email_address")) return true;
  return signUp.status === "abandoned";
}

function afterSignInPrepared(clerk: EmailCodeClerk): FlowResult {
  const status = clerk.signIn.status;
  if (status === "complete") return { step: "activate", mode: "sign-in" };
  if (
    status === "needs_second_factor" ||
    status === "needs_client_trust" ||
    status === "needs_new_password" ||
    status === "needs_protect_check"
  ) {
    return { step: "email", message: EXTRA_SIGN_IN_MESSAGE };
  }
  return { step: "code", mode: "sign-in", message: "" };
}

async function requestSignUp(clerk: EmailCodeClerk, email: string): Promise<FlowResult> {
  await clerk.signIn.reset();
  const created = await clerk.signUp.create({ emailAddress: email });
  if (isAlreadySignedIn(created.error)) return { step: "signed-in" };
  if (isRateLimited(created.error)) return { step: "email", message: messageForClerkError(created.error) };
  if (hasCode(created.error, "form_identifier_exists")) {
    await clerk.signUp.reset();
    return requestSignIn(clerk, email, true);
  }
  if (created.error) return { step: "email", message: messageForClerkError(created.error) };
  if (clerk.signUp.status === "complete") return { step: "activate", mode: "sign-up" };
  if (signUpNeedsMoreThanEmail(clerk.signUp)) return { step: "email", message: EXTRA_SIGN_UP_MESSAGE };

  const sent = await clerk.signUp.verifications.sendEmailCode();
  if (isRateLimited(sent.error)) return { step: "email", message: messageForClerkError(sent.error) };
  if (sent.error) return { step: "email", message: messageForClerkError(sent.error) };
  if (clerk.signUp.status === "complete") return { step: "activate", mode: "sign-up" };
  if (signUpNeedsMoreThanEmail(clerk.signUp)) return { step: "email", message: EXTRA_SIGN_UP_MESSAGE };
  return { step: "code", mode: "sign-up", message: "" };
}

async function requestSignIn(clerk: EmailCodeClerk, email: string, switched: boolean): Promise<FlowResult> {
  const created = await clerk.signIn.create({ identifier: email });
  if (isAlreadySignedIn(created.error)) return { step: "signed-in" };
  if (isRateLimited(created.error)) return { step: "email", message: messageForClerkError(created.error) };
  const unknown = isIdentifierNotFound(created.error) || (!created.error && clerk.signIn.isTransferable);
  if (unknown) {
    if (switched) return { step: "email", message: GENERIC_MESSAGE };
    return requestSignUp(clerk, email);
  }
  if (created.error) return { step: "email", message: messageForClerkError(created.error) };

  const sent = await clerk.signIn.emailCode.sendCode({ emailAddress: email });
  if (isAlreadySignedIn(sent.error)) return { step: "signed-in" };
  if (isRateLimited(sent.error)) return { step: "email", message: messageForClerkError(sent.error) };
  if (sent.error && (isIdentifierNotFound(sent.error) || clerk.signIn.isTransferable)) {
    if (switched) return { step: "email", message: GENERIC_MESSAGE };
    return requestSignUp(clerk, email);
  }
  if (sent.error) return { step: "email", message: messageForClerkError(sent.error) };
  return afterSignInPrepared(clerk);
}

export async function beginEmailCode(clerk: EmailCodeClerk, email: string): Promise<FlowResult> {
  const problem = emailProblem(email);
  if (problem) return { step: "email", message: problem };
  try {
    return await requestSignIn(clerk, email.trim(), false);
  } catch {
    return { step: "email", message: GENERIC_MESSAGE };
  }
}

async function verifySignIn(clerk: EmailCodeClerk, code: string): Promise<FlowResult> {
  const verified = await clerk.signIn.emailCode.verifyCode({ code });
  if (isAlreadySignedIn(verified.error)) return { step: "signed-in" };
  if (verified.error) return { step: "code", mode: "sign-in", message: messageForClerkError(verified.error) };
  if (clerk.signIn.status === "complete") return { step: "activate", mode: "sign-in" };
  if (clerk.signIn.status === "needs_first_factor") {
    return { step: "code", mode: "sign-in", message: WRONG_CODE_MESSAGE };
  }
  return { step: "code", mode: "sign-in", message: EXTRA_SIGN_IN_MESSAGE };
}

async function verifySignUp(clerk: EmailCodeClerk, code: string): Promise<FlowResult> {
  const verified = await clerk.signUp.verifications.verifyEmailCode({ code });
  if (isAlreadySignedIn(verified.error)) return { step: "signed-in" };
  if (verified.error) return { step: "code", mode: "sign-up", message: messageForClerkError(verified.error) };
  if (clerk.signUp.status === "complete") return { step: "activate", mode: "sign-up" };
  if (signUpNeedsMoreThanEmail(clerk.signUp)) return { step: "code", mode: "sign-up", message: EXTRA_SIGN_UP_MESSAGE };
  if (clerk.signUp.unverifiedFields.includes("email_address")) {
    return { step: "code", mode: "sign-up", message: WRONG_CODE_MESSAGE };
  }
  return {
    step: "code",
    mode: "sign-up",
    message: "That code didn't finish creating the account. Send a new one and try again.",
  };
}

export async function verifyEmailCode(clerk: EmailCodeClerk, mode: FlowMode, code: string): Promise<FlowResult> {
  const token = code.trim();
  if (!token) return { step: "code", mode, message: "Enter the code from your email." };
  try {
    return mode === "sign-up" ? await verifySignUp(clerk, token) : await verifySignIn(clerk, token);
  } catch {
    return { step: "code", mode, message: GENERIC_MESSAGE };
  }
}

export async function resendEmailCode(
  clerk: EmailCodeClerk,
  mode: FlowMode,
  email: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const sent =
      mode === "sign-up"
        ? await clerk.signUp.verifications.sendEmailCode()
        : await clerk.signIn.emailCode.sendCode({ emailAddress: email.trim() });
    if (sent.error) return { ok: false, message: messageForClerkError(sent.error) };
    return { ok: true, message: "" };
  } catch {
    return { ok: false, message: GENERIC_MESSAGE };
  }
}

export async function resetEmailCode(clerk: EmailCodeClerk): Promise<void> {
  await clerk.signIn.reset();
  await clerk.signUp.reset();
}
