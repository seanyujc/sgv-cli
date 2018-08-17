import { Base } from "./Base";
export declare class Store extends Base {
    private states;
    private appName;
    templateFile: string;
    targetPath: string;
    typesFilePath: string;
    name: string;
    componentType: string;
    constantKeyName: string;
    constructor(pageName: string, compName: string, states?: string[], appName?: string);
    copyFile(): void;
    addContentToStore(key: string, type: string, fileContent: string): string;
    addExportConstantContent(key: string): void;
}
