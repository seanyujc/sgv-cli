import * as fs from "fs";
import { getCurrentDir, replaceKeyword, templateRoot } from "./common";
import path = require("path");
import ts from "typescript";
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

export function getHostListInAPIModule(apiModule = "api") {
  const apiPath = path.join(
    getCurrentDir(),
    "src/app/config",
    apiModule + ".conf.ts",
  );
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

    function delintNode(node: ts.Node) {
      if (node.kind === ts.SyntaxKind.UnionType) {
        res = (node as ts.UnionTypeNode).types.map(
          (value) =>
            ((value as ts.LiteralTypeNode).literal as ts.StringLiteral).text,
        );
        console.log(res);

        return;
      }
      ts.forEachChild(node, delintNode);
    }
    delintNode(ast);
  } catch (error) {
    console.log(error);
  }
  return res;
}

export function getCurrentAPIModules() {
  try {
    const names = fs.readdirSync(path.join(getCurrentDir(), "src/app/config"));

    let files: string[] = [];
    for (const name of names) {
      const stat = fs.lstatSync(
        path.join(getCurrentDir(), "src/app/config", name),
      );
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

export function buildService(keyword: string) {
  return new Promise((resolve, reject) => {
    const serviceName = keyword.substring(keyword.lastIndexOf("/") + 1);
    const parentPath = keyword.substring(0, keyword.lastIndexOf("/"));

    let template = path.join(templateRoot, "service/service.ts.tpl");
    const targetPath = path.join(
      getCurrentDir(),
      "src/app/core/services",
      parentPath,
    );
    const targetFile = path.join(
      targetPath,
      paramCase(serviceName) + ".serv.ts",
    );
    if (!fs.existsSync(targetPath)) {
      try {
        fs.mkdirSync(targetPath, { recursive: true });
      } catch (error) {
        console.log(chalk.red(error.message));
        reject(error);
        return;
      }
    }
    fs.readFile(template, {}, (error, data) => {
      if (error) {
        console.log(chalk.red(error.message));
        reject(error);
        return;
      }
      const content = replaceKeyword(data.toString("utf8"), serviceName);
      fs.writeFile(targetFile, content, { flag: "w" }, (error) => {
        if (error) {
          console.log(chalk.red(error.message));
          reject(error);
          return;
        }
        console.log(chalk.green(`创建了服务文件：${targetFile}`));
        resolve(`创建了服务文件：${targetFile}`);
      });
    });
  });
}

export async function addFunctionInService(
  keyword: string,
  servicekeyword: string,
  methodName = "POST",
  apiModule = "api",
) {
  const serviceFile = path.join(
    getCurrentDir(),
    "src/app/core/services",
    servicekeyword + ".serv.ts",
  );
  if (!fs.existsSync(serviceFile)) {
    try {
      await buildService(servicekeyword);
    } catch (error) {
      return;
    }
  }
  fs.readFile(serviceFile, {}, (error, data) => {
    if (error) {
      console.log(chalk.red(error.message));
      return;
    }
    let content = data.toString("utf8");

    apiModule = apiModule.replace(/-*api/, "");
    if (apiModule) {
      apiModule += "/";
    }
    // content = encodeEmptyLines(content);
    const ast = ts.createSourceFile(
      servicekeyword + ".serv.ts",
      content,
      ts.ScriptTarget.Latest,
    );
    const transformerFactory: ts.TransformerFactory<ts.Node> = (
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
    const result = ts.transform(ast, [transformerFactory]);
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
 * @param apiPath 接口路径
 * @param host 服务主机
 */
export function addApiConfig(
  apiModule: string,
  method: string,
  apiPath: string,
  host?: string,
) {
  const apiConfigFilePath = path.join(
    getCurrentDir(),
    "src/app/config",
    apiModule + ".conf.ts",
  );
  try {
    const data = fs.readFileSync(apiConfigFilePath);
    let content = data.toString("utf8");
    const ast = ts.createSourceFile(
      apiModule + ".conf.ts",
      content,
      ts.ScriptTarget.Latest,
    );
    console.log(ast);
    function delintNode(node: ts.Node) {
      if (
        ts.isVariableDeclaration(node) &&
        (node.name as ts.Identifier).text === apiModule
      ) {
        console.log("-----------------------\n", node);
        return;
      }
      ts.forEachChild(node, delintNode);
    }
    delintNode(ast);
    const printer = ts.createPrinter();

    fs.writeFile(
      apiConfigFilePath,
      prettier.format(printer.printFile(ast), { parser: "typescript" }),
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
