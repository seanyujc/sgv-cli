#!/usr/bin/env node

import program = require("commander");
import { Weapp } from "./core/weapp";
import chalk from "chalk";

program
  .usage("<cmd-name>")
  .option("-p,--page [page-name]", "create page module")
  .option("-c,--comp [comp-name]", "create component module")
  .option("-s,--service [service-name]", "create service module")
  .option(
    "-f,--function [function-name]",
    "create function module in service module",
  )
  .parse(process.argv);

const cmdName = program.args[0] || "build";
// console.log(program);

const wechatMini = new Weapp();

const options = program.opts();

switch (cmdName) {
  case "build":
    if (options.page) {
      console.log(chalk.green("Begin create page..."));
      wechatMini.buildPage(options.page);
    } else if (options.comp) {
      console.log(chalk.green("Begin create component..."));
      wechatMini.buildComponent(options.comp);
    } else if (options.service && !options.function) {
      console.log(chalk.green("Begin create service..."));
      wechatMini.buildService(options.service);
    } else if (options.service && options.function) {
      console.log(chalk.green("Begin create function in service..."));
      wechatMini.buildFuntionInService(options.function, options.service);
    }

    break;
  case "remove":
    if (options.page) {
      // todo
    } else if (options.comp) {
      // todo
    }
    break;
  default:
    break;
}
