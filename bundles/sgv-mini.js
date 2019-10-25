#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log(123);
var program = require("commander");
var WechatMini_1 = require("./domain/impl/WechatMini");
program
    .usage("<cmd-name>")
    .option("-p,--page [page-name]", "create page module")
    .option("-c,--comp [comp-name]", "create component module")
    .parse(process.argv);
var cmdName = program.args[0] || "build";
console.log(program);
var wechatMini = new WechatMini_1.WechatMini();
switch (cmdName) {
    case "build":
        if (program.hasOwnProperty("page")) {
            wechatMini.buildPage(program.page);
            console.log("page");
        }
        else if (program.hasOwnProperty("comp")) {
            console.log("comp");
        }
        break;
    case "remove":
        if (program.hasOwnProperty("page")) {
        }
        else if (program.hasOwnProperty("comp")) {
        }
        break;
    default:
        break;
}
//# sourceMappingURL=sgv-mini.js.map