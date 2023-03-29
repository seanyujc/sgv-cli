#!/usr/bin/env node
import { paramCase } from "change-case";
import { program } from "commander";
import inquirer from "inquirer";
import path from "path";
import { getCurrentDir, writeTemplateFiles } from "./core/common";
import { buildPage } from "./core/page";
import * as fs from "fs";
import {
  addApiConfig,
  addFunctionInService,
  buildService,
  existsFunctionInService,
  getCurrentAPIModules,
  getHostListInAPIModule,
} from "./core/service";
import { joinMainExport } from "./core/component";
import { KeywordTypeSyntaxKind } from "typescript";
import chalk from "chalk";
import { writeRouteConfig } from "./core/route";

program
  .name("build")
  .usage("<project name>")
  .option("-p,--page [page name]", "generate a new page to current project")
  .option(
    "-c,--component [component name]",
    "generate a new component to current project",
  )
  .option("-e,--prefix [component prefix]", "prefix of component")
  .option(
    "-s,--service [service name]",
    "generate a new service to current project",
  )
  .option("-f,--function [method name]", "method name of service")
  .parse(process.argv);

const options = program.opts();
const packageJson = require(path.resolve(getCurrentDir(), "package.json"));
// vue version
let version: 2 | 3 = 3;
if (packageJson.dependencies && packageJson.dependencies.vue) {
  const vue: string = packageJson.dependencies.vue;
  const m = vue.match(/(\d+)\.\d+\.\d/);
  if (m !== null) {
    const v = +m[1];
    if (+m[1] === 2 || +m[1] === 3) {
      version = +m[1] as any;
    }
  }
}

if (options.page) {
  if (typeof options.page === "string") {
    let parentPath = [];
    const jar = options.page.replace(/^\//, "").split("/");
    for (let i = 0; i < jar.length; i++) {
      const pageName = jar[i];
      buildPage(parentPath.join("/"), pageName, i + 1 === jar.length, version);
      parentPath.push(paramCase(pageName));
    }
    writeRouteConfig(jar, jar[jar.length - 1]);
  }
}

if (options.component) {
  const jar = options.component.replace(/^\//, "").split("/");
  const name = paramCase(jar.pop() || options.component);
  const parentPath = jar.join("/");
  const parentPathUri = path.resolve(
    getCurrentDir(),
    "src/app/components",
    [parentPath, name].filter((s) => s).join("/"),
  );
  const templates = { 2: "component/v2", 3: "component/v3" };
  const templatePath = path.resolve(
    __dirname,
    "../.template",
    templates[version],
  );
  if (!fs.existsSync(parentPathUri)) {
    fs.mkdirSync(parentPathUri, { recursive: true });
  }
  // console.log(templatePath);

  const prefix = options.prefix || "";

  writeTemplateFiles(
    templatePath,
    parentPathUri,
    parentPath,
    name,
    {
      createFileName: "index.ts",
      prefix,
      isComponent: true,
    },
    (err) => {
      if (err === undefined) {
        joinMainExport(name, parentPath, { prefix });
      }
    },
  );
}
if (options.service && !options.function) {
  const keyword: string = <string>options.service;
  buildService(keyword, version);
}

async function getParamsOfFuction(
  params: { name: string; type: KeywordTypeSyntaxKind }[],
) {
  const { paramName, paramType, go } = await inquirer.prompt([
    {
      type: "input",
      name: "paramName",
      message: "Please enter parameter name:",
    },
    {
      type: "rawlist",
      name: "paramType",
      message: "Please choose a valid parameter type:",
      choices: [
        { name: "string", value: "StringKeyword" },
        { name: "number", value: "NumberKeyword" },
        { name: "any", value: "AnyKeyword" },
      ],
      default: 0,
    },
    {
      type: "confirm",
      name: "go",
      message: "Do you want to continue adding?",
      default: false,
    },
  ]);
  params.push({ name: paramName, type: paramType });
  if (go) {
    await getParamsOfFuction(params);
  } else {
    return params;
  }
}

if (options.service && options.function) {
  existsFunctionInService(options.function, options.service).then((res) => {
    if (res) {
      console.log(
        chalk.red(
          `Err: The function '${options.function}' you want to add already exists!`,
        ),
      );
    } else {
      const apiModules = getCurrentAPIModules();
      const hosts = getHostListInAPIModule();
      const questions: inquirer.QuestionCollection<any>[] = [
        {
          type: "list",
          name: "method",
          message: `What request methods will you use in service ${options.service}?`,
          choices: ["GET", "POST", { name: "DELETE", value: "_delete" }, "PUT"],
        },
        {
          type: "input",
          name: "apiPath",
          message: `Do you want to provide a new path?`,
          default: "/" + options.function,
        },
      ];
      if (apiModules.length > 1) {
        questions.push({
          type: "list",
          name: "apiModule",
          message: "Which module does this path belong to?",
          choices: apiModules,
        });
      }
      if (hosts.length > 1) {
        questions.push({
          type: "list",
          name: "host",
          message: `Which host should this function access?`,
          choices: hosts,
        });
      }
      questions.push({
        type: "confirm",
        name: "withParams",
        message: "Do you want to add some parameters of this function?",
        default: false,
      });

      inquirer
        .prompt(questions)
        .then(async ({ method, apiModule, apiPath, host, withParams }) => {
          const params: any[] = [];
          if (withParams) {
            await getParamsOfFuction(params);
          }
          if (!host) {
            host = hosts[0];
          }
          addFunctionInService(
            options.function,
            options.service,
            method,
            apiModule,
            params,
            version,
          );
          addApiConfig(
            apiModule,
            method,
            options.function,
            apiPath,
            host,
            version,
          );
        });
    }
  });
}
