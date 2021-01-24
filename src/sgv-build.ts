#!/usr/bin/env node
import { paramCase } from "change-case";
import { program } from "commander";
import inquirer from "inquirer";
import path from "path";
import { getCurrentDir, writeTemplateFiles } from "./core/common";
import { buildPage } from "./core/page";
import * as fs from "fs";
import { addFunctionInService, buildService } from "./core/service";

program
  .name("build")
  .usage("<project name>")
  .option("-p,--page [page name]", "generate a new page to current project")
  .option(
    "-c,--component [component name]",
    "generate a new component to current project",
  )
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
  let parentPath = [];
  const jar = options.page.replace(/^\//, "").split("/");
  for (let i = 0; i < jar.length; i++) {
    const pageName = jar[i];
    buildPage(parentPath.join("/"), pageName, i + 1 === jar.length, version);
    parentPath.push(paramCase(pageName));
  }
}

if (options.component) {
  const jar = options.component.replace(/^\//, "").split("/");
  const name = jar.pop() || options.component;
  const parentPath = jar.join("/");
  const parentPathUri = path.resolve(
    getCurrentDir(),
    "src/app/components",
    options.component,
  );
  const templates = { 2: "component/v2", 3: "component/main" };
  const templatePath = path.resolve(
    __dirname,
    "../.template",
    templates[version],
  );
  if (!fs.existsSync(parentPathUri)) {
    fs.mkdirSync(parentPathUri, { recursive: true });
  }
  // console.log(templatePath);

  writeTemplateFiles(templatePath, parentPathUri, parentPath, name, {
    createFileName: "index.ts",
  });
}
if (options.service && !options.function) {
  const keyword: string = <string>options.service;
  const serviceName = keyword.substring(keyword.lastIndexOf("/") + 1);
  const parentPath = keyword.substring(0, keyword.lastIndexOf("/"));

  buildService(parentPath, serviceName);
}

if (options.service && options.function) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "method",
        message: `What request methods will you use request methods in service ${options.service}?`,
        choices: ["GET", "POST", "DELETE", "PUT"],
      },
    ])
    .then(({ method }) => {
      addFunctionInService(
        options.function,
        method ? method : "POST",
        options.service,
      );
    });
}
