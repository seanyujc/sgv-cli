#!/usr/bin/env node
import ora = require('ora')
import program = require('commander')
import download = require('download-git-repo')
const chalk = require('chalk')

program
  .usage('<project-name>')
  .parse(process.argv);
const projectName = program.args[0];
var spinner = ora('initializing for ' + projectName + ' project...').start()
download('seanyujc/sgn-tpl-vue', projectName, function (err) {
  spinner.stop();
  if (err) {
    console.log(err);
    console.log(chalk.red('  Initialize failed with errors.\n'))
  } else {
    console.log(chalk.cyan('  Initialize complete.\n'))
  }
})

