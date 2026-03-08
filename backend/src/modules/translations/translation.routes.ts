import { Router } from "express";
import { cancelTranslation, createTranslation, getTranslation } from "./translation.controller";

export const translationRouter = Router();

translationRouter.post("/", createTranslation);
translationRouter.get("/:jobId", getTranslation);
translationRouter.post("/:jobId/cancel", cancelTranslation);
