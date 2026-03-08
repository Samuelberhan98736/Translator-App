import { registerQueueHandler } from "../queue/queue";
import { processTranslationJob } from "../modules/translations/translation.service";

export function registerTranslationWorker(): void {
  registerQueueHandler("translation", async (payload: unknown) => {
    const jobId =
      typeof payload === "object" && payload !== null && "jobId" in payload
        ? String((payload as { jobId: string }).jobId)
        : "";

    if (!jobId) {
      return;
    }

    await processTranslationJob(jobId);
  });
}
