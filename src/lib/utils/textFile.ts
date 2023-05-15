export async function fetchTextFile(textFileUrl: string, useCache = true) {
  const response = await fetch(
    textFileUrl,
    useCache ? {} : { cache: "no-cache" }
  );
  if (!response.ok) {
    throw `Error when fetching ${textFileUrl}: ${response.status} ${response.statusText}`;
  }
  return response.text();
}
