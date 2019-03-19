import fs = require("fs");
import template = require("lodash.template");
import * as mkdirp from "mkdirp";
import path = require("path");
import * as winston from "winston";
import { IBase } from "../IBase";
const os = require("os");

export class Base implements IBase {
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
  /**
   * 转换成 Pascal
   * @param str 驼峰字符串
   */
  changeCasePascal(str: string) {
    const first = str.substr(0, 1).toLocaleUpperCase();
    const surplus = str.substr(1, str.length);
    return first + surplus;
  }
  changeCaseConstant(str: string) {
    if (str) {
      return str.replace(/([A-Z])/g, "_$1").toLocaleUpperCase();
    }
  }
  changeCaseKebab(str: string) {
    if (str) {
      return str.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
    }
  }
  changeCaseSnake(str: string) {
    if (str) {
      return str.replace(/([A-Z])/g, "_$1").toLocaleLowerCase();
    }
  }
  replaceKeyword(tplContent: string, keyword: string) {
    const compiled = template(tplContent);
    const uFKeyword = this.changeCasePascal(keyword);
    const kebabKeyword = this.changeCaseKebab(keyword);
    const snakeKeyword = this.changeCaseSnake(keyword);
    return compiled({ keyword, uFKeyword, kebabKeyword, snakeKeyword });
  }
  mkdirs(dirpath: string, mode: number, callback?: () => void) {
    if (fs.existsSync(dirpath)) {
      callback();
    } else {
      this.mkdirs(path.dirname(dirpath), mode, () => {
        fs.mkdirSync(dirpath, mode);
        callback();
      });
    }
  }

  writeFile(
    basePath: string,
    fileName: string,
    data,
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
    fs.writeFile(filePath, data, { flag: "w" }, err => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info(`created file: ${filePath}`);
    });
  }

  addContentToFile(
    basePath: string,
    fileName: string,
    original: string,
    anchor: string,
    content: string,
    callback?: (err: NodeJS.ErrnoException) => any,
  ) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, original);
    }
    // 读文件写文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        callback(err);
        return;
      }
      let fileContent = data.toString();
      const reg = new RegExp(anchor);
      if (fileContent.search(reg) === -1) {
        winston.error("Failed! Anchor not find.");
        return;
      }
      fileContent = fileContent.replace(reg, content);
      fs.writeFile(filePath, fileContent, error => {
        if (error) {
          callback(error);
          return;
        }
        callback(undefined);
      });
    });
  }

  deleteContentFromFile(
    basePath: string,
    fileName: string,
    pattern: string,
    callback?: (err: NodeJS.ErrnoException) => any,
  ) {
    const pathName = path.join(basePath, fileName);
    // console.log(pathName);
    fs.readFile(pathName, (err, data) => {
      if (err) {
        winston.log("error", err.message, err);
        return;
      }
      let content = data.toString("utf8");
      // console.log('readed');
      // console.log(pattern);
      const reg = new RegExp(pattern);
      if (content.search(reg) === -1) {
        const error = new Error();
        error.name = "没有找到配置";
        callback(error);
        return;
      }
      content = content.replace(reg, "");
      fs.writeFile(pathName, content, error => {
        if (error) {
          callback(error);
          return;
        }
        // console.log('writed');
        callback(undefined);
      });
    });
  }
}
