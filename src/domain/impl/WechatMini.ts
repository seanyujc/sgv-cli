import fs = require("fs");
import path = require("path");
import * as winston from "winston";
import { Base } from "./Base";

export class WechatMini extends Base {
  buildPage(name: string) {
    let fileName = this.changeCaseKebab(name);
    let beforePath = "";
    if (name.indexOf("/") !== -1) {
      const fn = name.substring(name.lastIndexOf("/") + 1);
      fileName = this.changeCaseKebab(fn);
      beforePath = name
        .substring(0, name.lastIndexOf("/") + 1)
        .replace(/^\//, "");
    }
    const miniprogramRoot = path.join(super.getCurrentDir(), "miniprogram");
    const config = `"pages/${beforePath}${fileName}/${fileName}"`;

    fs.readFile(miniprogramRoot + "/app.json", (error, data) => {
      const content = data.toString("utf8");
      try {
        const appJson = JSON.parse(content);
        if ((appJson.pages as string[]).indexOf(config) === -1) {
          appJson.pages = appJson.pages.map(JSON.stringify);
          appJson.pages.push(config);
          const val = appJson.pages.join("," + super.endl() + "    ");
          const res = content.replace(
            /"pages": \[([^\]]*)/,
            `"pages": [
    ${val}
`,
          );
          super.writeFile(miniprogramRoot, "/app.json", res, true);
          this.buildComponentBase("pages", fileName, beforePath, false);
        }
      } catch (error) {
        winston.error(error);
      }
    });
  }

  buildComponent(name: string) {
    const fileName = this.changeCaseKebab(name);
    const miniprogramRoot = path.join(super.getCurrentDir(), "miniprogram");
    fs.readdir(miniprogramRoot + "/components", (error, files) => {
      if (error) {
        winston.error(error.message);
        return;
      } else {
        const existed: any[] = [];
        for (const file of files) {
          const dir = miniprogramRoot + "/components/" + file;
          const stats = fs.statSync(dir);
          if (stats.isDirectory()) {
            existed.push(file);
          }
        }
        if (existed.indexOf(fileName) !== -1) {
          winston.warn("已经存在！");
          return;
        }
        this.buildComponentBase("components", fileName);
      }
    });
  }

  private buildComponentBase(
    dirPath: string,
    fileName: string,
    prefix = "",
    isComponent = true,
  ) {
    const p = [dirPath];
    if (prefix) {
      p.push(prefix);
    }
    const basePath = path.join(
      super.getCurrentDir(),
      "miniprogram/" + p.join("/"),
      fileName,
    );

    const jsonContent = isComponent
      ? `{
  "component": true,
  "usingComponents": {
  }
}
`
      : `{
  "usingComponents": {
  }
}`;

    super.writeFile(basePath, fileName + ".json", jsonContent);

    const tsContent = isComponent
      ? `/**
 * ${fileName}
 */
Component({
  data: {},
  methods: {},
});
`
      : `/**
 * ${fileName}
 */
Page({
  data: {},
  onLoad() {
    // todo
  },
  onShow() {
    // todo
  },
  onReady() {
    // todo
  },
});
`;
    super.writeFile(basePath, fileName + ".ts", tsContent);
    super.writeFile(
      basePath,
      fileName + ".wxml",
      `<view class="container">${fileName}</view>`,
    );
    super.writeFile(basePath, fileName + ".styl", ``);
  }
}
