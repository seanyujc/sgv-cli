import * as fs from "fs";
import { getCurrentDir, replaceKeyword, templateRoot } from "./common";
import path = require("path");
import ts, { KeywordTypeSyntaxKind, NamedImportBindings } from "typescript";
import chalk from "chalk";
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from "change-case";
import prettier from "prettier";

export function getHostListInAPIModule(apiModule = "api", version: 3 | 2 = 3) {
  const apiPath = path.join(getApiConfigDir(), apiModule + ".conf.ts");
  let res: string[] = [];
  try {
    const data = fs.readFileSync(apiPath);
    let content = data.toString("utf8");
    const ast = ts.createSourceFile(
      apiModule + ".conf.ts",
      content,
      ts.ScriptTarget.Latest,
    );
    // console.log(ast);

    function delintNodeV2(node: ts.Node) {
      if (node.kind === ts.SyntaxKind.UnionType) {
        res = (node as ts.UnionTypeNode).types.map(
          (value) =>
            ((value as ts.LiteralTypeNode).literal as ts.StringLiteral).text,
        );
        // console.log(res);

        return;
      }
      ts.forEachChild(node, delintNodeV2);
    }
    function delintNodeV3(node: ts.Node) {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "apiConfig"
      ) {
        if (
          node.type &&
          ts.isTypeReferenceNode(node.type) &&
          node.type.typeArguments
        ) {
          // contract that first element is list of host
          if (node.type.typeArguments[0]) {
            if (ts.isUnionTypeNode(node.type.typeArguments[0])) {
              res = node.type.typeArguments[0].types.map((item) => {
                const literal = (item as ts.LiteralTypeNode)
                  .literal as ts.StringLiteral;
                return literal.text;
              });
            } else if (
              ts.isLiteralTypeNode(node.type.typeArguments[0]) &&
              ts.isStringLiteral(node.type.typeArguments[0].literal)
            ) {
              res = [node.type.typeArguments[0].literal.text];
            }
          }
        }
        return;
      }
      ts.forEachChild(node, delintNodeV3);
    }
    version === 2 ? delintNodeV2(ast) : delintNodeV3(ast);
  } catch (error) {
    console.log(error);
  }
  return res;
}

export function getApiConfigDir() {
  const paths = ["src/app/config", "src/app/core/config"];
  let dir = "";
  for (const item of paths) {
    dir = path.join(getCurrentDir(), item);
    if (fs.existsSync(dir)) {
      break;
    }
  }
  return dir;
}

export function getCurrentAPIModules() {
  try {
    const names = fs.readdirSync(getApiConfigDir());

    let files: string[] = [];
    for (const name of names) {
      const stat = fs.lstatSync(path.join(getApiConfigDir(), name));
      if (stat.isFile()) {
        files.push(name.replace(".conf.ts", ""));
      }
    }
    return files;
  } catch (error) {
    return [];
  }
}
export function getCurrentService(servicePath = "") {
  try {
    const names = fs.readdirSync(
      path.join(getCurrentDir(), "src/app/core/services", servicePath),
    );

    let files: string[] = [];
    for (const name of names) {
      const stat = fs.lstatSync(
        path.join(getCurrentDir(), "src/app/core/services", servicePath, name),
      );
      if (stat.isFile()) {
        if (name === "base.serv.ts") {
          continue;
        }
        files.push(path.join(servicePath, name.replace(".serv.ts", "")));
      } else {
        files = files.concat(getCurrentService(name));
      }
    }
    return files;
  } catch (error) {
    return [];
  }
}

export async function existsFunctionInService(
  functionName: string,
  serviceName: string,
  version: 3 | 2 = 3,
) {
  const serviceFileName = {
    2: serviceName + ".serv.ts",
    3: serviceName + ".ts",
  };
  const serviceFile = path.join(
    getCurrentDir(),
    "src/app/core/services",
    serviceFileName[version],
  );

  if (!fs.existsSync(serviceFile)) {
    return false;
  } else {
    return new Promise((resolve, reject) => {
      fs.readFile(serviceFile, { encoding: "utf8" }, (error, data) => {
        if (error) {
          console.log(chalk.red(error.message));
          return;
        }
        let content = data;
        const ast = ts.createSourceFile(
          serviceFileName[version],
          content,
          ts.ScriptTarget.Latest,
        );
        const index = ast.statements.findIndex((item) => {
          return (
            ts.isFunctionDeclaration(item) &&
            item.name &&
            item.name.text === functionName
          );
        });
        resolve(index !== -1);
      });
    });
  }
}

export function buildService(keyword: string, version: 3 | 2 = 3) {
  const templates = { 2: "service/v2", 3: "service/v3" };
  return new Promise((resolve, reject) => {
    const serviceName = keyword.substring(keyword.lastIndexOf("/") + 1);
    const parentPath = keyword.substring(0, keyword.lastIndexOf("/"));

    let template = path.join(
      templateRoot,
      templates[version],
      "service.ts.tpl",
    );
    const targetPath = path.join(
      getCurrentDir(),
      "src/app/core/services",
      parentPath,
    );
    const targetFile = path.join(targetPath, paramCase(serviceName) + ".ts");
    if (!fs.existsSync(targetPath)) {
      try {
        fs.mkdirSync(targetPath, { recursive: true });
      } catch (error) {
        const _error: any = error;
        console.log(chalk.red(_error.message));
        reject(error);
        return;
      }
    }
    fs.readFile(template, { encoding: "utf8" }, (error, data) => {
      if (error) {
        console.log(chalk.red(error.message));
        reject(error);
        return;
      }
      const content = replaceKeyword(data, serviceName);
      fs.writeFile(
        targetFile,
        content,
        { encoding: "utf8", flag: "w" },
        (error) => {
          if (error) {
            console.log(chalk.red(error.message));
            reject(error);
            return;
          }
          console.log(chalk.green(`创建了服务文件：${targetFile}`));
          resolve(`创建了服务文件：${targetFile}`);
        },
      );
    });
  });
}

export async function addFunctionInService(
  keyword: string,
  servicekeyword: string,
  methodName = "POST",
  apiModule = "api",
  params: {
    name: string;
    type: "StringKeyword" | "NumberKeyword" | "AnyKeyword";
  }[],
  version: 3 | 2 = 3,
) {
  const serviceFileName = {
    2: servicekeyword + ".serv.ts",
    3: servicekeyword + ".ts",
  };

  const serviceFile = path.join(
    getCurrentDir(),
    "src/app/core/services",
    serviceFileName[version],
  );
  if (!fs.existsSync(serviceFile)) {
    try {
      await buildService(servicekeyword);
    } catch (error) {
      return;
    }
  }
  fs.readFile(serviceFile, { encoding: "utf8" }, (error, data) => {
    if (error) {
      console.log(chalk.red(error.message));
      return;
    }
    let content = data;

    apiModule = apiModule.replace(/-*api/, "");
    if (apiModule) {
      apiModule += "/";
    }
    // content = encodeEmptyLines(content);
    const ast = ts.createSourceFile(
      serviceFileName[version],
      content,
      ts.ScriptTarget.Latest,
    );
    const transformerFactoryV2: ts.TransformerFactory<ts.Node> = (
      context: ts.TransformationContext,
    ) => {
      return visitor;

      function visitor(node: ts.Node): ts.Node {
        if (ts.isClassDeclaration(node)) {
          const method = ts.factory.createMethodDeclaration(
            undefined,
            undefined,
            undefined,
            keyword,
            undefined,
            [],
            [
              ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                ts.factory.createIdentifier("params"),
                ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              ),
            ],
            ts.factory.createTypeReferenceNode("Promise", [
              ts.factory.createTypeReferenceNode("any", []),
            ]),
            ts.factory.createBlock(
              [
                ts.factory.createReturnStatement(
                  ts.factory.createIdentifier(
                    `this.proxyHttp.${methodName.toLocaleLowerCase()}("${apiModule}${keyword}", params)`,
                  ),
                ),
              ],
              true,
            ),
          );
          const members = node.members.reduce((accumulator, currentNode) => {
            const arr: ts.ClassElement[] = [currentNode];
            if (ts.isConstructorDeclaration(currentNode)) {
              arr.push(method);
            }
            return accumulator.concat(arr);
          }, <ts.ClassElement[]>[]);
          return ts.factory.createClassDeclaration(
            node.decorators,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            members,
          );
        }
        return ts.visitEachChild(node, visitor, context); // 否则继续遍历其他节点
      }
    };
    const transformerFactoryV3: ts.TransformerFactory<ts.Node> = (
      context: ts.TransformationContext,
    ) => {
      return visitor;
      function visitor(node: ts.Node): ts.Node {
        if (ts.isSourceFile(node)) {
          // add http function in import
          const importDeclarationIndex = node.statements.findIndex((item) => {
            if (ts.isImportDeclaration(item)) {
              const stringLiteral = item.moduleSpecifier;
              if (
                ts.isStringLiteral(stringLiteral) &&
                stringLiteral.text === "../resource"
              ) {
                return true;
              }
            }
            return false;
          });
          const importDeclaration = node.statements[importDeclarationIndex];
          let statements: ts.Statement[] = Array.from(node.statements);
          if (importDeclaration && ts.isImportDeclaration(importDeclaration)) {
            if (
              importDeclaration.importClause &&
              importDeclaration.importClause.namedBindings
            ) {
              const namedImports = importDeclaration.importClause.namedBindings;
              if (ts.isNamedImports(namedImports)) {
                const index = namedImports.elements.findIndex((specifier) => {
                  return specifier.name.text === methodName.toLocaleLowerCase();
                });
                if (index === -1) {
                  const newIpDl = ts.factory.updateImportDeclaration(
                    importDeclaration,
                    undefined,
                    undefined,
                    ts.factory.updateImportClause(
                      importDeclaration.importClause,
                      false,
                      undefined,
                      ts.factory.updateNamedImports(namedImports, [
                        ...namedImports.elements,
                        ts.factory.createImportSpecifier(
                          false,
                          undefined,
                          ts.factory.createIdentifier(
                            methodName.toLocaleLowerCase(),
                          ),
                        ),
                      ]),
                    ),
                    importDeclaration.moduleSpecifier,
                    undefined,
                  );
                  statements.splice(importDeclarationIndex, 1, newIpDl);
                }
              }
            }
          }

          // add service function in statement
          const vrStIndex = node.statements.findIndex((item) => {
            return (
              ts.isVariableStatement(item) &&
              ts.isVariableDeclarationList(item.declarationList) &&
              item.declarationList.declarations.findIndex(
                (decl) =>
                  ts.isIdentifier(decl.name) &&
                  decl.name.escapedText === `${servicekeyword}Service`,
              ) !== -1
            );
          });
          const variableStatement = statements[vrStIndex];
          if (
            ts.isVariableStatement(variableStatement) &&
            ts.isVariableDeclarationList(variableStatement.declarationList)
          ) {
            const variableDeclarationIndex = variableStatement.declarationList.declarations.findIndex(
              (decl) =>
                ts.isIdentifier(decl.name) &&
                decl.name.escapedText === `${servicekeyword}Service`,
            );
            const variableDeclaration =
              variableStatement.declarationList.declarations[
                variableDeclarationIndex
              ];
            if (
              variableDeclaration &&
              variableDeclaration.initializer &&
              ts.isObjectLiteralExpression(variableDeclaration.initializer)
            ) {
              const newVrSt = ts.factory.createVariableStatement(
                variableStatement.modifiers,
                ts.factory.updateVariableDeclarationList(
                  variableStatement.declarationList,
                  [
                    ts.factory.updateVariableDeclaration(
                      variableDeclaration,
                      variableDeclaration.name,
                      undefined,
                      undefined,
                      ts.factory.createObjectLiteralExpression([
                        ...variableDeclaration.initializer.properties,
                        ts.factory.createShorthandPropertyAssignment(keyword),
                      ]),
                    ),
                  ],
                ),
              );
              statements.splice(vrStIndex, 1, newVrSt);
            }
          }

          const funcParams = params.map((item) => {
            return ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              item.name,
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind[item.type]),
            );
          });
          const keys = params.map((item) => item.name);
          const fun = ts.factory.createFunctionDeclaration(
            undefined,
            undefined,
            undefined,
            ts.factory.createIdentifier(keyword),
            undefined,
            funcParams,
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier("Promise"),
              [ts.factory.createToken(ts.SyntaxKind.AnyKeyword)],
            ),
            ts.factory.createBlock(
              [
                ts.factory.createReturnStatement(
                  ts.factory.createIdentifier(
                    `${methodName.toLocaleLowerCase()}("${keyword}", {${keys.join(
                      ",",
                    )}})`,
                  ),
                ),
              ],
              true,
            ),
          );

          ts.setSyntheticLeadingComments(fun, [
            {
              text: `*
 * ${keyword}${
                keys.length
                  ? "\n" +
                    keys.map((item) => " * @param " + item + " ").join("\n") +
                    ""
                  : ""
              }
 * @returns Promise<any>
 `,
              kind: ts.SyntaxKind.MultiLineCommentTrivia,
              pos: -1,
              end: -1,
              hasTrailingNewLine: true,
              hasLeadingNewline: true,
            },
          ]);

          statements.splice(vrStIndex, 0, fun);

          return ts.factory.updateSourceFile(node, statements);
        }
        return ts.visitEachChild(node, visitor, context); // 否则继续遍历其他节点
      }
    };

    const result = ts.transform(ast, [
      version === 2 ? transformerFactoryV2 : transformerFactoryV3,
    ]);
    const node = result.transformed[0];
    // console.log(node.getFullText());

    const printer = ts.createPrinter();
    let codeAfterTransform = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      ast,
    );
    // console.log(codeAfterTransform);

    // codeAfterTransform = decodeEmptyLines(codeAfterTransform);
    // console.log(codeAfterTransform);
    fs.writeFile(
      serviceFile,
      prettier.format(codeAfterTransform, { parser: "typescript" }),
      { encoding: "utf8" },
      (error) => {
        if (error) {
          console.log(chalk.red(error.message));
          return;
        }
      },
    );
  });
}

/**
 * 添加api接口到配置文件
 * @param apiModule 目标模块配置文件
 * @param method 请求方法
 * @param keyword 方法名关键字
 * @param apiPath 接口路径
 * @param host 服务主机
 */
export function addApiConfig(
  apiModule = "api",
  method: string,
  keyword: string,
  apiPath: string,
  host: string,
  version: 3 | 2 = 3,
) {
  const apiConfigFilePath = path.join(
    getApiConfigDir(),
    apiModule + ".conf.ts",
  );
  method = method.replace(/^_/, "");
  try {
    const data = fs.readFileSync(apiConfigFilePath);
    let content = data.toString("utf8");
    const ast = ts.createSourceFile(
      apiModule + ".conf.ts",
      content,
      ts.ScriptTarget.Latest,
    );
    // console.log(ast);
    const transformerFactoryV2: ts.TransformerFactory<ts.Node> = (
      context: ts.TransformationContext,
    ) => {
      return visitor;
      function visitor(node: ts.Node): ts.Node {
        // if (ts.isExportAssignment(node)) {
        //   const prop = ((node.expression as ts.AsExpression)
        //     .expression as ts.ObjectLiteralExpression).properties.find(
        //     (value) =>
        //       ((value as ts.PropertyAssignment).name as ts.Identifier).text ===
        //       method.toLocaleLowerCase(),
        //   );
        //   if (prop && ts.isPropertyAssignment(prop)) {
        //     const apiList = (prop.initializer as ts.ObjectLiteralExpression)
        //       .properties;
        //     const has = apiList.find(
        //       (value) =>
        //         ((value as ts.PropertyAssignment).name as ts.Identifier)
        //           .text === keyword,
        //     );
        //     if (!has) {
        //       // apiList.reduce()
        //     }
        //   }
        //   // console.log("-----------------------\n", node);
        //   return;
        // }
        return ts.visitEachChild(node, visitor, context);
      }
    };

    const transformerFactoryV3: ts.TransformerFactory<ts.Node> = (
      context: ts.TransformationContext,
    ) => {
      return visitor;
      function visitor(node: ts.Node): ts.Node {
        if (
          ts.isVariableDeclaration(node) &&
          node.type &&
          ts.isTypeReferenceNode(node.type) &&
          ts.isIdentifier(node.type.typeName) &&
          node.type.typeName.text === "ApiConfigInfo"
        ) {
          if (
            node.initializer &&
            ts.isObjectLiteralExpression(node.initializer)
          ) {
            const index = node.initializer.properties.findIndex(
              (item) =>
                ts.isPropertyAssignment(item) &&
                ts.isIdentifier(item.name) &&
                item.name.escapedText === method.toLocaleLowerCase(),
            );
            if (index !== -1) {
              const property = node.initializer.properties[
                index
              ] as ts.PropertyAssignment;
              if (ts.isObjectLiteralExpression(property.initializer)) {
                if (
                  property.initializer.properties.findIndex(
                    (item) =>
                      ts.isPropertyAssignment(item) &&
                      ts.isIdentifier(item.name) &&
                      item.name.escapedText === keyword,
                  ) === -1
                ) {
                  const newProperty = ts.factory.createPropertyAssignment(
                    property.name,
                    ts.factory.createObjectLiteralExpression(
                      [
                        ...property.initializer.properties,
                        ts.factory.createPropertyAssignment(
                          keyword,
                          ts.factory.createObjectLiteralExpression([
                            ts.factory.createPropertyAssignment(
                              "host",
                              ts.factory.createStringLiteral(host),
                            ),
                            ts.factory.createPropertyAssignment(
                              "path",
                              ts.factory.createStringLiteral(apiPath),
                            ),
                          ]),
                        ),
                      ],
                      true,
                    ),
                  );
                  const list = Array.from(node.initializer.properties);
                  list.splice(index, 1, newProperty);
                  return ts.factory.updateVariableDeclaration(
                    node,
                    node.name,
                    undefined,
                    node.type,
                    ts.factory.updateObjectLiteralExpression(
                      node.initializer,
                      list,
                    ),
                  );
                } else {
                  console.log(
                    chalk.yellow(
                      `Warn: An interface configuration named '${keyword}' already exists.`,
                    ),
                  );
                }
              }
            } else {
              return ts.factory.updateVariableDeclaration(
                node,
                node.name,
                undefined,
                node.type,
                ts.factory.updateObjectLiteralExpression(node.initializer, [
                  ...node.initializer.properties,
                  ts.factory.createPropertyAssignment(
                    method.toLocaleLowerCase(),
                    ts.factory.createObjectLiteralExpression([
                      ts.factory.createPropertyAssignment(
                        keyword,
                        ts.factory.createObjectLiteralExpression([
                          ts.factory.createPropertyAssignment(
                            "host",
                            ts.factory.createStringLiteral(host),
                          ),
                          ts.factory.createPropertyAssignment(
                            "path",
                            ts.factory.createStringLiteral(apiPath),
                          ),
                        ]),
                      ),
                    ]),
                  ),
                ]),
              );
            }
          }

          // console.log("-----------------------\n", node);
        }
        return ts.visitEachChild(node, visitor, context);
      }
    };

    const result = ts.transform(ast, [
      version === 2 ? transformerFactoryV2 : transformerFactoryV3,
    ]);
    const node = result.transformed[0];
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    let codeAfterTransform = printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      ast,
    );
    fs.writeFile(
      apiConfigFilePath,
      prettier.format(codeAfterTransform, { parser: "typescript" }),
      { encoding: "utf8" },
      (error) => {
        if (error) {
          console.log(chalk.red(error.message));
          return;
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
}
