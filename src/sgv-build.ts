import program = require("commander");
import * as winston from "winston";
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
  const page = new Page(program.page);
  page.copyFiles();
  page.addFactoryFun();
  page.addRouter();
}

if (program.hasOwnProperty("comp")) {

}

if (program.hasOwnProperty("service") && !program.hasOwnProperty("fun")) {
  const service = new Service(program.service);
  service.copyFiles();
  service.addFactoryFun();
}

if (program.hasOwnProperty("service") && program.hasOwnProperty("fun")) {
  const service = new Service(program.service, program.fun);
  service.addServiceFun();
  service.addAPI(program.method || "post");
}

if (program.hasOwnProperty("api") && program.hasOwnProperty("method")) {
  const service = new Service(undefined, program.api);
  service.addAPI(program.method);
}

