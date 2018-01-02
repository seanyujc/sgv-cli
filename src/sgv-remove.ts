import program = require("commander");
import readline = require("readline");
import { Page } from "./domain/impl/Page";
import { Service } from "./domain/impl/Service";

program
  .usage("[entry]")
  .option("-p,--page [page-name]", "remove page module")
  .option("-s,--service [service-name]", "remove service")
  .option("-c,--comp [comp-name]", "remove component module")
  .parse(process.argv);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (program.hasOwnProperty("page")) {
  rl.question(`Are you sure to remove ${program.page} page?(y or N):`, (answer) => {
    if (answer.toLocaleLowerCase() === "y") {
      const page = new Page(program.page);
      page.removeFiles();
      page.deleteFactoryFun();
      page.deleteRouter();
    }
    rl.close();
  });
}

if (program.hasOwnProperty("comp")){

}

if (program.hasOwnProperty("service")) {
  rl.question(`Are you sure to remove ${program.service} service?(y or N):`, (answer) => {
    if (answer.toLocaleLowerCase() === "y") {
      const service = new Service(program.service);
      service.removeFiles();
      service.deleteFactoryFun();
    }
    rl.close();
  });
}
