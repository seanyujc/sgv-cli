import { IService } from "../IService";
import { Base } from "./Base";
export declare class Service extends Base implements IService {
    name: string;
    funName: string;
    templatePath: string;
    factoryPath: string;
    constructor(name: string, funName?: string);
    copyFiles(): void;
    addFactoryFun(): void;
    removeFiles(): void;
    deleteFactoryFun(): void;
    addServiceFun(): void;
}
