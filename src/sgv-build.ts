import program = require("commander");
import * as winston from "winston";
import { Page } from "./domain/impl/Page";

program
  .usage("[entry]")
  .option("-p,--page [page-name]", "create page module")
  .option("-c,--comp [comp-name]", "create component module")
  .option("-s,--service [service-name]", "create service module")
  .option("-f,--fun [method-name]", "method name")
  .parse(process.argv);

if (program.hasOwnProperty("page")) {
  const page = new Page(program.page);
  page.copyFiles();
  page.addFactoryFun();
  page.addRouter();
}

if (program.hasOwnProperty("comp")) {

}
