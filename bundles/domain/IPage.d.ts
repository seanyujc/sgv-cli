export interface IPage {
    name: string;
    templatePath: string;
    copyFiles(): void;
    replace(): void;
}
