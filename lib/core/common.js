"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTemplateFiles = exports.replaceKeyword = exports.getReplaceKeywords = exports.getCurrentDir = exports.templateRoot = void 0;
const change_case_1 = require("change-case");
const lodash_template_1 = __importDefault(require("lodash.template"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
exports.templateRoot = path_1.default.resolve(__dirname, "../../.template");
function getCurrentDir() {
    return process.env.PWD || process.cwd();
}
exports.getCurrentDir = getCurrentDir;
function getReplaceKeywords(keyword, parentPath) {
    const camelKeyword = change_case_1.camelCase(keyword);
    let pascalKeyword = change_case_1.pascalCase(keyword);
    let kebabKeyword = change_case_1.paramCase(keyword);
    let parentKebabKeyword = change_case_1.paramCase(keyword);
    const snakeKeyword = change_case_1.snakeCase(keyword);
    let parentPathSnake = "";
    let parentPathKebab = "";
    let parentCamelKeyword = camelKeyword;
    if (parentPath) {
        parentCamelKeyword = change_case_1.camelCase(parentPath + "_" + camelKeyword);
        parentKebabKeyword = change_case_1.paramCase(parentPath + "_" + camelKeyword);
        pascalKeyword = change_case_1.pascalCase(parentPath + change_case_1.pascalCase(camelKeyword));
        parentPathKebab = change_case_1.paramCase(parentPath) + "/";
        parentPathSnake = change_case_1.snakeCase(parentPath) + "/";
        parentPath = parentPath + "/";
    }
    return {
        camelKeyword,
        pascalKeyword,
        kebabKeyword,
        snakeKeyword,
        parentPath,
        parentPathKebab,
        parentPathSnake,
        parentCamelKeyword,
        parentKebabKeyword,
    };
}
exports.getReplaceKeywords = getReplaceKeywords;
/**
 * 替换模板中设置的格式化变量
 * @param tplContent 模板内容
 * @param keyword 关键字
 * @param parentPath 父路径
 * @param leaf 是否时叶
 */
function replaceKeyword(tplContent, keyword, parentPath, leaf = true) {
    const compiled = lodash_template_1.default(tplContent);
    const replaceKeywords = getReplaceKeywords(keyword, parentPath);
    return compiled(Object.assign(Object.assign({}, replaceKeywords), { pageMainContent: leaf ? "{{title}}" : "<router-view></router-view>" }));
}
exports.replaceKeyword = replaceKeyword;
function getExtname(fileName) {
    fileName = fileName.replace(/\.tpl$/, "");
    const i = fileName.indexOf(".");
    return i < 0 ? "" : fileName.substr(i);
}
/**
 * 通过模板建立模块，拷贝模板目录下的文件内容，并使用其文件名最左边点开始后面的所有文件名为新文件名的后缀。
 * @param templatePath 模板文件目录
 * @param targetPath 写入新文件的文件目录
 * @param directory 父级，以此判断是否有父级
 * @param keyword 新建模块的名称
 * @param options 可选项，leaf 一次建立多级时是否是叶，createFileName 是否要自定义文件名，默认使用keyword值。
 */
function writeTemplateFiles(templatePath, targetPath, directory, keyword, options = {
    leaf: true,
    createFileName: "",
}, cb) {
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
    }
    fs.readdir(templatePath, (err, files) => {
        if (err) {
            cb && cb(err);
            return;
        }
        const errors = [];
        const succeeds = [];
        files.forEach((fileName) => {
            const extname = getExtname(fileName);
            const fileNameOrg = fileName.replace(/\.tpl$/, "");
            let fileNameOut = keyword;
            if (options &&
                options.createFileName &&
                options.createFileName === fileNameOrg) {
                fileNameOut = fileNameOrg.replace(/\.[^\.]+$/, "");
            }
            const filePath = path_1.default.join(targetPath, change_case_1.paramCase(fileNameOut) + extname);
            const stat = fs.lstatSync(`${templatePath}/${fileName}`);
            if (!fs.existsSync(filePath) && stat.isFile()) {
                try {
                    const data = fs.readFileSync(`${templatePath}/${fileName}`);
                    const content = replaceKeyword(data.toString("utf8"), keyword, directory, options && options.leaf);
                    fs.writeFileSync(filePath, content, { flag: "w" });
                    succeeds.push(`The ${change_case_1.paramCase(fileNameOut) + extname} file. Path: ${filePath}`);
                }
                catch (error) {
                    errors.push(error.message);
                }
            }
            else {
                errors.push(`the file path exists. The path: ${filePath}`);
            }
        });
        if (errors.length) {
            cb && cb(new Error(errors.join("\n")), succeeds.join("\n"));
        }
        else {
            cb && cb(undefined, succeeds.join("\n"));
        }
    });
}
exports.writeTemplateFiles = writeTemplateFiles;
