import program = require("commander");
import * as winston from "winston";
import { Component } from "./domain/impl/Component";
import { Page } from "./domain/impl/Page";
import { Service } from "./domain/impl/Service";

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
  const page = new Page(program.page, program.args[0]);
  page.copyFiles();
  page.addFactoryFun();
  page.addRouter();
}

if (program.hasOwnProperty("comp")) {
  const comp = new Component(program.comp, program.args[0]);
  comp.copyFiles();
  comp.addFactoryConfig();
}

if (program.hasOwnProperty("service") && !program.hasOwnProperty("fun")) {
  const service = new Service(program.service, program.args[0]);
  service.copyFiles();
  service.addFactoryFun();
}

if (program.hasOwnProperty("service") && program.hasOwnProperty("fun")) {
  const service = new Service(program.service, program.args[0], program.fun);
  service.addServiceFun();
  service.addAPI(program.method || "post");
}

if (program.hasOwnProperty("api") && program.hasOwnProperty("method")) {
  const service = new Service(undefined, program.args[0], program.api);
  service.addAPI(program.method);
}
