import { IPage } from "../IPage";
import { Base } from "./Base";
export declare class Page extends Base implements IPage {
    private pageName;
    templatePath: string;
    routerTplPath: string;
    constructor(pageName: string);
    copyFiles(): void;
    addFactoryFun(): void;
    addRouter(): void;
    removeFiles(): void;
    deleteFactoryFun(): void;
    deleteRouter(): void;
}
