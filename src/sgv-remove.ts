import program = require('commander')
import readline = require('readline');
import { Page } from './domain/impl/Page';

program
  .usage('[entry]')
  .option('-p,--page [page-name]', 'create page module')
  .option('-c,--comp [comp-name]', 'create component module')
  .parse(process.argv);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (program.hasOwnProperty("page")) {
  rl.question(`Are you sure to remove ${program.page} page?(y or N):`, (answer) => {
    if (answer.toLocaleLowerCase() === 'y') {
      const page = new Page(program.page);
      page.removeFiles();
      page.deleteFactoryFun();
      page.deleteRouter();
    }
    rl.close();
  });
}