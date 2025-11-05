export const StrToBase64 = (str: string) => {
  return window.btoa(window.unescape(window.encodeURIComponent(str)));
};
export const Base64ToStr = (base64: string) => {
  return window.decodeURIComponent(window.escape(window.atob(base64)));
};
