import { Base } from "./Base";
export declare class Component extends Base {
    private compName;
    private appName;
    name: string;
    templatePath: string;
    constructor(compName: string, appName?: string);
    copyFiles(): void;
    addFactoryConfig(): void;
    removeFiles(): void;
    deleteFactoryConfig(): void;
}
