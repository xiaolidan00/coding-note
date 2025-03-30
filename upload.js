export const uploadFile = (accept) => {
  return new Promise((resolve) => {
    const upload = document.createElement("input");
    upload.style.position = "fixed";
    upload.style.opacity = "0";
    upload.accept = accept;
    upload.type = "file";
    upload.onchange = () => {
      if (upload.files?.length) {
        resolve(upload.files[0]);
      }
      document.body.removeChild(upload);
    };
    document.body.appendChild(upload);
    upload.click();
  });
};
