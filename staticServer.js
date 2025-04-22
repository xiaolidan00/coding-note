//静态服务
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
const port = 5500;
const fileType = {
  png: "image/png",
  jpg: "image/jpg",
  html: "text/html",
  js: "application/javascript",
  css: "text/css",
  json: "application/json"
};
http
  .createServer((req, res) => {
    const url = req.url === "/" ? "/index.html" : req.url;
    const type = url.substring(url.lastIndexOf(".") + 1);
    const filePath = path.join(__dirname, url);
    console.log(url, type);
    fs.readFile(filePath, (err, data) => {
      if (err) res.end(err.message);
      else {
        //禁止iframe嵌套
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader("Content-Security-Policy", `frame-ancestors 'self'`);
        //静态资源MIME类型
        try {
          if (fileType[type]) {
            res.setHeader("Content-Type", fileType[type]);
          }
        } catch (err) {}
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(data);
      }
    });
  })
  .listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
