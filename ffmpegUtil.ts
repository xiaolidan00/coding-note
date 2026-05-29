import {spawn, exec} from "child_process";
import fs from "node:fs";
import path from "node:path";
const videoPath = VITE_DEV_SERVER_URL ? path.join(__dirname, "../ffmpeg/") : path.join(process.env.APP_ROOT, "ffmpeg/");

const ffmpegPath = path.join(videoPath, "ffmpeg.exe");
const ffprobePath = path.join(videoPath, "ffprobe.exe");
const m3u8File = path.join(videoPath, "index.m3u8");
const outFile = path.join(videoPath, "temp.mp4");

const runCMDBuffer = (cmd: string, args: string[]) => {
  return new Promise<Buffer>((resolve, reject) => {
    const proc = spawn(cmd as string, args, {stdio: ["ignore", "pipe", "pipe"]});
    const chunks: any[] = [];
    proc.stdout.on("data", (d) => {
      chunks.push(d);
    });
    proc.stdout.on("end", () => {
      const buf = Buffer.concat(chunks);
      resolve(buf);
    });

    proc.on("error", reject);
    // proc.stderr.on("data", () => {});
  });
};
const runCMDStr = (cmd: string, args: string[]) => {
  return new Promise<string>((resolve, reject) => {
    const proc = spawn(cmd as string, args, {stdio: ["ignore", "pipe", "pipe"]});
    let chunks = "";
    proc.stdout.on("data", (d) => {
      chunks += d;
    });
    proc.stdout.on("end", () => {
      resolve(chunks);
    });

    proc.on("error", reject);
    // proc.stderr.on("data", () => {});
  });
};
export const getVideoInfo = async (filePath: string) => {
  const args = [
    "-v",
    "quiet", // 设置日志级别为静默，只输出 -show_... 请求的数据
    "-print_format",
    "json", // 输出格式为 JSON
    "-show_format", // 显示格式信息 (如总时长、文件大小、格式名称等)
    "-show_streams", // 显示所有流的信息 (视频流、音频流、字幕流等)
    filePath // 输入文件路径
  ];
  try {
    const data = await runCMDStr(ffprobePath, args);

    return JSON.parse(data);
  } catch (error) {}
  return "";
};
export const getM3u8 = async (filePath: string, duration1: string, type: string) => {
  const duration = Number(duration1);

  const m3u8List: string[] = ["#EXTM3U", "#EXT-X-VERSION:3", "#EXT-X-TARGETDURATION:10", "#EXT-X-MEDIA-SEQUENCE:0"];

  for (let i = 0; i < duration; i += 10) {
    if (i + 10 > duration) {
      m3u8List.push(`#EXTINF:${duration - i},`);
    } else {
      m3u8List.push(`#EXTINF:10,`);
    }
    m3u8List.push(`media://video?file=${filePath}&duration=${duration}&type=${type}&start=${Math.floor(i / 10)}`);
  }
  m3u8List.push("#EXT-X-ENDLIST");

  return m3u8List.join("\n");
};
export const m3u8FileServer = async (urlObj: URL) => {
  const filePath = decodeURIComponent(urlObj.searchParams.get("file") || "");
  const type = decodeURIComponent(urlObj.searchParams.get("type") || "");
  const duration = decodeURIComponent(urlObj.searchParams.get("duration") || "");
  const content = await getM3u8(filePath, duration, type);
  return new Response(content as any, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl"
    }
  });
};

export const m3u8VideoServer = async (urlObj: URL) => {
  const filePath = decodeURIComponent(urlObj.searchParams.get("file") || "");
  const type = decodeURIComponent(urlObj.searchParams.get("type") || "");
  const start = Number(decodeURIComponent(urlObj.searchParams.get("start") || "0"));
  const duration = Number(decodeURIComponent(urlObj.searchParams.get("duration") || "0"));
  const time = start * 10;
  const args = [
    "-y",
    "-ss",
    time.toString(),
    "-i",
    filePath,
    "-t",
    time + 10 <= duration ? "10" : (duration - time).toString(),
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-c:a",
    "aac",
    "-f",
    "mpegts",
    "pipe:1"
  ];
  const pro = spawn(ffmpegPath as string, args, {stdio: ["ignore", "pipe", "ignore"]});

  const wstream = fs.createWriteStream(outFile);
  pro.stdout.pipe(wstream);
  const rstream = fs.createReadStream(outFile);
  return new Response(rstream as any, {
    status: 200,
    headers: {"Content-Type": "video/MP2T"}
  });
};

const segVideoServer = async (urlObj: URL) => {
  const filePath = decodeURIComponent(urlObj.searchParams.get("file") || "");
  const type = decodeURIComponent(urlObj.searchParams.get("type") || "");
  const start = Number(decodeURIComponent(urlObj.searchParams.get("start") || "0"));
  const duration = Number(decodeURIComponent(urlObj.searchParams.get("duration") || "0"));
  const time = start * 10;
  const args = [
    "-y",
    "-ss",
    time.toString(),
    "-i",
    filePath,
    "-t",
    time + 10 <= duration ? "10" : (duration - time).toString(),
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-movflags",
    "frag_keyframe+empty_moov",
    "-c",
    "copy",
    "-avoid_negative_ts",
    "make_zero",
    "-c:a",
    "aac",
    "-f",
    "mp4",
    "pipe:1"
  ];
  const proc = spawn(ffmpegPath as string, args, {stdio: ["ignore", "pipe", "ignore"]});
  const videoRead = new ReadableStream({
    start(controller) {
      proc.stdout.on("data", (chunk) => controller.enqueue(chunk));
      proc.stdout.on("end", () => controller.close());
      proc.on("error", (err) => controller.error(err));
    },
    cancel() {
      proc.kill();
    }
  });

  return new Response(videoRead, {
    headers: {
      "Content-Type": "video/mp4",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
