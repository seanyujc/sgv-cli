import path from "path";
import { getCurrentDir, getReplaceKeywords } from "./common";
import * as fs from "fs";
import ts from "typescript";
import { pascalCase } from "change-case";
import chalk from "chalk";
import prettier from "prettier";

/**
 * add export page expression
 * @param keyword page name
 * @param directory parent of page, exp: aaa/bbb
 */
export function joinMainExport(
  keyword: string,
  directory?: string,
  options: { prefix: string } = { prefix: "" },
) {
  const exportFilePath = path.resolve(
    getCurrentDir(),
    "src/app/components/index.ts",
  );

  const {
    parentCamelKeyword,
    parentKebabKeyword,
    pascalKeyword,
  } = getReplaceKeywords(keyword, directory);

  const importName = pascalCase(
    `${options.prefix ? options.prefix + "-" : ""}${parentKebabKeyword}`,
  );

  if (fs.existsSync(exportFilePath)) {
    try {
      const data = fs.readFileSync(exportFilePath);
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
          ts.factory.createStringLiteral(
            `./${[directory, keyword].filter((s) => s).join("/")}`,
          ),
        ),
        ...ast.statements,
      ]);
      const transformerFactory: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext,
      ) => {
        return visitor;
        function visitor(node: ts.Node): ts.Node {
          if (ts.isNamedExports(node)) {
            const exportClause = ts.factory.updateNamedExports(node, [
              ts.factory.createExportSpecifier(false, undefined, importName),
              ...node.elements,
            ]);
            return exportClause;
          }
          return ts.visitEachChild(node, visitor, context);
        }
      };
      const result = ts.transform(ast, [transformerFactory]);
      const node = result.transformed[0];

      const printer = ts.createPrinter();
      let codeAfterTransform = printer.printNode(
        ts.EmitHint.Unspecified,
        node,
        ast,
      );

      fs.writeFileSync(
        exportFilePath,
        prettier.format(codeAfterTransform, { parser: "typescript" }),
        {
          encoding: "utf8",
        },
      );
    } catch (error: any) {
      console.log(chalk.red(error.message));
    }
  }
}
