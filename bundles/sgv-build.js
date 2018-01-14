"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var Component_1 = require("./domain/impl/Component");
var Page_1 = require("./domain/impl/Page");
var Service_1 = require("./domain/impl/Service");
program
    .usage("[entry]")
    .option("-p,--page [page-name]", "create page module")
    .option("-c,--comp [comp-name]", "create component module")
    .option("-s,--service [service-name]", "create service module")
    .option("-f,--fun [method-name]", "method name")
    .option("-i,--api [api-name]", "current api")
    .option("-m,--method [request method name]", "method name of current api")
    .parse(process.argv);
if (program.hasOwnProperty("page")) {
    var page = new Page_1.Page(program.page);
    page.copyFiles();
    page.addFactoryFun();
    page.addRouter();
}
if (program.hasOwnProperty("comp")) {
    var comp = new Component_1.Component(program.comp);
    comp.copyFiles();
    comp.addFactoryConfig();
}
if (program.hasOwnProperty("service") && !program.hasOwnProperty("fun")) {
    var service = new Service_1.Service(program.service);
    service.copyFiles();
    service.addFactoryFun();
}
if (program.hasOwnProperty("service") && program.hasOwnProperty("fun")) {
    var service = new Service_1.Service(program.service, program.fun);
    service.addServiceFun();
    service.addAPI(program.method || "post");
}
if (program.hasOwnProperty("api") && program.hasOwnProperty("method")) {
    var service = new Service_1.Service(undefined, program.api);
    service.addAPI(program.method);
}
//# sourceMappingURL=sgv-build.js.map