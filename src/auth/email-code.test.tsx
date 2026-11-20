// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmailCodeSignIn } from "./email-code";

const { router, authState, resources } = vi.hoisted(() => {
  const router = { push: vi.fn(), refresh: vi.fn(), replace: vi.fn() };
  const authState = { isLoaded: true, isSignedIn: false };
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
    finalize: vi.fn(async () => ({ error: null as unknown })),
    reset: vi.fn(async () => ({ error: null as unknown })),
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
      verifyEmailCode: vi.fn(async () => ({ error: null as unknown })),
    },
    finalize: vi.fn(async () => ({ error: null as unknown })),
    reset: vi.fn(async () => ({ error: null as unknown })),
  };
  return { router, authState, resources: { signIn, signUp } };
});

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams("next=/tools/cursor"),
}));

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
  useSignIn: () => ({ signIn: resources.signIn, fetchStatus: "idle" }),
  useSignUp: () => ({ signUp: resources.signUp, fetchStatus: "idle" }),
}));

const notFound = {
  code: "api_response_error",
  message: "Couldn't find your account.",
  errors: [{ code: "form_identifier_not_found", longMessage: "Couldn't find your account." }],
};

afterEach(() => {
  cleanup();
  authState.isLoaded = true;
  authState.isSignedIn = false;
  resources.signIn.status = "needs_identifier";
  resources.signIn.isTransferable = false;
  resources.signIn.create.mockReset();
  resources.signIn.create.mockResolvedValue({ error: null });
  resources.signIn.emailCode.sendCode.mockReset();
  resources.signIn.emailCode.sendCode.mockImplementation(async () => {
    resources.signIn.status = "needs_first_factor";
    return { error: null };
  });
  resources.signIn.emailCode.verifyCode.mockReset();
  resources.signIn.finalize.mockReset();
  resources.signIn.finalize.mockResolvedValue({ error: null });
  resources.signIn.reset.mockReset();
  resources.signIn.reset.mockResolvedValue({ error: null });
  resources.signUp.status = null;
  resources.signUp.missingFields = [];
  resources.signUp.unverifiedFields = [];
  resources.signUp.create.mockReset();
  resources.signUp.create.mockImplementation(async () => {
    resources.signUp.status = "missing_requirements";
    resources.signUp.unverifiedFields = ["email_address"];
    return { error: null };
  });
  resources.signUp.verifications.sendEmailCode.mockReset();
  resources.signUp.verifications.sendEmailCode.mockResolvedValue({ error: null });
  resources.signUp.verifications.verifyEmailCode.mockReset();
  resources.signUp.finalize.mockReset();
  resources.signUp.reset.mockReset();
  resources.signUp.reset.mockResolvedValue({ error: null });
  router.push.mockReset();
  router.refresh.mockReset();
  router.replace.mockReset();
});

async function submitEmail(address: string) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: address } });
  fireEvent.submit(screen.getByRole("button", { name: "Email me a code" }).closest("form") as HTMLFormElement);
  expect(await screen.findByText(/Enter the code sent to/)).toBeTruthy();
}

describe("EmailCodeSignIn", () => {
  it("shows the same code screen for a new email instead of Clerk's not-found message", async () => {
    resources.signIn.create.mockResolvedValue({ error: notFound });
    render(<EmailCodeSignIn />);
    await submitEmail("new@example.com");
    expect(screen.queryByText(/Couldn't find your account/)).toBeNull();
    expect(screen.getByText("new@example.com")).toBeTruthy();
    expect((screen.getByRole("button", { name: /Send a new code/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows a human message for a wrong code", async () => {
    render(<EmailCodeSignIn />);
    await submitEmail("member@example.com");
    resources.signIn.status = "needs_first_factor";
    resources.signIn.emailCode.verifyCode.mockResolvedValue({
      error: { errors: [{ code: "form_code_incorrect", longMessage: "Incorrect code" }] },
    });
    fireEvent.change(screen.getByLabelText("Email code"), { target: { value: "000000" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form") as HTMLFormElement);
    expect((await screen.findByRole("alert")).textContent).toBe(
      "That code doesn't match. Check the email and try again.",
    );
    expect(resources.signIn.finalize).not.toHaveBeenCalled();
  });

  it("sends an already signed-in visitor back to the same-origin next path", () => {
    authState.isSignedIn = true;
    render(<EmailCodeSignIn />);
    expect(router.replace).toHaveBeenCalledWith("/tools/cursor");
    expect(screen.getByText(/You're signed in/)).toBeTruthy();
  });
});
