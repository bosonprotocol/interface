export async function fetchTextFile(textFileUrl: string) {
  const response = await fetch(textFileUrl);
  return response.text();
}
