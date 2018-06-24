/// <reference types="node" />
import { IBase } from "../IBase";
export declare class Base implements IBase {
    endl(): any;
    getCurrentDir(): string;
    getExtname(filename: string): string;
    upperFirst(str: string): string;
    changeCaseConstant(str: string): string;
    replaceKeyword(tplContent: string, keyword: string): string;
    mkdirs(dirpath: string, mode: number, callback?: () => void): void;
    writeFile(basePath: string, fileName: string, data: any, overwrite?: boolean): void;
    addContentToFile(basePath: string, fileName: string, original: string, anchor: string, content: string, callback?: (err: NodeJS.ErrnoException) => any): void;
    deleteContentFromFile(basePath: string, fileName: string, pattern: string, callback?: (err: NodeJS.ErrnoException) => any): void;
}
