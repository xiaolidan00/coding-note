import fs from 'fs';
import axios from 'axios';
const urls = [
  'http://10.0.3.250:9099/bi-package/v3/api-docs/default',
  'http://10.0.3.250:9099/bi-package/v3/api-docs/Free%20login'
];
const apiList = {};
function getApi(url) {
  return new Promise((resolve) => {
    axios.get(url).then(({ data }) => {
      for (let k in data.paths) {
        const set = data.paths[k];
        const m = Object.keys(set)[0];
        let name = k.replace(/(\/|-)[a-z]/g, (str, match) => {
          return str.substring(1).toUpperCase();
        });

        let isPath = false;
        if (k.match(/\/\{[a-zA-Z]+\}/)) {
          isPath = true;
          name = name.replace(/\/\{([a-zA-Z]+)\}/g, (str, match) => {
            const t = str.substring(2, 3).toUpperCase();
            return t + str.substring(3, str.length - 1);
          });
        }
        apiList[m + name] = { url: k, method: m, title: set[m].summary, isPath };
      }
      resolve();
    });
  });
}
async function main() {
  for (let i = 0; i < urls.length; i++) {
    await getApi(urls[i]);
  }
  fs.writeFile('./src/api/api-doc.ts', 'export default ' + JSON.stringify(apiList), (err) => {
    if (err) return console.log(err);
    console.log('update api-doc ok');
  });
}
main();
