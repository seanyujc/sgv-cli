import fs = require("fs");
import path = require("path");
import * as rimraf from "rimraf";
import * as winston from "winston";
import { COMP } from "../../config/index";
import { Base } from "./Base";

export class Component extends Base {
  name: string;
  templatePath: string;
  constructor(private compName: string, private appName: string = "app") {
    super();
    this.templatePath = path.join(__dirname, "../../../", ".sgv/comp");
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
          const content = super.replaceKeyword(
            data.toString("utf8"),
            this.compName,
          );
          const basePath = path.join(
            super.getCurrentDir(),
            "src/" + this.appName + "/components",
            this.changeCaseKebab(this.compName),
          );
          super.writeFile(
            basePath,
            this.changeCaseKebab(this.compName) + extname,
            content,
          );
        });
      });
    });
  }

  addFactoryConfig(): void {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/components",
    );
    const fileName = "factory.comp.ts";
    const content = super.replaceKeyword(
      COMP.FACTORY_CONTENT,
      this.compName,
    );
    const addContent = COMP.FACTORY_ANCHOR + super.endl() + content;

    super.addContentToFile(
      basePath,
      fileName,
      COMP.FACTORY_ANCHOR,
      COMP.FACTORY_ANCHOR,
      addContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info(
          "Added " + this.compName + " components's factory config!",
        );
      },
    );
  }

  removeFiles() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/components",
      this.changeCaseKebab(this.compName),
    );
    rimraf(basePath, err => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Removed All files of " + this.compName + " component.");
    });
  }

  deleteFactoryConfig() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/components",
    );
    const fileName = "factory.comp.ts";
    const pattern =
      super.replaceKeyword(
        COMP.FACTORY_PATTERN,
        this.compName,
      ) + super.endl();

    super.deleteContentFromFile(basePath, fileName, pattern, err => {
      if (err && err.name === "without") {
        winston.error("Without config option in factory file!");
        return;
      } else if (err) {
        winston.log("error", err.message, err);
        return;
      }
      winston.info(
        "Deleted Factory function of " + this.compName + " component.",
      );
    });
  }
}
