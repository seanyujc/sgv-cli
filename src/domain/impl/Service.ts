import fs = require("fs");
import path = require("path");
import * as rimraf from "rimraf";
import * as winston from "winston";
import { IServiceConst, SERVICE } from "../../config";
import { IService } from "../IService";
import { Base } from "./Base";

export class Service extends Base implements IService {
  name: string;
  funName: string;
  templatePath: string;
  factoryPath: string;

  constructor(name: string, private appName: string = "app", funName?: string) {
    super();
    this.name = name;
    this.funName = funName;
    this.templatePath = path.join(__dirname, "../../../", ".sgv/service");
    this.factoryPath = path.join(
      __dirname,
      "../../../",
      ".sgv/page/index.router.ts",
    );
  }

  copyFiles(): void {
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
            this.name,
          );
          const basePath = path.join(
            super.getCurrentDir(),
            "src/" + this.appName + "/core/services",
          );
          super.writeFile(basePath, this.name + extname, content);
        });
      });
    });
  }
  addFactoryFun(): void {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/core",
    );
    const fileName = "factory.serv.ts";
    const importContent = super.replaceKeyword(
      SERVICE.IMPORT_CONTENT,
      this.name,
    );
    const addImportContent =
      SERVICE.IMPORT_ANCHOR + super.endl() + importContent;
    const facContent = super.replaceKeyword(
      SERVICE.FACTORY_FUNCTION_CONTENT,
      this.name,
    );
    const addFacContent = SERVICE.FACTORY_ANCHOR + super.endl() + facContent;

    super.addContentToFile(
      basePath,
      fileName,
      SERVICE.ORIGINAL,
      SERVICE.IMPORT_ANCHOR,
      addImportContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info("Added " + this.name + " service's factory import!");
        super.addContentToFile(
          basePath,
          fileName,
          SERVICE.ORIGINAL,
          SERVICE.FACTORY_ANCHOR,
          addFacContent,
          err1 => {
            if (err1) {
              winston.error(err1.message);
              return;
            }
            winston.info("Added " + this.name + " page's factory function!");
          },
        );
      },
    );
  }

  removeFiles() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/core/services",
      this.name + ".serv.ts",
    );
    rimraf(basePath, err => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Removed All files of " + this.name + " page.");
    });
  }
  deleteFactoryFun() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/core",
    );
    const fileName = "factory.serv.ts";
    let pattern =
      super.replaceKeyword(SERVICE.FACTORY_FUNCTION_PATTERN, this.name) +
      super.endl();

    super.deleteContentFromFile(basePath, fileName, pattern, err => {
      if (err && err.name === "without") {
        winston.error("Without config option in factory file!");
        return;
      } else if (err) {
        winston.log("error", err.message, err);
        return;
      }
      winston.info("Deleted Factory function of " + this.name + " service.");
      pattern =
        super.replaceKeyword(SERVICE.IMPORT_PATTERN, this.name) + super.endl();
      super.deleteContentFromFile(basePath, fileName, pattern, err1 => {
        if (err1 && err1.name === "without") {
          winston.error("Without config option in factory file!");
          return;
        } else if (err1) {
          winston.log("error", err1.message, err1);
          return;
        }
        winston.info("Deleted Factory function of " + this.name + " service.");
      });
    });
  }

  addServiceFun() {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/core/services",
    );
    const fileName = this.name + ".serv.ts";
    const interfaceContent = super.replaceKeyword(
      SERVICE.INTERFACE_CONTENT,
      this.funName,
    );
    const addIFContent =
      SERVICE.INTERFACE_ANCHOR + super.endl() + interfaceContent;
    const funContent = super.replaceKeyword(
      SERVICE.FUNCTION_FUNCTION_CONTENT,
      this.funName,
    );
    const addFunContent = SERVICE.FUNCTION_ANCHOR + super.endl() + funContent;

    super.addContentToFile(
      basePath,
      fileName,
      "",
      SERVICE.INTERFACE_ANCHOR,
      addIFContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info(
          "Added " + this.funName + " interface in " + this.name + " service!",
        );
      },
    );
    super.addContentToFile(
      basePath,
      fileName,
      "",
      SERVICE.FUNCTION_ANCHOR,
      addFunContent,
      err1 => {
        if (err1) {
          winston.error(err1.message);
          return;
        }
        winston.info(
          "Added " + this.funName + " function in " + this.name + " service!",
        );
      },
    );
  }

  addAPI(method: string) {
    const basePath = path.join(
      super.getCurrentDir(),
      "src/" + this.appName + "/config",
    );
    const fileName = "api.conf.ts";
    const apiContent = super.replaceKeyword(SERVICE.API_CONTENT, this.funName);
    const addAPIAnchor =
      method.toLocaleUpperCase() === "POST"
        ? SERVICE.API_POST_ANCHOR
        : SERVICE.API_GET_ANCHOR;
    const addAPIContent = addAPIAnchor + super.endl() + apiContent;
    super.addContentToFile(
      basePath,
      fileName,
      "",
      addAPIAnchor,
      addAPIContent,
      err => {
        if (err) {
          winston.error(err.message);
          return;
        }
        winston.info("Added " + this.funName + " api cofig!");
      },
    );
  }
}
