import { IBase } from "../IBase";

export class Base implements IBase{
  getCurrentDir(): string {
    return process.env.PWD || process.cwd();
  }

 }