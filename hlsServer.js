"use strict";
import {createServer} from "node:http";
import {readFile, readdir, unlink, mkdir, access} from "node:fs/promises";
import {existsSync} from "node:fs";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ffmpeg = path.join(__dirname, "ffmpeg.exe");
const input = path.join(__dirname, "input.mp4");
const outDir = path.join(__dirname, "hls");
const m3u8Path = path.join(outDir, "playlist.m3u8");
const PORT = 3000;

async function ensureHls() {
  if (!existsSync(input)) {
    console.error(`input file not found: ${input}`);
    process.exit(1);
  }
  if (existsSync(outDir)) {
    const files = await readdir(outDir);
    await Promise.all(files.map(f => unlink(path.join(outDir, f))));
  }
  await mkdir(outDir, {recursive: true});
  return new Promise((resolve, reject) => {
    const args = [
      "-i", input,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-c:a", "aac",
      "-f", "hls",
      "-hls_time", "10",
      "-hls_list_size", "0",
      "-hls_segment_filename", path.join(outDir, "seg%d.ts"),
      m3u8Path
    ];
    const proc = spawn(ffmpeg, args, {stdio: ["ignore", "pipe", "pipe"]});
    let buf = "";
    proc.stderr.on("data", d => { buf += d; });
    proc.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}\n${buf}`));
    });
    proc.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const p = u.pathname;

  if (p === "/m3u8") {
    try {
      const content = await readFile(m3u8Path, "utf-8");
      const modified = content.replace(/seg(\d+)\.ts/g, "/video/$1");
      res.writeHead(200, {"Content-Type": "application/vnd.apple.mpegurl"});
      res.end(modified);
    } catch {
      res.writeHead(500);
      res.end("Internal error");
    }
    return;
  }

  const m = p.match(/^\/video\/(\d+)$/);
  if (m) {
    try {
      const data = await readFile(path.join(outDir, `seg${m[1]}.ts`));
      res.writeHead(200, {"Content-Type": "video/MP2T"});
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Segment not found");
    }
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

ensureHls().then(() => {
  server.listen(PORT, () => console.log(`HLS ready at http://localhost:${PORT}/m3u8`));
}).catch(e => {
  console.error("HLS generation failed:", e.message);
  process.exit(1);
});