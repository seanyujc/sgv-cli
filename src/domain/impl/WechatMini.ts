import fs = require("fs");
import path = require("path");
import { Base } from "./Base";

export class WechatMini extends Base {
  buildPage(name: string) {
    const basePath = path.join(
      super.getCurrentDir(),
      "miniprogram/pages",
      this.changeCaseKebab(name),
    );

    const fileName = this.changeCaseKebab(name);

    super.writeFile(
      basePath,
      fileName + ".json",
      `{
  "usingComponents": {
  }
}
`,
    );
    super.writeFile(
      basePath,
      fileName + ".ts",
      `/**
 * ${name}
 */
Page({});
`,
    );
    super.writeFile(
      basePath,
      fileName + ".wxml",
      `<view class="container"></view>`,
    );
    super.writeFile(basePath, fileName + ".wxss", ``);

    const dir = path.join(super.getCurrentDir(), "miniprogram");
    fs.readFile(dir + "/app.json", (error, data) => {
      const content = data.toString("utf8");
      const res = content.replace(
        /"pages": \[([^\]]*)/,
        `"pages": [
    "pages/${fileName}/${fileName}",$1`,
      );
      // console.log(res);
      super.writeFile(dir, "/app.json", res);
    });
  }
}
