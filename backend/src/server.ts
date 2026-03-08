import "dotenv/config";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./observability/logger";
import { registerTranslationWorker } from "./workers/translation.worker";

registerTranslationWorker();

app.listen(env.PORT, () => {
  logger.info("Backend server started", {
    port: env.PORT,
    env: env.NODE_ENV
  });
});
