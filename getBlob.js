export function getBlob(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.onerror = function (err) {
      console.log(err);
      reject();
    };
    xhr.send();
  });
}
