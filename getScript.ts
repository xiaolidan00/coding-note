async function getScript(id: string, url: string) {
  return new Promise<boolean>((resolve, reject) => {
    const scriptID = id + "SCRIPT";
    const script = document.getElementById(scriptID);

    if (!script) {
      (window as any)["_INIT_" + id] = () => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      };
      const dom = document.createElement("script");
      dom.id = scriptID;
      dom.type = "text/javascript";
      dom.src = url;
      dom.defer = true;
      document.head.appendChild(dom);
      dom.onload = () => {
        console.log("load " + id + " OK");
      };
      dom.onerror = (e) => {
        console.log("load " + id + " error", e);
        reject(false);
      };
      setTimeout(() => {
        console.log("load " + id + " timeout");
        reject(false);
      }, 3000);
    } else {
      resolve(true);
    }
  });
}
function getCSS(id: string, cssUrl: string) {
  const styleID = id + "STYLE";
  const styleDOM = document.getElementById(styleID);
  if (!styleDOM) {
    const dom = document.createElement("link");
    dom.id = styleID;
    dom.rel = "stylesheet";
    dom.href = cssUrl;
  }
}
