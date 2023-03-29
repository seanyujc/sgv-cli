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
import template from "lodash.template";
import * as fs from "fs";
import path from "path";
import { error } from "winston";

export const templateRoot = path.resolve(__dirname, "../../.template");

export function getCurrentDir(): string {
  if (process.env.NODE_PROJECT_ROOT) {
    return process.env.NODE_PROJECT_ROOT;
  } else {
    return process.env.PWD || process.cwd();
  }
}

export function getReplaceKeywords(keyword: string, parentPath?: string) {
  const camelKeyword = camelCase(keyword);
  let pascalKeyword = pascalCase(keyword);
  let kebabKeyword = paramCase(keyword);
  let parentKebabKeyword = paramCase(keyword);
  const snakeKeyword = snakeCase(keyword);
  let parentPathSnake = "";
  let parentPathKebab = "";
  let parentCamelKeyword = camelKeyword;

  if (parentPath) {
    parentCamelKeyword = camelCase(parentPath + "_" + camelKeyword);
    parentKebabKeyword = paramCase(parentPath + "_" + camelKeyword);
    pascalKeyword = pascalCase(parentPath + pascalCase(camelKeyword));
    parentPathKebab = paramCase(parentPath) + "/";
    parentPathSnake = snakeCase(parentPath) + "/";
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
    parentPascalKeyword: pascalKeyword,
  };
}
/**
 * 替换模板中设置的格式化变量
 * @param tplContent 模板内容
 * @param keyword 关键字
 * @param parentPath 父路径
 * @param leaf 是否时叶
 */
export function replaceKeyword(
  tplContent: string,
  keyword: string,
  parentPath?: string,
  leaf = true,
  prefix = "",
) {
  const compiled = template(tplContent);
  const replaceKeywords = getReplaceKeywords(keyword, parentPath);
  return compiled({
    pascalPrefix: pascalCase(prefix),
    kebabPrefix: prefix ? prefix + "-" : "",
    ...replaceKeywords,
    pageMainContent: leaf ? "{{title}}" : "<router-view></router-view>",
  });
}
function getExtname(fileName: string) {
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
export function writeTemplateFiles(
  templatePath: string,
  targetPath: string,
  directory: string,
  keyword: string,
  options: {
    leaf?: boolean;
    createFileName?: string;
    prefix?: string;
    isComponent?: boolean;
  } = {
    leaf: true,
    createFileName: "",
    prefix: "",
    isComponent: false,
  },
  cb?: (error?: Error | undefined, info?: string) => void,
) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }
  fs.readdir(templatePath, (err, files) => {
    if (err) {
      cb && cb(err);
      return;
    }
    const errors: string[] = [];
    const succeeds: string[] = [];
    files.forEach((fileName: string) => {
      const extname = getExtname(fileName);
      const fileNameOrg = fileName.replace(/\.tpl$/, "");
      let fileNameOut = keyword;
      // if (options.isComponent) {
      //   fileNameOut = pascalCase(
      //     [options.prefix, directory.replace("/", "-"), fileNameOut]
      //       .filter((v) => v)
      //       .join("-"),
      //   );
      // }
      if (
        options &&
        options.createFileName &&
        options.createFileName === fileNameOrg
      ) {
        fileNameOut = fileNameOrg.replace(/\.[^\.]+$/, "");
      }

      const filePath = path.join(targetPath, paramCase(fileNameOut) + extname);
      const stat = fs.lstatSync(`${templatePath}/${fileName}`);
      if (!fs.existsSync(filePath) && stat.isFile()) {
        try {
          const data = fs.readFileSync(`${templatePath}/${fileName}`);
          const content = replaceKeyword(
            data.toString("utf8"),
            keyword,
            directory,
            options && options.leaf,
            options && options.prefix,
          );
          fs.writeFileSync(filePath, content, { encoding: "utf8", flag: "w" });
          succeeds.push(
            `The ${paramCase(fileNameOut) + extname} file. Path: ${filePath}`,
          );
        } catch (error) {
          const _error: any = error;
          errors.push(_error.message);
        }
      } else {
        errors.push(`The path of file has existed. The path: ${filePath}`);
      }
    });
    if (errors.length) {
      cb && cb(new Error(errors.join("\n")), succeeds.join("\n"));
    } else {
      cb && cb(undefined, succeeds.join("\n"));
    }
  });
}
