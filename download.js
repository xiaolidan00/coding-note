export const downloadFile = (buffer, filename) => {
  const url = URL.createObjectURL(new File([buffer], filename));
  const a = document.createElement("a");
  a.style = "display: none";
  a.download = filename;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
