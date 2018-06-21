import program = require("commander");
import * as winston from "winston";

program
  .usage("[entry]")
  .option("-p,--page [page-name]", "create page module")
  .option("-c,--comp [comp-name]", "create component module")
  .option("-s,--service [service-name]", "create service module")
  .option("-f,--fun [method-name]", "method name")
  .option("-i,--api [api-name]", "current api")
  .option("-m,--method [request method name]", "method name of current api")
  .option("-t,--store [request method name]", "method name of current api")
  .parse(process.argv);

if (
  (program.hasOwnProperty("page") || program.hasOwnProperty("comp")) &&
  program.hasOwnProperty("store")
) {
  const appName = program.args[0];
  winston.debug(program.page);
  winston.debug(program.store);
}