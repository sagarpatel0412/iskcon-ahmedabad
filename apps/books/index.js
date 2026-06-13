const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs/promises");
const path = require("path");
const sanitize = require("sanitize-filename");

const BASE = "https://prabhupadabooks.com";
const START_URLS = [
  `${BASE}/bg`,   // Bhagavad-gita
  `${BASE}/sb`,   // Srimad Bhagavatam
  `${BASE}/cc`,   // Caitanya-caritamrta
];

const visited = new Set();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Personal reading downloader" },
  });
  return data;
}

async function saveText(url, title, text) {
  const folder = path.join(__dirname, "books");
  await fs.mkdir(folder, { recursive: true });

  const filename = sanitize(title || url.replace(BASE, "").replace(/\//g, "_")) + ".txt";
  await fs.writeFile(path.join(folder, filename), text, "utf8");

  console.log("Saved:", filename);
}

async function crawl(url) {
  if (visited.has(url)) return;
  visited.add(url);

  console.log("Reading:", url);

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    $("script, style, nav").remove();

    const title = $("h1").first().text().trim() || $("title").text().trim();
    const text = $("body").text().replace(/\n{3,}/g, "\n\n").trim();

    if (text.length > 500) {
      await saveText(url, title, text);
    }

    const links = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const fullUrl = href.startsWith("http")
        ? href
        : new URL(href, BASE).href;

      if (
        fullUrl.startsWith(BASE) &&
        (
          fullUrl.includes("/bg") ||
          fullUrl.includes("/sb") ||
          fullUrl.includes("/cc")
        )
      ) {
        links.push(fullUrl.split("#")[0]);
      }
    });

    for (const link of links) {
      await sleep(1000);
      await crawl(link);
    }
  } catch (err) {
    console.log("Failed:", url, err.message);
  }
}

(async () => {
  for (const url of START_URLS) {
    await crawl(url);
  }
})();