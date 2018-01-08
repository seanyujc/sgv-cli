#!/usr/bin/env node
import program = require("commander");
import download = require("download-git-repo");
import ora = require("ora");
const chalk = require("chalk");
const winston = require("winston");

program
  .usage("<project-name>")
  .parse(process.argv);
const projectName = program.args[0];
const spinner = ora("initializing for " + projectName + " project...").start();
download("seanyujc/sgv-tpl-webpack", projectName, (err) => {
  spinner.stop();
  if (err) {
    winston.log(err);
    winston.log(chalk.red("  Initialize failed with errors.\n"));
  } else {
    winston.log(chalk.cyan("  Initialize complete.\n"));
  }
});
