import { Base } from "./Base";
export declare class Store extends Base {
    private states;
    private appName;
    templateFile: string;
    targetPath: string;
    name: string;
    constructor(pageName: string, compName: string, states?: string[], appName?: string);
    copyFile(): void;
}
