import fetch from "node-fetch";

export async function fetchWikipediaExtract(title) {
  // Uses Wikipedia REST API to fetch page extract (summary)
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.extract || "";
}
