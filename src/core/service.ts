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

export function buildService(parentPath: string, keyword: string) {
  let template = path.join(templateRoot, "service/service.ts.tpl");
  const targetPath = path.join(
    getCurrentDir(),
    "src/app/core/services",
    parentPath,
  );
  const targetFile = path.join(targetPath, paramCase(keyword) + ".serv.ts");
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  fs.readFile(template, {}, (error, data) => {
    if (error) {
      console.log(chalk.red(error.message));
      return;
    }
    const content = replaceKeyword(data.toString("utf8"), keyword);
    fs.writeFile(targetFile, content, { flag: "w" }, (error) => {
      if (error) {
        console.log(chalk.red(error.message));
        return;
      }
      console.log(chalk.green(`创建了服务文件：${targetFile}`));
    });
  });
}

export function addFunctionInService(
  keyword: string,
  methodName: string,
  service: string,
) {
  const serviceFile = path.join(
    getCurrentDir(),
    "src/app/core/services",
    service + ".serv.ts",
  );
  fs.readFile(serviceFile, {}, (error, data) => {
    if (error) {
      console.log(chalk.red(error.message));
      return;
    }
    let content = data.toString("utf8");

    // content = encodeEmptyLines(content);
    const ast = ts.createSourceFile(
      service + ".serv.ts",
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
            undefined,
            ts.factory.createBlock(
              [
                ts.factory.createReturnStatement(
                  ts.factory.createIdentifier(
                    `this.proxyHttp.${methodName.toLocaleLowerCase()}("${keyword}", params)`,
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
    console.log(node.getFullText());

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
