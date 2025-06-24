const fs = require("fs");
const path = require("path");
function getType(types) {
  if (Array.isArray(types)) {
    return types.map((it) => getType(it));
  }

  if (types === Number) return "number";
  if (types === String) return "string";
  if (types === Boolean) return "boolean";
  if (types === Object) return "object";
  if (types === Array) return "array";
  if (types === Function) return "function";
}
function getDefault(v) {
  if (typeof v === "function") {
    v = JSON.stringify(v());
  }
  return v !== undefined && v !== "" ? "`" + v + "`" : "";
}
const createREADME = (configPath, distPath) => {
  const config = require(path.resolve(process.cwd(), configPath));
  console.log(config.name);
  const str = [`# \`${config.name}\` ${config.meaning}\n`];
  if (config.props) {
    str.push(`## 属性配置\n`, `|属性名|说明|类型|可选值|默认值|`, `|---|---|---|---|---|`);

    for (const p in config.props) {
      const item = config.props[p];
      str.push(
        `|\`${p}${item.isVModel ? "(v-model)" : ""}${item.isSync ? "(.sync)" : ""}\`|${item.meaning}|\`${getType(
          item.type
        )}\`|${item.options ? "`" + item.options.join(",") + "`" : ""}|${getDefault(item.default)}|`
      );
    }
  }
  if (config.events) {
    str.push("\n", `## 事件\n`, `|事件名|说明|函数参数|返回|`, `|---|---|---|---|`);
    for (const e in config.events) {
      const item = config.events[e];
      str.push(
        `|\`${e}\`|${item.meaning}|${item.params ? "`" + item.params + "`" : ""}|${
          item.returns ? "`" + item.returns + "`" : ""
        }|`
      );
    }
  }
  if (config.slots) {
    str.push("\n", `## 插槽\n`, `|插槽名|说明|插槽参数|`, `|---|---|---|`);
    for (const s in config.slots) {
      const item = config.slots[s];
      str.push(`|\`${s}\`|${item.meaning}|${item.params ? "`" + item.params + "`" : ""}|`);
    }
  }
  if (config.codes) {
    str.push("\n", `## 示例代码\n`);
    config.codes.forEach((item) => {
      str.push(`### ${item.title}\n`);
      if (item.template) str.push("```html", item.template, "```\n");
      if (item.js) str.push("```js", item.js, "```\n");
    });
  }

  fs.writeFileSync(path.resolve(process.cwd(), distPath), str.join("\n"));
};
function main() {
  const docs = require("./config.js");
  docs.forEach((item) => {
    createREADME(item.configPath, item.distPath);
  });
}
main();
