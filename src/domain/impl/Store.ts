import fs = require("fs");
import path = require("path");
import * as winston from "winston";
import { Base } from "./Base";
import { STORE } from "../../config";

export class Store extends Base {
  templateFile: string = path.join(__dirname, "../../../", ".sgv/store.ts");
  targetPath: string;
  name: string;

  constructor(
    pageName: string,
    compName: string,
    private states?: string[],
    private appName: string = "app",
  ) {
    super();
    if (pageName) {
      this.targetPath = "src/" + this.appName + "/pages/" + pageName;
      this.name = pageName + "Page";
    } else if (compName) {
      this.targetPath = "src/" + this.appName + "/components/" + compName;
      this.name = compName + "Comp";
    }
  }

  copyFile() {
    let templateFile = this.templateFile;
    // 如果目标位置已存在文件
    if (fs.existsSync(this.targetPath + "/store.ts")) {
      templateFile = this.targetPath + "/store.ts";
    }

    fs.readFile(templateFile, (err, data) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      const content = super.replaceKeyword(data.toString("utf8"), this.name);
      const basePath = path.join(super.getCurrentDir(), this.targetPath);
      super.writeFile(basePath, "store.ts", content);
    });
  }

  addContentToStore(key: string, type: string) {
    let initVal = '""';
    if (type.indexOf("[]") === -1) {
      initVal = "[]";
    }
    if (type.indexOf("number") === -1) {
      initVal = "0";
    }
    const stateContent =
      STORE.STATE_ANCHOR + super.endl() + "  " + key + ": " + initVal + ",";
    super.addContentToFile(this.targetPath, "store.ts", "", STORE.STATE_ANCHOR, stateContent);
  }
}
