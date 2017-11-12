import { IBase } from "./IBase";

export interface IPage extends IBase {
  name: string;
  templatePath: string;

  copyFiles(): void;
  addFactoryFun(): void;
}