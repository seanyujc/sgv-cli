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
exports.buildPage = void 0;
const change_case_1 = require("change-case");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const typescript_1 = __importDefault(require("typescript"));
const chalk_1 = __importDefault(require("chalk"));
const prettier_1 = __importDefault(require("prettier"));
const common_1 = require("./common");
function buildPage(directory, keyword, leaf = true, version = 3) {
    const templates = { 2: "page/v2", 3: "page/main" };
    let templatePath = path_1.default.join(common_1.templateRoot, templates[version]);
    const targetPath = path_1.default.join(common_1.getCurrentDir(), "src/app/pages", directory, change_case_1.paramCase(keyword));
    console.log(chalk_1.default.green(`Begin build the ${change_case_1.paramCase(keyword)} page module in ${targetPath.replace(change_case_1.paramCase(keyword), "")}`));
    common_1.writeTemplateFiles(templatePath, targetPath, directory, keyword, {
        createFileName: "index.ts",
        leaf,
    }, (error, info) => {
        if (error) {
            console.log(chalk_1.default.red(error.message));
            return;
        }
        if (info) {
            console.log(chalk_1.default.green(`Built the ${change_case_1.paramCase(keyword)} page module at ${targetPath}. Include the following files:`));
            console.log(chalk_1.default.grey(info));
        }
        joinMainExport(change_case_1.paramCase(keyword), directory);
        writeRouteConfig(directory, keyword);
    });
}
exports.buildPage = buildPage;
function createRouteObjectLitera(directory, keyword, accessObjectName = "pages") {
    const { parentCamelKeyword, parentPathKebab, snakeKeyword, pascalKeyword, } = common_1.getReplaceKeywords(keyword, directory);
    let root = "";
    if (!directory) {
        root = "/";
    }
    return typescript_1.default.factory.createObjectLiteralExpression([
        typescript_1.default.factory.createPropertyAssignment("path", typescript_1.default.factory.createStringLiteral(root + snakeKeyword)),
        typescript_1.default.factory.createPropertyAssignment("name", typescript_1.default.factory.createStringLiteral(parentCamelKeyword)),
        typescript_1.default.factory.createPropertyAssignment("component", typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(accessObjectName), `${parentCamelKeyword}PagePreloading`)),
        typescript_1.default.factory.createPropertyAssignment("children", typescript_1.default.factory.createArrayLiteralExpression()),
    ], true);
}
function isExportDefault(node) {
    const modifier = typescript_1.default.ModifierFlags.ExportDefault;
    return (typescript_1.default.getCombinedModifierFlags(node) & modifier) === modifier;
}
function writeRouteConfig(directory, keyword, cb) {
    const routeConfigFile = path_1.default.resolve(common_1.getCurrentDir(), "src/app/index.router.ts");
    try {
        const data = fs.readFileSync(routeConfigFile);
        const content = data.toString("utf8");
        // console.log(content);
        let ast = typescript_1.default.createSourceFile("index.router.ts", content, typescript_1.default.ScriptTarget.Latest);
        // console.log(ast.statements);
        let pages = "pages";
        function delintNode(node) {
            if (node.kind === typescript_1.default.SyntaxKind.ImportDeclaration) {
                // console.log("===============\n", node);
                const importDeclaration = node;
                if (typescript_1.default.isStringLiteral(importDeclaration.moduleSpecifier) &&
                    importDeclaration.moduleSpecifier.text.includes("./pages")) {
                    // console.log(importDeclaration.moduleSpecifier.text);
                    const importClause = importDeclaration.importClause;
                    if (importClause.namedBindings &&
                        typescript_1.default.isNamespaceImport(importClause.namedBindings)) {
                        pages = importClause.namedBindings.name.text;
                    }
                }
            }
            typescript_1.default.forEachChild(node, delintNode);
        }
        delintNode(ast);
        const transformerFactory = (context) => {
            return visitor;
            function visitor(node) {
                // console.log(node);
                let root = "";
                if (!directory) {
                    root = "/";
                }
                // 找到根
                // 找到属性名或变量名是routes的node
                if (!directory &&
                    (typescript_1.default.isPropertyAssignment(node) || typescript_1.default.isVariableDeclaration(node)) &&
                    node.name &&
                    typescript_1.default.isIdentifier(node.name) &&
                    node.name.escapedText === "routes" &&
                    node.initializer) {
                    //   console.log(node.parent, "\n=================\n", node);
                    //   console.log(
                    //     "initializer:",
                    //     "\n=================\n",
                    //     node.initializer
                    //   );
                    if (typescript_1.default.isArrayLiteralExpression(node.initializer)) {
                        const exists = node.initializer.elements.findIndex((element) => typescript_1.default.isObjectLiteralExpression(element) &&
                            element.properties.findIndex((property) => typescript_1.default.isPropertyAssignment(property) &&
                                typescript_1.default.isIdentifierOrPrivateIdentifier(property.name) &&
                                property.name.escapedText === "path" &&
                                typescript_1.default.isStringLiteral(property.initializer) &&
                                property.initializer.text === root + keyword) !== -1);
                        if (exists === -1) {
                            let property = null;
                            let arrayLiteral = typescript_1.default.factory.createArrayLiteralExpression([
                                createRouteObjectLitera(directory, keyword, pages),
                                ...node.initializer.elements,
                            ]);
                            if (typescript_1.default.isPropertyAssignment(node)) {
                                property = typescript_1.default.factory.updatePropertyAssignment(node, node.name, arrayLiteral);
                                return property;
                            }
                            else if (typescript_1.default.isVariableDeclaration(node)) {
                                property = typescript_1.default.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, arrayLiteral);
                                return property;
                            }
                        }
                    }
                }
                // 插入子路由
                if (directory && typescript_1.default.isObjectLiteralExpression(node)) {
                    const paths = directory.split("/");
                    paths[0] = "/" + paths[0];
                    const index = node.properties.findIndex((property) => typescript_1.default.isPropertyAssignment(property) &&
                        property.name &&
                        typescript_1.default.isIdentifierOrPrivateIdentifier(property.name) &&
                        property.name.escapedText === "path" &&
                        typescript_1.default.isStringLiteral(property.initializer) &&
                        property.initializer.text === paths[paths.length - 1]);
                    if (index !== -1) {
                        const childrenProperty = node.properties.find((property) => {
                            return (typescript_1.default.isPropertyAssignment(property) &&
                                typescript_1.default.isIdentifierOrPrivateIdentifier(property.name) &&
                                property.name.escapedText === "children");
                        });
                        const othersProperty = node.properties.filter((property) => {
                            return (typescript_1.default.isPropertyAssignment(property) &&
                                typescript_1.default.isIdentifierOrPrivateIdentifier(property.name) &&
                                property.name.escapedText !== "children");
                        });
                        if (childrenProperty &&
                            typescript_1.default.isPropertyAssignment(childrenProperty) &&
                            typescript_1.default.isArrayLiteralExpression(childrenProperty.initializer)) {
                            const exists = childrenProperty.initializer.elements.findIndex((element) => typescript_1.default.isObjectLiteralExpression(element) &&
                                element.properties.findIndex((property) => typescript_1.default.isPropertyAssignment(property) &&
                                    typescript_1.default.isIdentifierOrPrivateIdentifier(property.name) &&
                                    property.name.escapedText === "path" &&
                                    typescript_1.default.isStringLiteral(property.initializer) &&
                                    property.initializer.text === root + keyword) !== -1);
                            if (exists === -1) {
                                const newChildrenProperty = typescript_1.default.factory.updatePropertyAssignment(childrenProperty, childrenProperty.name, typescript_1.default.factory.updateArrayLiteralExpression(childrenProperty.initializer, [
                                    ...childrenProperty.initializer.elements,
                                    // todo
                                    createRouteObjectLitera(directory, keyword, pages),
                                ]));
                                const newNode = typescript_1.default.factory.updateObjectLiteralExpression(node, [
                                    ...othersProperty,
                                    newChildrenProperty,
                                ]);
                                return newNode;
                            }
                        }
                    }
                }
                return typescript_1.default.visitEachChild(node, visitor, context);
            }
        };
        const result = typescript_1.default.transform(ast, [transformerFactory]);
        const node = result.transformed[0];
        // console.log(node.getFullText());
        const printer = typescript_1.default.createPrinter();
        let codeAfterTransform = printer.printNode(typescript_1.default.EmitHint.Unspecified, node, ast);
        // console.log(prettier.format(codeAfterTransform));
        fs.writeFileSync(routeConfigFile, prettier_1.default.format(codeAfterTransform, { parser: "typescript" }));
    }
    catch (error) {
        console.log(chalk_1.default.red(error));
    }
}
/**
 * add export page expression
 * @param keyword page name
 * @param directory parent of page, exp: aaa/bbb
 */
function joinMainExport(keyword, directory) {
    const pagesMainFileUri = path_1.default.resolve(common_1.getCurrentDir(), "src/app/pages/index.ts");
    const pagesFactoryFileUri = path_1.default.resolve(common_1.getCurrentDir(), "src/app/pages/factory.page.ts");
    const { parentCamelKeyword, parentPathKebab, pascalKeyword, } = common_1.getReplaceKeywords(keyword, directory);
    const importName = `${parentCamelKeyword}PagePreloading`;
    if (directory) {
        directory = `/${directory}`;
    }
    if (fs.existsSync(pagesMainFileUri)) {
        try {
            const data = fs.readFileSync(pagesMainFileUri);
            let content = data.toString("utf8");
            let ast = typescript_1.default.createSourceFile("index.ts", content, typescript_1.default.ScriptTarget.Latest);
            const m = content.match(importName);
            if (m !== null) {
                return;
            }
            ast = typescript_1.default.factory.updateSourceFile(ast, [
                typescript_1.default.factory.createImportDeclaration(undefined, undefined, typescript_1.default.factory.createImportClause(false, undefined, typescript_1.default.factory.createNamedImports([
                    typescript_1.default.factory.createImportSpecifier(undefined, typescript_1.default.factory.createIdentifier(importName)),
                ])), typescript_1.default.factory.createStringLiteral(`.${directory}/${keyword}`)),
                ...ast.statements,
            ]);
            // console.log(result.getSourceFile());
            const transformerFactory = (context) => {
                return visitor;
                function visitor(node) {
                    if (typescript_1.default.isNamedExports(node)) {
                        const exportClause = typescript_1.default.factory.updateNamedExports(node, [
                            typescript_1.default.factory.createExportSpecifier(undefined, `${parentCamelKeyword}PagePreloading`),
                            ...node.elements,
                        ]);
                        return exportClause;
                    }
                    return typescript_1.default.visitEachChild(node, visitor, context);
                }
            };
            const result = typescript_1.default.transform(ast, [transformerFactory]);
            const node = result.transformed[0];
            // console.log(node.getFullText());
            const printer = typescript_1.default.createPrinter();
            let codeAfterTransform = printer.printNode(typescript_1.default.EmitHint.Unspecified, node, ast);
            fs.writeFileSync(pagesMainFileUri, prettier_1.default.format(codeAfterTransform, { parser: "typescript" }));
        }
        catch (error) {
            console.log(chalk_1.default.red(error.message));
        }
    }
    if (fs.existsSync(pagesFactoryFileUri)) {
        const data = fs.readFileSync(pagesFactoryFileUri);
        let content = data.toString("utf8");
        let ast = typescript_1.default.createSourceFile("index.ts", content, typescript_1.default.ScriptTarget.Latest);
        // console.log(ast);
        // const statement0 = ast.statements[0];
        // if (ts.isFunctionDeclaration(statement0)) {
        //   console.log("\n==========\n");
        //   console.log(statement0.type);
        // }
        const m = content.match(importName);
        if (m !== null) {
            return;
        }
        // ts.factory.createExportDeclaration(undefined, [], false, )
        ast = typescript_1.default.factory.updateSourceFile(ast, [
            ...ast.statements,
            typescript_1.default.factory.createFunctionDeclaration(undefined, [typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.ExportKeyword)], undefined, typescript_1.default.factory.createIdentifier(`${parentCamelKeyword}PagePreloading`), undefined, [], typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("Promise"), [typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.AnyKeyword)]), typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory
                    .createIdentifier(`import(".${directory}/${keyword}").catch((error) => {
    return dealOccurred(error, "${pascalKeyword}");
  })`)),
            ], true)),
        ]);
        const printer = typescript_1.default.createPrinter();
        let codeAfterTransform = printer.printFile(ast);
        // console.log("\n==========\n", codeAfterTransform);
        try {
            fs.writeFileSync(pagesFactoryFileUri, prettier_1.default.format(codeAfterTransform, { parser: "typescript" }));
        }
        catch (error) {
            console.log(chalk_1.default.red(error.message));
        }
    }
}
