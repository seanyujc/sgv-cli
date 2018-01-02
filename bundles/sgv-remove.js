"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var readline = require("readline");
var Page_1 = require("./domain/impl/Page");
var Service_1 = require("./domain/impl/Service");
var Component_1 = require("./domain/impl/Component");
program
    .usage("[entry]")
    .option("-p,--page [page-name]", "remove page module")
    .option("-s,--service [service-name]", "remove service")
    .option("-c,--comp [comp-name]", "remove component module")
    .parse(process.argv);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
if (program.hasOwnProperty("page")) {
    rl.question("Are you sure to remove " + program.page + " page?(y or N):", function (answer) {
        if (answer.toLocaleLowerCase() === "y") {
            var page = new Page_1.Page(program.page);
            page.removeFiles();
            page.deleteFactoryFun();
            page.deleteRouter();
        }
        rl.close();
    });
}
if (program.hasOwnProperty("comp")) {
    rl.question("Are you sure to remove " + program.comp + " component?(y or N):", function (answer) {
        if (answer.toLocaleLowerCase() === "y") {
            var comp = new Component_1.Component(program.comp);
            comp.removeFiles();
            comp.deleteFactoryConfig();
        }
        rl.close();
    });
}
if (program.hasOwnProperty("service")) {
    rl.question("Are you sure to remove " + program.service + " service?(y or N):", function (answer) {
        if (answer.toLocaleLowerCase() === "y") {
            var service = new Service_1.Service(program.service);
            service.removeFiles();
            service.deleteFactoryFun();
        }
        rl.close();
    });
}
//# sourceMappingURL=sgv-remove.js.map