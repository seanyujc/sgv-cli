"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var readline = require("readline");
var Page_1 = require("./domain/impl/Page");
program
    .usage('[entry]')
    .option('-p,--page [page-name]', 'create page module')
    .option('-c,--comp [comp-name]', 'create component module')
    .parse(process.argv);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
if (program.hasOwnProperty("page")) {
    rl.question("Are you sure to remove " + program.page + " page?(y or N):", function (answer) {
        if (answer.toLocaleLowerCase() === 'y') {
            var page = new Page_1.Page(program.page);
            page.removeFiles();
            page.deleteFactoryFun();
            page.deleteRouter();
        }
        rl.close();
    });
}
//# sourceMappingURL=sgv-remove.js.map