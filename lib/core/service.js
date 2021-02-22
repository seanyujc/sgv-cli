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
exports.addFunctionInService = exports.buildService = exports.getCurrentService = exports.getCurrentAPIModules = exports.getHostListInAPIModule = void 0;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
const path = require("path");
const typescript_1 = __importDefault(require("typescript"));
const chalk_1 = __importDefault(require("chalk"));
const change_case_1 = require("change-case");
const prettier_1 = __importDefault(require("prettier"));
function getHostListInAPIModule(apiModule) {
    const apiPath = path.join(common_1.getCurrentDir(), "src/app/config", apiModule + ".conf.ts");
    const res = [];
    try {
        const data = fs.readFileSync(apiPath);
        let content = data.toString("utf8");
        const ast = typescript_1.default.createSourceFile(apiModule + ".conf.ts", content, typescript_1.default.ScriptTarget.Latest);
        console.log(ast);
        function delintNode(node) {
            if (node.kind === typescript_1.default.SyntaxKind.TypeReference) {
            }
            typescript_1.default.forEachChild(node, delintNode);
        }
        delintNode(ast);
    }
    catch (error) {
    }
    return res;
}
exports.getHostListInAPIModule = getHostListInAPIModule;
function getCurrentAPIModules() {
    try {
        const names = fs.readdirSync(path.join(common_1.getCurrentDir(), "src/app/config"));
        let files = [];
        for (const name of names) {
            const stat = fs.lstatSync(path.join(common_1.getCurrentDir(), "src/app/config", name));
            if (stat.isFile()) {
                files.push(name.replace(".conf.ts", ""));
            }
        }
        return files;
    }
    catch (error) {
        return [];
    }
}
exports.getCurrentAPIModules = getCurrentAPIModules;
function getCurrentService(servicePath = "") {
    try {
        const names = fs.readdirSync(path.join(common_1.getCurrentDir(), "src/app/core/services", servicePath));
        let files = [];
        for (const name of names) {
            const stat = fs.lstatSync(path.join(common_1.getCurrentDir(), "src/app/core/services", servicePath, name));
            if (stat.isFile()) {
                if (name === "base.serv.ts") {
                    continue;
                }
                files.push(path.join(servicePath, name.replace(".serv.ts", "")));
            }
            else {
                files = files.concat(getCurrentService(name));
            }
        }
        return files;
    }
    catch (error) {
        return [];
    }
}
exports.getCurrentService = getCurrentService;
function buildService(parentPath, keyword) {
    let template = path.join(common_1.templateRoot, "service/service.ts.tpl");
    const targetPath = path.join(common_1.getCurrentDir(), "src/app/core/services", parentPath);
    const targetFile = path.join(targetPath, change_case_1.paramCase(keyword) + ".serv.ts");
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }
    fs.readFile(template, {}, (error, data) => {
        if (error) {
            console.log(chalk_1.default.red(error.message));
            return;
        }
        const content = common_1.replaceKeyword(data.toString("utf8"), keyword);
        fs.writeFile(targetFile, content, { flag: "w" }, (error) => {
            if (error) {
                console.log(chalk_1.default.red(error.message));
                return;
            }
            console.log(chalk_1.default.green(`创建了服务文件：${targetFile}`));
        });
    });
}
exports.buildService = buildService;
function addFunctionInService(keyword, service, methodName = "POST", apiModule = "api") {
    const serviceFile = path.join(common_1.getCurrentDir(), "src/app/core/services", service + ".serv.ts");
    fs.readFile(serviceFile, {}, (error, data) => {
        if (error) {
            console.log(chalk_1.default.red(error.message));
            return;
        }
        let content = data.toString("utf8");
        apiModule = apiModule.replace(/-*api/, "");
        if (apiModule) {
            apiModule += "/";
        }
        // content = encodeEmptyLines(content);
        const ast = typescript_1.default.createSourceFile(service + ".serv.ts", content, typescript_1.default.ScriptTarget.Latest);
        const transformerFactory = (context) => {
            return visitor;
            function visitor(node) {
                if (typescript_1.default.isClassDeclaration(node)) {
                    const method = typescript_1.default.factory.createMethodDeclaration(undefined, undefined, undefined, keyword, undefined, [], [
                        typescript_1.default.factory.createParameterDeclaration(undefined, undefined, undefined, typescript_1.default.factory.createIdentifier("params"), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword)),
                    ], typescript_1.default.factory.createTypeReferenceNode("Promise", [
                        typescript_1.default.factory.createTypeReferenceNode("any", []),
                    ]), typescript_1.default.factory.createBlock([
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier(`this.proxyHttp.${methodName.toLocaleLowerCase()}("${apiModule}${keyword}", params)`)),
                    ], true));
                    const members = node.members.reduce((accumulator, currentNode) => {
                        const arr = [currentNode];
                        if (typescript_1.default.isConstructorDeclaration(currentNode)) {
                            arr.push(method);
                        }
                        return accumulator.concat(arr);
                    }, []);
                    return typescript_1.default.factory.createClassDeclaration(node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, members);
                }
                return typescript_1.default.visitEachChild(node, visitor, context); // 否则继续遍历其他节点
            }
        };
        const result = typescript_1.default.transform(ast, [transformerFactory]);
        const node = result.transformed[0];
        // console.log(node.getFullText());
        const printer = typescript_1.default.createPrinter();
        let codeAfterTransform = printer.printNode(typescript_1.default.EmitHint.Unspecified, node, ast);
        // console.log(codeAfterTransform);
        // codeAfterTransform = decodeEmptyLines(codeAfterTransform);
        // console.log(codeAfterTransform);
        fs.writeFile(serviceFile, prettier_1.default.format(codeAfterTransform, { parser: "typescript" }), (error) => {
            if (error) {
                console.log(chalk_1.default.red(error.message));
                return;
            }
        });
    });
}
exports.addFunctionInService = addFunctionInService;
