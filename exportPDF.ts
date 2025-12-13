import {snapdom} from "@zumer/snapdom";

import {jsPDF} from "jspdf";
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
export function exportCanvas(dom: HTMLElement) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    snapdom
      .toCanvas(dom)
      .then((canvas: HTMLCanvasElement) => {
        resolve(canvas);
      })
      .catch((err) => {
        console.log("🚀 ~ exportPdf.ts ~ exportCanvas ~ err:", err);
        reject();
      });
  });
}

export function exportPDF(dom: HTMLElement, name: string) {
  return new Promise<any>((resolve, reject) => {
    exportCanvas(dom).then((canvas) => {
      // document.getElementById('reportContainer')!.appendChild(canvas);

      const doc = new jsPDF({
        unit: "px",
        precision: 32,
        floatPrecision: 32,
        putOnlyUsedFonts: true,
        format: [canvas.width, canvas.height]
      });

      doc.addImage(canvas, "PNG", 0, 0, canvas.width, canvas.height);
      try {
        doc.save(name + ".pdf");
        resolve(canvas);
      } catch (error) {
        reject();
        console.log("🚀 ~ exportPdf.ts ~ exportPDF ~ error:", error);
      }
    });
  });
}
