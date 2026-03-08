declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        role: "learner" | "mentor" | "admin";
      };
    }
  }
}

export {};
