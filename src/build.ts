#!/usr/bin/env node
import { paramCase } from "change-case";
import { program } from "commander";
import inquirer from "inquirer";
import path from "path";
import { getCurrentDir } from "./core/common";
import { buildPage } from "./core/page";

program
  .name("build")
  .usage("<project name>")
  .option("-p,--page [page name]", "generate a new page to current project")
  .option(
    "-c,--component [component name]",
    "generate a new component to current project"
  )
  .option(
    "-s,--service [service name]",
    "generate a new service to current project"
  )
  .parse(process.argv);

const options = program.opts();

if (options.page) {
  const packageJson = require(path.resolve(getCurrentDir(), "package.json"));
  if (packageJson.dependencies && packageJson.dependencies.vue) {
    const vue: string = packageJson.dependencies.vue;
    const m = vue.match(/(\d+)\.\d+\.\d/);
    let version: 2 | 3 = 3;
    if (m !== null) {
      const v = +m[1];
      if (+m[1] === 2 || +m[1] === 3) {
        version = +m[1] as any;
      }
    }
    let parentPath = [];
    const jar = options.page.replace(/^\//, "").split("/");
    for (let i = 0; i < jar.length; i++) {
      const pageName = jar[i];
      buildPage(parentPath.join("/"), pageName, i + 1 === jar.length, version);
      parentPath.push(paramCase(pageName));
    }
  }
}
