import { Base } from "./Base";
export declare class Store extends Base {
    private states;
    private appName;
    templateFile: string;
    /**
     * 创建store的路径
     */
    targetPath: string;
    typesFilePath: string;
    /**
     * 创建对象名 + Page or Comp 以区分页面还是组件
     */
    name: string;
    componentType: string;
    constantKeyName: string;
    constructor(pageName: string, compName: string, states?: string[], appName?: string);
    copyFile(): void;
    addContentToStore(key: string, type: string, fileContent: string): string;
    addExportConstantContent(key: string): void;
}
