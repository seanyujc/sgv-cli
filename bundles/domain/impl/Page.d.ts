import { IPage } from "../IPage";
export declare class Page implements IPage {
    name: string;
    templatePath: string;
    constructor();
    copyFiles(): void;
    replace(): void;
}
