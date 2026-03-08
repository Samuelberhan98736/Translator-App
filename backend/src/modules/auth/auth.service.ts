import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type UserRecord = {
  id: string;
  email: string;
  password: string;
  role: "learner" | "mentor" | "admin";
};

const users = new Map<string, UserRecord>();

function issueToken(user: UserRecord): string {
  return `${user.id}.${user.role}.${Date.now()}`;
}

export function signUp(payload: unknown) {
  const parsed = CredentialsSchema.parse(payload);
  const existing = Array.from(users.values()).find((item) => item.email === parsed.email);

  if (existing) {
    return {
      user: { id: existing.id, email: existing.email, role: existing.role },
      token: issueToken(existing)
    };
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email: parsed.email,
    password: parsed.password,
    role: "learner"
  };

  users.set(user.id, user);

  return {
    user: { id: user.id, email: user.email, role: user.role },
    token: issueToken(user)
  };
}

export function signIn(payload: unknown) {
  const parsed = CredentialsSchema.parse(payload);
  const user = Array.from(users.values()).find((item) => item.email === parsed.email);

  if (!user || user.password !== parsed.password) {
    return null;
  }

  return {
    user: { id: user.id, email: user.email, role: user.role },
    token: issueToken(user)
  };
}
