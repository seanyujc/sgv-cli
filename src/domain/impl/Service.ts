import fs = require("fs");
import path = require("path");
import { IService } from "../IService";
import { Base } from "./Base";
import * as winston from "winston";
import { IServiceConst, SERVICE } from "../../config";


export class Service extends Base implements IService {
  name: string;
  templatePath: string;
  factoryPath: string;

  constructor( name: string) {
    super();
    this.name = name;
    this.templatePath = path.join(__dirname, "../../../", ".sgv/service");
    this.factoryPath = path.join(__dirname, "../../../", ".sgv/page/index.router.ts");
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
          const content = super.replaceKeyword(data.toString("utf8"), this.name);
          const basePath = path.join(super.getCurrentDir(), "src/app/core/services", this.name);
          super.writeFile(basePath, this.name + extname, content);
        });
      });
    });
  }
  addFactoryFun(): void {
    const basePath = path.join(super.getCurrentDir(), "src/app/core");
    const fileName = "factory.serv.ts";
    const importContent = super.replaceKeyword(SERVICE.IMPORT_CONTENT, this.name);
    const addImportContent = SERVICE.IMPORT_ANCHOR + super.endl() + importContent;
    const facContent = super.replaceKeyword(SERVICE.FACTORY_FUNCTION_CONTENT, this.name);
    const addFacContent = SERVICE.FACTORY_ANCHOR + super.endl() + facContent;

    super.addContentToFile(basePath, fileName, SERVICE.ORIGINAL, SERVICE.IMPORT_ANCHOR, addImportContent, (err) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Added " + this.name + " page's factory!");
    });

    super.addContentToFile(basePath, fileName, SERVICE.ORIGINAL, SERVICE.FACTORY_ANCHOR, addFacContent, (err) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      winston.info("Added " + this.name + " page's factory!");
    });

  }
  
}
