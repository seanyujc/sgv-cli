import fs = require("fs");
import path = require("path");
import * as winston from "winston";
import { Base } from "./Base";
import { COMP } from "../../config/index";

export class Component extends Base {
  name: string;
  templatePath: string;
  constructor(private compName: string) {
    super();
    this.templatePath = path.join(__dirname, "../../../", ".sgv/page/main");
  }

  copyFiles(): void {
    // winston.info(this.templatePath);
    // winston.info(path.join("./src/pages"));
    fs.readdir(this.templatePath, (err, files) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      files.forEach((fileName, index, array) => {
        const extname = super.getExtname(fileName);
        const pathName = path.join(this.templatePath, fileName);
        fs.readFile(pathName, (error, data) => {
          const content = super.replaceKeyword(data.toString("utf8"), this.compName);
          const basePath = path.join(super.getCurrentDir(), "src/app/components", this.compName);
          super.writeFile(basePath, this.compName + extname, content);
        });
      });
    });
  }

  addFactoryConfig(): void {
    const basePath = path.join(super.getCurrentDir(), "src/app/components");
    const fileName = "factory.comp.ts";
    const content = super.replaceKeyword(COMP.FACTORY_CONTENT, this.compName);
    const addContent = COMP.FACTORY_ANCHOR + super.endl() + content;

    super.addContentToFile(basePath, fileName, COMP.FACTORY_ANCHOR, COMP.FACTORY_ANCHOR, addContent, (err) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Added " + this.compName + " components's factory config!");
    });
  }
}