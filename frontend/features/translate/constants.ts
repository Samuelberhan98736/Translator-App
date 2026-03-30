export const API_ROUTES = {
  translations: "/api/translations",
  translationJob: (jobId: string) => `/api/translations/${jobId}`,
  translationHistory: "/api/translations/history"
} as const;
