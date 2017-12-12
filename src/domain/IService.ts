import { IBase } from "./IBase";

export interface IService extends IBase {
  name: string;
  templatePath: string;
  factoryPath: string;

  copyFiles(): void;
  addFactoryFun(): void;
}
