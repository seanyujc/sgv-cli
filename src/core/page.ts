import inquirer from "inquirer";
import { paramCase } from "change-case";
import path from "path";
import * as fs from "fs";
import ts from "typescript";
import chalk from "chalk";
import prettier from "prettier";
import {
  getCurrentDir,
  getReplaceKeywords,
  templateRoot,
  writeTemplateFiles,
} from "./common";

export function buildPage(
  directory: string,
  keyword: string,
  leaf = true,
  version: 3 | 2 = 3,
) {
  const templates = { 2: "page/v2", 3: "page/main" };
  let templatePath = path.join(templateRoot, templates[version]);
  const targetPath = path.join(
    getCurrentDir(),
    "src/app/pages",
    directory,
    paramCase(keyword),
  );

  console.log(
    chalk.green(
      `Begin build the ${paramCase(
        keyword,
      )} page module in ${targetPath.replace(paramCase(keyword), "")}`,
    ),
  );
  writeTemplateFiles(
    templatePath,
    targetPath,
    directory,
    keyword,
    {
      createFileName: "index.ts",
      leaf,
    },
    (error, info) => {
      if (error) {
        console.log(chalk.red(error.message));
        return;
      }
      if (info) {
        console.log(
          chalk.green(
            `Built the ${paramCase(
              keyword,
            )} page module at ${targetPath}. Include the following files:`,
          ),
        );
        console.log(chalk.grey(info));
      }
      joinMainExport(paramCase(keyword), directory);
      writeRouteConfig(directory, keyword);
    },
  );
}
function createRouteObjectLitera(directory: string, keyword: string, accessObjectName="pages") {
  const { parentCamelKeyword, parentPathKebab } = getReplaceKeywords(
    keyword,
    directory,
  );
  let root = "";
  if (!directory) {
    root = "/";
  }
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "path",
        ts.factory.createStringLiteral(root + keyword),
      ),
      ts.factory.createPropertyAssignment(
        "component",
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier(accessObjectName),
          `${parentCamelKeyword}PagePreloading`,
        ),
      ),
      ts.factory.createPropertyAssignment(
        "children",
        ts.factory.createArrayLiteralExpression(),
      ),
    ],
    true,
  );
}
function isExportDefault(node: ts.Declaration): boolean {
  const modifier = ts.ModifierFlags.ExportDefault;
  return (ts.getCombinedModifierFlags(node) & modifier) === modifier;
}

function writeRouteConfig(
  directory: string,
  keyword: string,
  cb?: (error?: Error | undefined, info?: string) => void,
) {
  const routeConfigFile = path.resolve(
    getCurrentDir(),
    "src/app/index.router.ts",
  );

  try {
    const data = fs.readFileSync(routeConfigFile);
    const content = data.toString("utf8");
    // console.log(content);

    let ast = ts.createSourceFile(
      "index.router.ts",
      content,
      ts.ScriptTarget.Latest,
    );
    // console.log(ast.statements);
    let pages = "pages"
    function delintNode(node: ts.Node) {
      if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        // console.log("===============\n", node);
        const importDeclaration = node as ts.ImportDeclaration;
        if (ts.isStringLiteral(importDeclaration.moduleSpecifier) && importDeclaration.moduleSpecifier.text.includes("./pages")) {
          // console.log(importDeclaration.moduleSpecifier.text);
          const importClause = (<ts.ImportClause>importDeclaration.importClause)
          if (importClause.namedBindings && ts.isNamespaceImport(importClause.namedBindings)) {
            pages = importClause.namedBindings.name.text;
          }
        }
      }
      ts.forEachChild(node, delintNode);
    }

    delintNode(ast);

    const transformerFactory: ts.TransformerFactory<ts.Node> = (
      context: ts.TransformationContext,
    ) => {
      return visitor;
      function visitor(node: ts.Node): ts.Node {
        // console.log(node);
        let root = "";
        if (!directory) {
          root = "/";
        }
        // 找到根
        // 找到属性名或变量名是routes的node
        if (
          !directory &&
          (ts.isPropertyAssignment(node) || ts.isVariableDeclaration(node)) &&
          node.name &&
          ts.isIdentifier(node.name) &&
          node.name.escapedText === "routes" &&
          node.initializer
        ) {
          //   console.log(node.parent, "\n=================\n", node);
          //   console.log(
          //     "initializer:",
          //     "\n=================\n",
          //     node.initializer
          //   );
          if (ts.isArrayLiteralExpression(node.initializer)) {
            const exists = node.initializer.elements.findIndex(
              (element) =>
                ts.isObjectLiteralExpression(element) &&
                element.properties.findIndex(
                  (property) =>
                    ts.isPropertyAssignment(property) &&
                    ts.isIdentifierOrPrivateIdentifier(property.name) &&
                    property.name.escapedText === "path" &&
                    ts.isStringLiteral(property.initializer) &&
                    property.initializer.text === root + keyword,
                ) !== -1,
            );
            if (exists === -1) {
              let property = null;
              let arrayLiteral = ts.factory.createArrayLiteralExpression([
                createRouteObjectLitera(directory, keyword, pages),
                ...node.initializer.elements,
              ]);
              if (ts.isPropertyAssignment(node)) {
                property = ts.factory.updatePropertyAssignment(
                  node,
                  node.name,
                  arrayLiteral,
                );
                return property;
              } else if (ts.isVariableDeclaration(node)) {
                property = ts.factory.updateVariableDeclaration(
                  node,
                  node.name,
                  node.exclamationToken,
                  node.type,
                  arrayLiteral,
                );
                return property;
              }
            }
          }
        }
        // 插入子路由
        if (directory && ts.isObjectLiteralExpression(node)) {
          const paths = directory.split("/");
          paths[0] = "/" + paths[0];
          const index = node.properties.findIndex(
            (property) =>
              ts.isPropertyAssignment(property) &&
              property.name &&
              ts.isIdentifierOrPrivateIdentifier(property.name) &&
              property.name.escapedText === "path" &&
              ts.isStringLiteral(property.initializer) &&
              property.initializer.text === paths[paths.length - 1],
          );
          if (index !== -1) {
            const childrenProperty = node.properties.find((property) => {
              return (
                ts.isPropertyAssignment(property) &&
                ts.isIdentifierOrPrivateIdentifier(property.name) &&
                property.name.escapedText === "children"
              );
            });
            const othersProperty = node.properties.filter((property) => {
              return (
                ts.isPropertyAssignment(property) &&
                ts.isIdentifierOrPrivateIdentifier(property.name) &&
                property.name.escapedText !== "children"
              );
            });
            if (
              childrenProperty &&
              ts.isPropertyAssignment(childrenProperty) &&
              ts.isArrayLiteralExpression(childrenProperty.initializer)
            ) {
              const exists = childrenProperty.initializer.elements.findIndex(
                (element) =>
                  ts.isObjectLiteralExpression(element) &&
                  element.properties.findIndex(
                    (property) =>
                      ts.isPropertyAssignment(property) &&
                      ts.isIdentifierOrPrivateIdentifier(property.name) &&
                      property.name.escapedText === "path" &&
                      ts.isStringLiteral(property.initializer) &&
                      property.initializer.text === root + keyword,
                  ) !== -1,
              );

              if (exists === -1) {
                const newChildrenProperty = ts.factory.updatePropertyAssignment(
                  childrenProperty,
                  childrenProperty.name,
                  ts.factory.updateArrayLiteralExpression(
                    childrenProperty.initializer,
                    [
                      ...childrenProperty.initializer.elements,
                      // todo
                      createRouteObjectLitera(directory, keyword, pages),
                    ],
                  ),
                );
                const newNode = ts.factory.updateObjectLiteralExpression(node, [
                  ...othersProperty,
                  newChildrenProperty,
                ]);
                return newNode;
              }
            }
          }
        }

        return ts.visitEachChild(node, visitor, context);
      }
    };
    const result = ts.transform(ast, [transformerFactory]);
    const node = result.transformed[0];
    // console.log(node.getFullText());

    const printer = ts.createPrinter();
    let codeAfterTransform = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      ast,
    );
    // console.log(prettier.format(codeAfterTransform));
    fs.writeFileSync(
      routeConfigFile,
      prettier.format(codeAfterTransform, { parser: "typescript" }),
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
}
/**
 * add export page expression
 * @param keyword page name
 * @param directory parent of page, exp: aaa/bbb
 */
function joinMainExport(keyword: string, directory?: string) {
  const pagesMainFileUri = path.resolve(
    getCurrentDir(),
    "src/app/pages/index.ts",
  );
  const pagesFactoryFileUri = path.resolve(
    getCurrentDir(),
    "src/app/pages/factory.page.ts",
  );
  const {
    parentCamelKeyword,
    parentPathKebab,
    pascalKeyword,
  } = getReplaceKeywords(keyword, directory);
  const importName = `${parentCamelKeyword}PagePreloading`;
  if (directory) {
    directory = `/${directory}`;
  }
  if (fs.existsSync(pagesMainFileUri)) {
    try {
      const data = fs.readFileSync(pagesMainFileUri);
      let content = data.toString("utf8");
      let ast = ts.createSourceFile(
        "index.ts",
        content,
        ts.ScriptTarget.Latest,
      );

      const m = content.match(importName);
      if (m !== null) {
        return;
      }
      ast = ts.factory.updateSourceFile(ast, [
        ts.factory.createImportDeclaration(
          undefined,
          undefined,
          ts.factory.createImportClause(
            false,
            undefined,
            ts.factory.createNamedImports([
              ts.factory.createImportSpecifier(
                undefined,
                ts.factory.createIdentifier(importName),
              ),
            ]),
          ),
          ts.factory.createStringLiteral(`.${directory}/${keyword}`),
        ),
        ...ast.statements,
      ]);
      // console.log(result.getSourceFile());

      const transformerFactory: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext,
      ) => {
        return visitor;
        function visitor(node: ts.Node): ts.Node {
          if (ts.isNamedExports(node)) {
            const exportClause = ts.factory.updateNamedExports(node, [
              ts.factory.createExportSpecifier(
                undefined,
                `${parentCamelKeyword}PagePreloading`,
              ),
              ...node.elements,
            ]);
            return exportClause;
          }
          return ts.visitEachChild(node, visitor, context);
        }
      };
      const result = ts.transform(ast, [transformerFactory]);
      const node = result.transformed[0];
      // console.log(node.getFullText());

      const printer = ts.createPrinter();
      let codeAfterTransform = printer.printNode(
        ts.EmitHint.Unspecified,
        node,
        ast,
      );

      fs.writeFileSync(pagesMainFileUri, prettier.format(codeAfterTransform));
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  }
  if (fs.existsSync(pagesFactoryFileUri)) {
    const data = fs.readFileSync(pagesFactoryFileUri);
    let content = data.toString("utf8");
    let ast = ts.createSourceFile("index.ts", content, ts.ScriptTarget.Latest);

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

    ast = ts.factory.updateSourceFile(ast, [
      ...ast.statements,
      ts.factory.createFunctionDeclaration(
        undefined,
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        undefined,
        ts.factory.createIdentifier(`${parentCamelKeyword}PagePreloading`),
        undefined,
        [],
        ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier("Promise"),
          [ts.factory.createToken(ts.SyntaxKind.AnyKeyword)],
        ),
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory
                .createIdentifier(`import(".${directory}/${keyword}").catch((error) => {
    return dealOccurred(error, "${pascalKeyword}");
  })`),
            ),
          ],
          true,
        ),
      ),
    ]);

    const printer = ts.createPrinter();
    let codeAfterTransform = printer.printFile(ast);
    // console.log("\n==========\n", codeAfterTransform);
    try {
      fs.writeFileSync(
        pagesFactoryFileUri,
        prettier.format(codeAfterTransform),
      );
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  }
}
