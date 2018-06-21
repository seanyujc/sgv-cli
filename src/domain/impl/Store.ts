import fs = require("fs");
import path = require("path");
import * as winston from "winston";
import { Base } from "./Base";

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
    fs.readFile(this.templateFile, (err, data) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      const content = super.replaceKeyword(
        data.toString("utf8"),
        this.name,
      );
      const basePath = path.join(
        super.getCurrentDir(),
        this.targetPath,
      );
      super.writeFile(basePath, "store.ts", content);
    });
  }
}
