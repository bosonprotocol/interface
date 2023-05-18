import * as Sentry from "@sentry/browser";

export async function fetchTextFile(textFileUrl: string, useCache = true) {
  const response = await fetch(
    textFileUrl,
    useCache ? {} : { cache: "no-cache" }
  );
  if (!response.ok) {
    const error = `Error when fetching ${textFileUrl}: ${response.status} ${response.statusText}`;
    Sentry.captureException(error);
    // Let the exception throwing to ensure the caller is dealing with the appropriate reaction
    throw error;
  }
  return response.text();
}
