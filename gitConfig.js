const fs = require("fs");
const os = require("os");
const path = require("path");

function getPath(type) {
  let configPath = "";
  const workDir = process.cwd();

  if (type === "global") {
    configPath = path.join(os.homedir(), ".gitconfig");
  } else {
    configPath = path.resolve(workDir, ".git/config");
  }

  if (!fs.existsSync(configPath)) {
    configPath = path.join(os.homedir(), ".config/git/config");
  }

  return fs.existsSync(configPath) ? configPath : null;
}
//读取git配置
module.exports = function getGitConfig(type) {
  const p = getPath(type);
  if (!p) return {};
  const data = fs.readFileSync(p, "utf8");
  const arr = data.toString().split("\n");
  const obj = {};
  let pre = "";
  arr.forEach((a) => {
    if (!a) return;
    if (a.indexOf("[") === -1) {
      const aa = a.replace(/\s/g, "");
      if (!aa) return;
      const keyVal = aa.split("=");
      obj[pre + "." + keyVal[0]] = keyVal[1];
    } else {
      const key = a.replace(/\[|\]/g, "");
      pre = key.split(" ")[0];
    }
  });

  return obj;
};
