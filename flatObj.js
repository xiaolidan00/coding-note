export function setFlatObj(obj, str, value) {
  if (!obj) {
    obj = {};
  }
  const attrs = str.replace(/[\[\]]+/g, ".").split(".");
  let temp = obj;
  for (let i = 0; i < attrs.length; i++) {
    const n = attrs[i];
    if (n) {
      if (i === attrs.length - 1) {
        temp[n] = value;
      } else {
        if (!temp[n]) {
          temp[n] = {};
        }
        temp = temp[n];
      }
    }
  }
  return obj;
}

export function getFlatObj(obj, str) {
  if (!obj) {
    obj = {};
  }
  let temp = obj;
  const attrs = str.replace(/[\[\]]+/g, ".").split(".");
  for (let i = 0; i < attrs.length; i++) {
    const n = attrs[i];
    if (n) {
      if (i === attrs.length - 1) {
        return temp[n];
      } else {
        if (temp[n] === undefined) {
          return;
        }
        temp = temp[n];
      }
    }
  }
}
