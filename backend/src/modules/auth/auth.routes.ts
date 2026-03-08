import { Router } from "express";
import { signIn, signUp } from "./auth.service";

export const authRouter = Router();

authRouter.post("/signup", (req, res) => {
  const session = signUp(req.body);
  res.json(session);
});

authRouter.post("/signin", (req, res) => {
  const session = signIn(req.body);

  if (!session) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json(session);
});

authRouter.get("/me", (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({ user: req.user });
});
