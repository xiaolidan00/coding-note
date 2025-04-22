import { downloadFile } from './download.js';
export function convertBase64UrlToFile(base64, fileName) {
  let parts = base64.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new File([uInt8Array], fileName, { type: contentType });
}

export function saveCanvas(canvas) {
  const image = canvas.toDataURL('image/png');
  const fileName = new Date().getTime() + '.png';
  const file = convertBase64UrlToFile(image, fileName);
  downloadFile(file, fileName);
}
