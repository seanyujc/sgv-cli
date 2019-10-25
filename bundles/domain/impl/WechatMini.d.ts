import { Base } from "./Base";
export declare class WechatMini extends Base {
    buildPage(name: string): void;
    buildComponent(name: string): void;
    private buildComponentBase(dirPath, fileName, prefix?, isComponent?);
}
