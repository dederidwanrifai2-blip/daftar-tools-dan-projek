import { readdir, stat } from "fs/promises";
import { join, normalize, resolve } from "path";
import reposConfig from "../../repos-config.json" assert { type: "json" };

const ROOT = process.cwd();

// Pola file yang dilarang ditampilkan
const BLOCKED = [/\.env$/i, /\.key$/i, /\.pem$/i, /credentials/i, /secret/i, /token/i];

function isBlocked(filename) {
  return BLOCKED.some((pattern) => pattern.test(filename));
}

export default async function handler(req, res) {
  const { repoId, path: reqPath = "" } = req.query;

  // Validasi repoId ada di whitelist
  const repoConf = reposConfig.repos[repoId];
  if (!repoConf) {
    return res.status(404).json({ error: "Repo tidak ditemukan" });
  }

  // Sanitasi path: larang traversal
  const safePath = normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const repoRoot = resolve(ROOT, repoConf.folder);
  const targetPath = resolve(repoRoot, safePath);

  // Pastikan target masih di dalam repoRoot
  if (!targetPath.startsWith(repoRoot)) {
    return res.status(403).json({ error: "Akses ditolak" });
  }

  try {
    const entries = await readdir(targetPath, { withFileTypes: true });

    const items = entries
      .filter((e) => !isBlocked(e.name))
      .map((e) => ({
        nama: e.name,
        tipe: e.isDirectory() ? "folder" : "file",
        path: safePath ? `${safePath}/${e.name}` : e.name,
      }))
      .sort((a, b) => {
        // Folder dulu, lalu file
        if (a.tipe !== b.tipe) return a.tipe === "folder" ? -1 : 1;
        return a.nama.localeCompare(b.nama, "id");
      });

    res.status(200).json({
      repoId,
      path: safePath,
      nama: repoConf.nama,
      items,
    });
  } catch {
    res.status(404).json({ error: "Folder tidak ditemukan" });
  }
}