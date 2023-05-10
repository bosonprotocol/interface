export async function fetchTextFile(textFileUrl: string, useCache = true) {
  const response = await fetch(
    textFileUrl,
    useCache ? {} : { cache: "no-cache" }
  );
  return response.text();
}
