import program = require("commander");
import readline = require("readline");

program
  .usage("[entry]")
  .option("-p,--page [page-name]", "remove page module")
  .option("-s,--service [service-name]", "remove service")
  .option("-c,--comp [comp-name]", "remove component module")
  .parse(process.argv);
