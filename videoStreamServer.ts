import fs from "node:fs";
const getRange = async (filePath: string, rangeHeader: string | null) => {
  const {size} = await fs.promises.stat(filePath);
  let start = 0,
    end = size - 1;
  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    if (match) {
      start = match[1] ? parseInt(match[1], 10) : start;
      end = match[2] ? parseInt(match[2], 10) : end;
    }
  }
  const chunkSize = (end || size - 1) - start + 1;

  return {start, end, chunkSize, size};
};
export const videoStreamServer = () => {
  const rangeHeader = req.headers.get("Range");

  const {start, end, chunkSize, size} = await getRange(filePath, rangeHeader);
  closeStream();
  videoStream = fs.createReadStream(filePath, {start, end});
  videoStream.on("error", (error) => {
    closeStream();
    console.log("error", error);
  });

  return new Response(videoStream as any, {
    status: rangeHeader ? 206 : 200,
    headers: {
      "Content-Range": `bytes ${start}-${end || size - 1}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
      ...corsHeaders
    }
  });
};
