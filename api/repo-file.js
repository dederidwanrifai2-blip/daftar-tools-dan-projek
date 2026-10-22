import { readFile } from "fs/promises";
import { join, normalize, resolve, extname } from "path";
import reposConfig from "../../repos-config.json" assert { type: "json" };

const ROOT = process.cwd();

const BLOCKED = [/\.env$/i, /\.key$/i, /\.pem$/i, /credentials/i, /secret/i, /token/i];
const MAX_FILE_SIZE = 500 * 1024; // 500KB

// Map ekstensi ke bahasa Prism
const LANG_MAP = {
  ".py": "python",
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".json": "json",
  ".sh": "bash",
  ".bash": "bash",
  ".md": "markdown",
  ".txt": "plain",
  ".css": "css",
  ".html": "html",
  ".yml": "yaml",
  ".yaml": "yaml",
};

function isBlocked(filename) {
  return BLOCKED.some((p) => p.test(filename));
}

export default async function handler(req, res) {
  const { repoId, path: reqPath } = req.query;

  if (!reqPath) return res.status(400).json({ error: "Path wajib diisi" });

  const repoConf = reposConfig.repos[repoId];
  if (!repoConf) return res.status(404).json({ error: "Repo tidak ditemukan" });

  const safePath = normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const repoRoot = resolve(ROOT, repoConf.folder);
  const targetPath = resolve(repoRoot, safePath);

  // Path traversal check
  if (!targetPath.startsWith(repoRoot)) {
    return res.status(403).json({ error: "Akses ditolak" });
  }

  // Blocked file check
  const filename = targetPath.split(/[/\\]/).pop();
  if (isBlocked(filename)) {
    return res.status(403).json({ error: "File ini tidak dapat diakses" });
  }

  try {
    const fileStat = await import("fs/promises").then((m) => m.stat(targetPath));
    if (fileStat.size > MAX_FILE_SIZE) {
      return res.status(413).json({ error: "File terlalu besar untuk ditampilkan" });
    }

    const isi = await readFile(targetPath, "utf-8");
    const ext = extname(filename).toLowerCase();
    const bahasa = LANG_MAP[ext] || "plain";

    res.status(200).json({ repoId, path: safePath, nama: filename, bahasa, isi });
  } catch {
    res.status(404).json({ error: "File tidak ditemukan" });
  }
}