import { describe, expect, it, vi } from "vitest";
import {
  EXTRA_SIGN_IN_MESSAGE,
  EXTRA_SIGN_UP_MESSAGE,
  beginEmailCode,
  clerkCodes,
  isIdentifierNotFound,
  resendCooldownSeconds,
  resendEmailCode,
  resetEmailCode,
  verifyEmailCode,
  type EmailCodeClerk,
} from "./email-code-flow";
import { safeNextPath } from "./next-path";

const notFound = {
  code: "api_response_error",
  message: "Couldn't find your account.",
  errors: [
    {
      code: "form_identifier_not_found",
      message: "not found",
      longMessage: "Couldn't find your account.",
    },
  ],
};

function mockClerk() {
  const signIn = {
    status: "needs_identifier" as string | null,
    isTransferable: false,
    create: vi.fn(async () => ({ error: null as unknown })),
    emailCode: {
      sendCode: vi.fn(async () => {
        signIn.status = "needs_first_factor";
        return { error: null as unknown };
      }),
      verifyCode: vi.fn(async () => {
        signIn.status = "complete";
        return { error: null as unknown };
      }),
    },
    reset: vi.fn(async () => {
      signIn.status = "needs_identifier";
      signIn.isTransferable = false;
      return { error: null as unknown };
    }),
  };
  const signUp = {
    status: null as string | null,
    missingFields: [] as string[],
    unverifiedFields: [] as string[],
    create: vi.fn(async () => {
      signUp.status = "missing_requirements";
      signUp.missingFields = [];
      signUp.unverifiedFields = ["email_address"];
      return { error: null as unknown };
    }),
    verifications: {
      sendEmailCode: vi.fn(async () => ({ error: null as unknown })),
      verifyEmailCode: vi.fn(async () => {
        signUp.status = "complete";
        signUp.unverifiedFields = [];
        return { error: null as unknown };
      }),
    },
    reset: vi.fn(async () => {
      signUp.status = null;
      signUp.missingFields = [];
      signUp.unverifiedFields = [];
      return { error: null as unknown };
    }),
  };
  const clerk: EmailCodeClerk = { signIn, signUp };
  return { clerk, signIn, signUp };
}

describe("email code flow", () => {
  it("reads the nested identifier-not-found code Clerk returns", () => {
    expect(clerkCodes(notFound)).toEqual(["form_identifier_not_found"]);
    expect(isIdentifierNotFound(notFound)).toBe(true);
    expect(isIdentifierNotFound({ code: "form_identifier_not_found" })).toBe(true);
    expect(isIdentifierNotFound({ code: "api_response_error" })).toBe(false);
  });

  it("sends a sign-in code when the account exists", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    const result = await beginEmailCode(clerk, "member@example.com");
    expect(result).toEqual({ step: "code", mode: "sign-in", message: "" });
    expect(signIn.create).toHaveBeenCalledWith({ identifier: "member@example.com" });
    expect(signIn.emailCode.sendCode).toHaveBeenCalledWith({ emailAddress: "member@example.com" });
    expect(signUp.create).not.toHaveBeenCalled();
  });

  it("starts sign-up when Clerk says the identifier is not found", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    signIn.create.mockResolvedValue({ error: notFound });
    const result = await beginEmailCode(clerk, "new@example.com");
    expect(result).toEqual({ step: "code", mode: "sign-up", message: "" });
    expect(result).not.toMatchObject({ message: "Couldn't find your account." });
    expect(signIn.emailCode.sendCode).not.toHaveBeenCalled();
    expect(signIn.reset).toHaveBeenCalled();
    expect(signUp.create).toHaveBeenCalledWith({ emailAddress: "new@example.com" });
    expect(signUp.verifications.sendEmailCode).toHaveBeenCalledOnce();
  });

  it("starts sign-up when the missing account is reported by sendCode", async () => {
    const { signUp } = mockClerk();
    const { signIn } = mockClerk();
    signIn.emailCode.sendCode.mockResolvedValue({ error: notFound });
    const clerkWithSendFailure: EmailCodeClerk = { signIn, signUp };
    const result = await beginEmailCode(clerkWithSendFailure, "new@example.com");
    expect(result.step).toBe("code");
    expect(signUp.create).toHaveBeenCalledWith({ emailAddress: "new@example.com" });
  });

  it("sends the sign-up code when Clerk has not listed an extra field yet", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    signIn.create.mockResolvedValue({ error: notFound });
    signUp.create.mockImplementation(async () => {
      signUp.status = "missing_requirements";
      signUp.missingFields = [];
      signUp.unverifiedFields = [];
      return { error: null };
    });
    const result = await beginEmailCode(clerk, "new@example.com");
    expect(result).toEqual({ step: "code", mode: "sign-up", message: "" });
    expect(signUp.verifications.sendEmailCode).toHaveBeenCalledOnce();
  });

  it("stays on the email step when sign-up asks for more than an email", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    signIn.create.mockResolvedValue({ error: notFound });
    signUp.create.mockImplementation(async () => {
      signUp.status = "missing_requirements";
      signUp.missingFields = ["first_name"];
      signUp.unverifiedFields = ["email_address"];
      return { error: null };
    });
    const result = await beginEmailCode(clerk, "new@example.com");
    expect(result).toEqual({ step: "email", message: EXTRA_SIGN_UP_MESSAGE });
    expect(signUp.verifications.sendEmailCode).not.toHaveBeenCalled();
  });

  it("shows the code screen when a sign-in code was sent", async () => {
    const { clerk, signIn } = mockClerk();
    signIn.emailCode.sendCode.mockResolvedValue({ error: null });
    const result = await beginEmailCode(clerk, "member@example.com");
    expect(result).toEqual({ step: "code", mode: "sign-in", message: "" });
  });

  it("explains a second sign-in step and leaves the email form usable", async () => {
    const { clerk, signIn } = mockClerk();
    signIn.emailCode.sendCode.mockImplementation(async () => {
      signIn.status = "needs_second_factor";
      return { error: null };
    });
    const result = await beginEmailCode(clerk, "member@example.com");
    expect(result).toEqual({ step: "email", message: EXTRA_SIGN_IN_MESSAGE });
  });

  it("keeps a wrong or expired code on the code step", async () => {
    const { clerk, signIn } = mockClerk();
    signIn.status = "needs_first_factor";
    signIn.emailCode.verifyCode.mockResolvedValue({
      error: { errors: [{ code: "form_code_incorrect", longMessage: "Incorrect code" }] },
    });
    const wrong = await verifyEmailCode(clerk, "sign-in", "000000");
    expect(wrong).toEqual({
      step: "code",
      mode: "sign-in",
      message: "That code doesn't match. Check the email and try again.",
    });

    signIn.emailCode.verifyCode.mockResolvedValue({
      error: { code: "verification_expired", longMessage: "expired" },
    });
    const expired = await verifyEmailCode(clerk, "sign-in", "111111");
    expect(expired).toEqual({
      step: "code",
      mode: "sign-in",
      message: "That code has expired. Send a new one.",
    });
    expect(wrong.step).not.toBe("activate");
  });

  it("activates sign-in and sign-up once the code is accepted", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    signIn.status = "needs_first_factor";
    expect(await verifyEmailCode(clerk, "sign-in", "424242")).toEqual({ step: "activate", mode: "sign-in" });

    signUp.status = "missing_requirements";
    signUp.unverifiedFields = ["email_address"];
    expect(await verifyEmailCode(clerk, "sign-up", "424242")).toEqual({ step: "activate", mode: "sign-up" });
  });

  it("resends through the active mode and waits out a short cooldown", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    expect(await resendEmailCode(clerk, "sign-in", "member@example.com")).toEqual({ ok: true, message: "" });
    expect(signIn.emailCode.sendCode).toHaveBeenCalledWith({ emailAddress: "member@example.com" });

    expect(await resendEmailCode(clerk, "sign-up", "new@example.com")).toEqual({ ok: true, message: "" });
    expect(signUp.verifications.sendEmailCode).toHaveBeenCalledOnce();

    signIn.emailCode.sendCode.mockResolvedValue({
      error: { status: 429, retryAfter: 12, errors: [{ code: "too_many_requests" }] },
    });
    expect(await resendEmailCode(clerk, "sign-in", "member@example.com")).toEqual({
      ok: false,
      message: "Too many attempts. Wait 12 seconds, then try again.",
    });

    expect(resendCooldownSeconds(1_000, 1_000)).toBe(30);
    expect(resendCooldownSeconds(1_000, 30_999)).toBe(1);
    expect(resendCooldownSeconds(1_000, 31_000)).toBe(0);
  });

  it("resets both Clerk attempts when the email changes", async () => {
    const { clerk, signIn, signUp } = mockClerk();
    await resetEmailCode(clerk);
    expect(signIn.reset).toHaveBeenCalledOnce();
    expect(signUp.reset).toHaveBeenCalledOnce();
  });

  it("rejects an open redirect and defaults to the library", () => {
    expect(safeNextPath("/tools/cursor")).toBe("/tools/cursor");
    expect(safeNextPath("/box?x=1")).toBe("/box?x=1");
    expect(safeNextPath(null)).toBe("/box");
    expect(safeNextPath("https://evil.example")).toBe("/box");
    expect(safeNextPath("//evil.example")).toBe("/box");
    expect(safeNextPath("/\\evil")).toBe("/box");
    expect(safeNextPath("/%2f%2fevil.example")).toBe("/box");
    expect(safeNextPath("/%252F%252Fevil.example")).toBe("/box");
    expect(safeNextPath("/tools/cur\nsor")).toBe("/box");
  });
});
