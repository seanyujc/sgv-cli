import { Base } from "./Base";
export declare class Component extends Base {
    private compName;
    name: string;
    templatePath: string;
    constructor(compName: string);
    copyFiles(): void;
    addFactoryConfig(): void;
    removeFiles(): void;
    deleteFactoryConfig(): void;
}
