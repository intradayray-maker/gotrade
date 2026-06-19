import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "tmp", "dividend-cache.json");

export function readCache() {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;

    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    const json = JSON.parse(raw);

    const age = Date.now() - json.timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (age > oneDay) return null;

    return json.data;
  } catch {
    return null;
  }
}

export function writeCache(data: any) {
  try {
    const payload = {
      timestamp: Date.now(),
      data,
    };

    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(payload));
  } catch (err) {
    console.error("Cache write error:", err);
  }
}
