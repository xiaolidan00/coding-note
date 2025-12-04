import html2canvas from "html2canvas";
export function convertBase64UrlToFile(base64: string, fileName: string) {
  let parts = base64.split(";base64,");
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new File([uInt8Array], fileName, {type: contentType});
}
export const downloadFile = (buffer: File, filename: string) => {
  const url = URL.createObjectURL(buffer);
  const a = document.createElement("a");
  a.style = "display: none";
  a.download = filename;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
export function captureDom(dom: HTMLElement) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    html2canvas(dom, {
      useCORS: true,
      // backgroudColor: "transparent",
      width: dom.scrollWidth,
      height: dom.scrollHeight,
      ignoreElements: (el: Element) => {
        if (el.classList.contains("cr-no-canvas")) {
          return true;
        }
        return false;
      }
    })
      .then((canvas) => {
        resolve(canvas);
      })
      .catch((err) => {
        console.log("🚀 ~ screenshot.ts ~ captureDom ~ err:", err);
        reject(err);
      });
  });
}

export function getScreenShotFile(dom: HTMLElement, name: string) {
  return new Promise<File>((resolve, reject) => {
    captureDom(dom)
      .then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const fileName = (name || "") + new Date().getTime() + ".png";
        const file = convertBase64UrlToFile(image, fileName);
        resolve(file);
      })
      .catch((err) => {
        reject();
      });
  });
}
export function downloadScreenShot(dom: HTMLElement, name: string) {
  return new Promise<File>((resolve, reject) => {
    getScreenShotFile(dom, name)
      .then((file) => {
        downloadFile(file, file.name);
        resolve(file);
      })
      .catch((err) => {
        reject();
      });
  });
}
