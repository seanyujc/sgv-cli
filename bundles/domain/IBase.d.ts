export interface IBase {
    getCurrentDir(): string;
    getExtname(filename: string): any;
    changeCasePascal(str: string): any;
    replaceKeyword(tplContent: string, moduleName: string): any;
    /**
     * 写文件，如果路径不存在或文件不存在新建
     * @param basePath 目录
     * @param fileName 文件名
     * @param data 文件内容
     */
    writeFile(basePath: string, fileName: string, data: any): any;
}
