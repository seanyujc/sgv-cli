"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
program
    .usage("[entry]")
    .option("-p,--page [page-name]", "remove page module")
    .option("-s,--service [service-name]", "remove service")
    .option("-c,--comp [comp-name]", "remove component module")
    .parse(process.argv);
//# sourceMappingURL=sgvs-remove.js.map