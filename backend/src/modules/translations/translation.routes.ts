import { Router } from "express";
import { cancelTranslation, createTranslation, getTranslation, listTranslations } from "./translation.controller";

export const translationRouter = Router();

translationRouter.get("/history", listTranslations);
translationRouter.post("/", createTranslation);
translationRouter.get("/:jobId", getTranslation);
translationRouter.post("/:jobId/cancel", cancelTranslation);
