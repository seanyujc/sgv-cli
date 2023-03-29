import path from "path";
import { getCurrentDir, getReplaceKeywords } from "./common";
import * as fs from "fs";
import ts from "typescript";
import chalk from "chalk";
import prettier from "prettier";

export function writeRouteConfig(
  directory: string[],
  keyword: string,
  cb?: (error?: Error | undefined, info?: string) => void,
) {
  console.log("writeRouteConfig", directory, keyword);

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
    let pages = "pages";
    function delintNode(node: ts.Node) {
      // is import sentence
      if (ts.isImportDeclaration(node)) {
        // console.log("===============\n", node);
        if (
          ts.isStringLiteral(node.moduleSpecifier) &&
          node.moduleSpecifier.text.includes("./pages") &&
          node.importClause
        ) {
          // console.log(importDeclaration.moduleSpecifier.text);
          if (
            node.importClause.namedBindings &&
            ts.isNamespaceImport(node.importClause.namedBindings)
          ) {
            pages = node.importClause.namedBindings.name.text;
          }
        }
      }
      ts.forEachChild(node, delintNode);
    }

    delintNode(ast);

    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (
      context,
    ) => {
      return (sourceFile) => {
        let index = 0;
        const visitor = (node: ts.Node): ts.Node => {
          let pathText = directory[index];
          let rootPropName = "routes";
          let parentPathText = "";
          if (index === 0) {
            pathText = "/" + pathText;
          }
          if (index > 0) {
            rootPropName = "children";
            parentPathText = directory[index - 1];
            if (index - 1 === 0) {
              parentPathText = "/" + parentPathText;
            }
          }
          if (ts.isObjectLiteralExpression(node)) {
            const rootProp = node.properties.find(
              (prop) =>
                ts.isPropertyAssignment(prop) &&
                ts.isMemberName(prop.name) &&
                prop.name.escapedText === rootPropName &&
                ts.isArrayLiteralExpression(prop.initializer),
            );
            if (
              rootProp &&
              ts.isPropertyAssignment(rootProp) &&
              ts.isArrayLiteralExpression(rootProp.initializer) &&
              ((!parentPathText && rootPropName === "routes") ||
                (parentPathText && findProperty(node, "path", parentPathText)))
            ) {
              const existRaw = rootProp.initializer.elements.find(
                (el) =>
                  ts.isObjectLiteralExpression(el) &&
                  findProperty(el, "path", pathText),
              );
              if (!existRaw) {
                const newRaw = createRoutes(directory, index);
                if (newRaw) {
                  console.log(
                    `${pathText}`,
                    `\tno exist on ${rootPropName} of ${parentPathText}`,
                  );
                  return ts.factory.updateObjectLiteralExpression(node, [
                    ...node.properties.filter(
                      (prop) =>
                        ts.isPropertyAssignment(prop) &&
                        ts.isMemberName(prop.name) &&
                        prop.name.escapedText !== rootPropName,
                    ),
                    ts.factory.createPropertyAssignment(
                      rootPropName,
                      ts.factory.createArrayLiteralExpression([
                        ...rootProp.initializer.elements,
                        newRaw,
                      ]),
                    ),
                  ]);
                }
              } else {
                index++;
                // console.log(
                //   `${pathText}`,
                //   `\texist on ${rootPropName} of ${parentPathText}`,
                // );
              }
            }
            const prop = node.properties[0];

            // console.log(
            //   node.kind,
            //   `\t# name:${
            //     ts.isPropertyAssignment(prop) &&
            //     ts.isMemberName(prop.name) &&
            //     prop.name.text
            //   } \tvalue:${
            //     ts.isPropertyAssignment(prop) &&
            //     ts.isStringLiteral(prop.initializer) &&
            //     prop.initializer.text
            //   }`,
            // );
          }

          return ts.visitEachChild(node, visitor, context);
        };
        return ts.visitNode(sourceFile, visitor);
      };
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
      {
        encoding: "utf8",
      },
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
}

function findProperty(
  node: ts.ObjectLiteralExpression,
  name: string,
  value?: string,
) {
  let regx: RegExp | null = null;
  if (value) {
    regx = new RegExp("^" + value);
  }
  return node.properties.find(
    (prop) =>
      ts.isPropertyAssignment(prop) &&
      ts.isMemberName(prop.name) &&
      prop.name.escapedText === name &&
      (!value ||
        (regx &&
          ts.isStringLiteral(prop.initializer) &&
          prop.initializer.text.match(regx))),
  );
}

function createRoutes(directory: string[], startIndex: number) {
  let objList: ts.ObjectLiteralExpression[] = [];
  for (let index = startIndex; index < directory.length; index++) {
    const pathText = directory[index];
    let parentPath = directory.slice(0, index).join("/");
    const newObj = createRouteObjectLitera(parentPath, pathText);
    objList.push(newObj);
  }
  for (let index = objList.length - 1; index > -1; index--) {
    const obj = objList[index];
    let preObj = objList[index - 1];
    if (preObj) {
      objList[index - 1] = ts.factory.updateObjectLiteralExpression(preObj, [
        ...preObj.properties.filter(
          (prop) =>
            ts.isPropertyAssignment(prop) &&
            ts.isMemberName(prop.name) &&
            prop.name.escapedText !== "children",
        ),
        ts.factory.createPropertyAssignment(
          "children",
          ts.factory.createArrayLiteralExpression([obj]),
        ),
      ]);
    }
  }
  return objList[0];
}

function createRouteObjectLitera(
  directory: string,
  keyword: string,
  accessObjectName = "pages",
) {
  const {
    parentCamelKeyword,
    parentPathKebab,
    snakeKeyword,
    pascalKeyword,
    parentPascalKeyword,
  } = getReplaceKeywords(keyword, directory);
  let root = "";
  if (!directory) {
    root = "/";
  }
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        "path",
        ts.factory.createStringLiteral(root + snakeKeyword),
      ),
      ts.factory.createPropertyAssignment(
        "name",
        ts.factory.createStringLiteral(parentPascalKeyword),
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
