import fs = require("fs");
import template = require("lodash.template");
import * as mkdirp from "mkdirp";
import path = require("path");
import * as winston from "winston";
import chalk from "chalk";
import { getCurrentDir } from "./common";
const os = require("os");
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from "change-case";

export class Base {
  endl() {
    return os.EOL;
  }
  getCurrentDir(): string {
    return process.env.PWD || process.cwd();
  }
  getExtname(filename: string) {
    const i = filename.indexOf(".");
    return i < 0 ? "" : filename.substr(i);
  }
  replaceKeyword(
    tplContent: string,
    keyword: string,
    level = 0,
    pagePath: string = "",
  ) {
    const compiled = template(tplContent);
    const uFKeyword = pascalCase(keyword);
    const kebabKeyword = paramCase(keyword);
    const snakeKeyword = snakeCase(keyword);
    const levelPath = [];
    for (let i = 0; i < level; i++) {
      levelPath.push("../");
    }
    if (pagePath) {
      pagePath += "/";
    }
    return compiled({
      keyword,
      uFKeyword,
      kebabKeyword,
      snakeKeyword,
      levelPath: levelPath.join(""),
      pagePath,
    });
  }
  mkdirs(dirpath: string, mode: number, callback?: () => void) {
    if (fs.existsSync(dirpath)) {
      callback && callback();
    } else {
      this.mkdirs(path.dirname(dirpath), mode, () => {
        fs.mkdirSync(dirpath, mode);
        callback && callback();
      });
    }
  }

  writeFile(
    basePath: string,
    fileName: string,
    data: any,
    overwrite: boolean = false,
  ) {
    // const srcRoot = path.join(commons.currentPath(),  dir)
    const filePath = path.join(basePath, fileName);

    if (!overwrite && fs.existsSync(basePath) && fs.existsSync(filePath)) {
      return;
    }
    if (!fs.existsSync(basePath)) {
      mkdirp.sync(basePath);
    }
    fs.writeFile(filePath, data, { encoding: "utf8", flag: "w" }, (err) => {
      if (err) {
        console.log(chalk.red(err.message));
        return;
      }
      console.log(chalk.green(`created file: ${filePath}`));
    });
  }

  addContentToFile(
    basePath: string,
    fileName: string,
    original: string,
    anchor: string,
    content: string,
    callback?: (err?: NodeJS.ErrnoException) => any,
  ) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, original);
    }
    // 读文件写文件
    fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
      if (err) {
        callback && callback(err);
        return;
      }
      let fileContent = data.toString();
      const reg = new RegExp(anchor);
      if (fileContent.search(reg) === -1) {
        console.log(chalk.red("Failed! Anchor not find."));
        return;
      }
      fileContent = fileContent.replace(reg, content);
      fs.writeFile(filePath, fileContent, { encoding: "utf8" }, (error) => {
        if (error) {
          callback && callback(error);
          return;
        }
        callback && callback();
      });
    });
  }

  deleteContentFromFile(
    basePath: string,
    fileName: string,
    pattern: string,
    callback?: (err?: NodeJS.ErrnoException) => any,
  ) {
    const pathName = path.join(basePath, fileName);
    // console.log(pathName);
    fs.readFile(pathName, { encoding: "utf8" }, (err, data) => {
      if (err) {
        winston.log("error", err.message, err);
        return;
      }
      let content = data.toString();
      // console.log('readed');
      // console.log(pattern);
      const reg = new RegExp(pattern);
      if (content.search(reg) === -1) {
        const error = new Error();
        error.name = "没有找到配置";
        callback && callback(error);
        return;
      }
      content = content.replace(reg, "");
      fs.writeFile(pathName, content, { encoding: "utf8" }, (error) => {
        if (error) {
          callback && callback(error);
          return;
        }
        // console.log('writed');
        callback && callback();
      });
    });
  }
}

export class Weapp extends Base {
  buildPage(name: string) {
    let fileName = paramCase(name);
    let beforePath = "";
    if (name.indexOf("/") !== -1) {
      const fn = name.substring(name.lastIndexOf("/") + 1);
      fileName = paramCase(fn);
      beforePath = name
        .substring(0, name.lastIndexOf("/") + 1)
        .replace(/^\//, "");
    }
    const miniprogramRoot = path.join(getCurrentDir(), "miniprogram");
    const config = `"pages/${beforePath}${fileName}/${fileName}"`;

    fs.readFile(
      miniprogramRoot + "/app.json",
      { encoding: "utf8" },
      (error, data) => {
        const content = data;
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
          console.log(chalk.red(error));
        }
      },
    );
  }

  buildComponent(name: string) {
    const fileName = paramCase(name);
    const miniprogramRoot = path.join(getCurrentDir(), "miniprogram");
    fs.readdir(miniprogramRoot + "/components", (error, files) => {
      if (error) {
        console.log(chalk.red(error.message));
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

  buildService(name: string) {
    const fileName = paramCase(name) + ".serv.ts";
    const miniprogramRoot = path.join(getCurrentDir(), "miniprogram");
    fs.readdir(miniprogramRoot + "/core/services", (error, files) => {
      if (error) {
        console.log(chalk.red(error.message));
        return;
      } else {
        const existed: any[] = [];
        for (const file of files) {
          const dir = miniprogramRoot + "/core/services/" + file;
          const stats = fs.statSync(dir);
          if (stats.isFile()) {
            existed.push(file);
          }
        }
        if (existed.indexOf(fileName) !== -1) {
          console.log(chalk.red("已经存在！"));
          return;
        }
        this.createServiceFile(name);
      }
    });
  }

  buildFuntionInService(name: string, service: string) {
    //
    console.log(name, service);
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
      getCurrentDir(),
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

  private createServiceFile(name: string) {
    const miniprogramRoot = path.join(
      getCurrentDir(),
      "miniprogram/core/services",
    );
    const fileName = name + ".serv.ts";
    const fileContent = `import BaseService from "./base.serv";

export class ${pascalCase(name)}Service extends BaseService {
  constructor() {
    super();
  }
}
`;

    super.writeFile(miniprogramRoot, fileName, fileContent);
  }
}
