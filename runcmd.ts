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