#!/usr/bin/env node
// console.log(123);

import program = require("commander");
import { WechatMini } from "./domain/impl/WechatMini";

program
  .usage("<cmd-name>")
  .option("-p,--page [page-name]", "create page module")
  .option("-c,--comp [comp-name]", "create component module")
  .parse(process.argv);

const cmdName = program.args[0] || "build";
// console.log(program);

const wechatMini = new WechatMini();

switch (cmdName) {
  case "build":
    if (program.hasOwnProperty("page")) {
      console.log("Begin create page...");
      wechatMini.buildPage(program.page);
    } else if (program.hasOwnProperty("comp")) {
      console.log("Begin create component...");
      wechatMini.buildComponent(program.comp);
    }

    break;
  case "remove":
    if (program.hasOwnProperty("page")) {
    } else if (program.hasOwnProperty("comp")) {
    }
    break;
  default:
    break;
}
