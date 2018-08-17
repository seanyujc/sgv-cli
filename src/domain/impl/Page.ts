import fs = require("fs");
import path = require("path");
import * as rimraf from "rimraf";
import * as winston from "winston";
import { IPageConst, PAGE } from "../../config";
import { IPage } from "../IPage";
import { Base } from "./Base";

export class Page extends Base implements IPage {
  templatePath: string;
  routerTplPath: string;

  constructor(private pageName: string, private appName: string = "app") {
    super();
    this.templatePath = path.join(__dirname, "../../../", ".sgv/page/main");
    this.routerTplPath = path.join(
      __dirname,
      "../../../",
      ".sgv/page/index.router.ts",
    );
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
            this.pageName,
          );
          const basePath = path.join(
            super.getCurrentDir(),
            "src/" + this.appName + "/pages",
            this.changeCaseKebab(this.pageName),
          );
          super.writeFile(
            basePath,
            this.changeCaseKebab(this.pageName) + extname,
            content,
          );
        });
      });
    });
  }

  addFactoryFun(): void {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/pages",
    );
    const fileName = "factory.page.ts";
    const content = super.replaceKeyword(
      PAGE.FACTORY_FUNCTION_CONTENT,
      this.pageName,
    );
    const addContent = PAGE.FACTORY_ANCHOR + super.endl() + content;

    super.addContentToFile(
      basePath,
      fileName,
      PAGE.FACTORY_ANCHOR,
      PAGE.FACTORY_ANCHOR,
      addContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info("Added " + this.pageName + " page's factory!");
      },
    );
  }

  addRouter() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "",
    );
    const fileName = "index.router.ts";
    const original = fs.readFileSync(this.routerTplPath).toString("utf8");
    const configContent =
      PAGE.ROUTER_CONFIG_ANCHOR +
      super.endl() +
      "  " +
      super.replaceKeyword(PAGE.ROUTER_CONFIG_CONTENT, this.pageName);

    super.addContentToFile(
      basePath,
      fileName,
      original,
      PAGE.ROUTER_CONFIG_ANCHOR,
      configContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info("Added " + this.pageName + " page's route!");
      },
    );
  }

  removeFiles() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/pages",
      super.changeCaseKebab(this.pageName),
    );
    rimraf(basePath, err => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Removed All files of " + this.pageName + " page.");
    });
  }

  deleteFactoryFun() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/pages",
    );
    const fileName = "factory.page.ts";
    const pattern =
      super.replaceKeyword(PAGE.FACTORY_FUNCTION_PATTERN, this.pageName) +
      super.endl();

    super.deleteContentFromFile(basePath, fileName, pattern, err => {
      if (err && err.name === "without") {
        winston.error("Without config option in factory file!");
        return;
      } else if (err) {
        winston.log("error", err.message, err);
        return;
      }
      winston.info("Deleted Factory function of " + this.pageName + " page.");
    });
  }

  deleteRouter() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "",
    );
    const fileName = "index.router.ts";
    const pattern =
      super.replaceKeyword(PAGE.ROUTER_CONFIG_PATTERN, this.pageName) +
      super.endl();

    super.deleteContentFromFile(basePath, fileName, pattern, err => {
      if (err && err.name === "without") {
        winston.error("Without config option in router file!");
        return;
      } else if (err) {
        winston.log("error", err.message, err);
        return;
      }
      winston.info("Deleted router config of " + this.pageName + " page.");
    });
  }
}
