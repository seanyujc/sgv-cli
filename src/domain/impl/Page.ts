import { IPage } from "../IPage";
import path = require('path')

export class Page implements IPage {
  name: string;
  templatePath: string;
  constructor() {
    this.templatePath = path.join(__dirname, "../../../", ".sgv/page")
  }
  copyFiles(): void {
    console.log(this.templatePath);
    console.log(path.join("./src/pages"))
  }
  replace(): void {
    throw new Error("Method not implemented.");
  }
}