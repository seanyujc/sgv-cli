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
import { writeRouteConfig } from "./route";

export function buildPage(
  directory: string,
  keyword: string,
  leaf = true,
  version: 3 | 2 = 3,
) {
  const templates = { 2: "page/v2", 3: "page/v3" };
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

    },
  );
}

function isExportDefault(node: ts.Declaration): boolean {
  const modifier = ts.ModifierFlags.ExportDefault;
  return (ts.getCombinedModifierFlags(node) & modifier) === modifier;
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
                false,
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
                false,
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

      fs.writeFileSync(
        pagesMainFileUri,
        prettier.format(codeAfterTransform, { parser: "typescript" }),
        {
          encoding: "utf8",
        },
      );
    } catch (error) {
      const _error: any = error;
      console.log(chalk.red(_error.message));
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
                .createIdentifier(`import(".${directory}/${keyword}/${keyword}").catch((error) => {
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
        prettier.format(codeAfterTransform, { parser: "typescript" }),
        {
          encoding: "utf8",
        },
      );
    } catch (error) {
      const _error: any = error;
      console.log(chalk.red(_error.message));
    }
  }
}
