import { IBase } from "./IBase";

export interface IPage extends IBase {
  templatePath: string;

  copyFiles(): void;
  addFactoryFun(): void;
}
