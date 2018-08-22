#!/usr/bin/env node
import program = require("commander");
import download = require("download-git-repo");
import ora = require("ora");
const chalk = require("chalk");
const winston = require("winston");
const ncp = require("ncp").ncp;
const rm = require("rimraf").sync;

program
  .usage("<project-name>")
  .option("-n,--new [app-name]", "create sub app ")
  .option("-t,--template [template-name]", "create sub app ")
  .parse(process.argv);

const projectName = program.args[0] || ".";
const template = program.template || "seanyujc/sgv-tpl-webpack";

if (!program.hasOwnProperty("new")) {
  const spinner = ora(
    "initializing for " + projectName + " project...",
  ).start();
  download(template, projectName, err => {
    spinner.stop();
    if (err) {
      winston.log(err);
      winston.log(chalk.red("  Initialize failed with errors.\n"));
    } else {
      winston.log(chalk.cyan("  Initialize complete.\n"));
    }
  });
}
if (program.hasOwnProperty("new")) {
  const appName = program.new;
  const spinner = ora(
    "initializing for " + projectName + " project...",
  ).start();
  download(
    template,
    projectName + "/.temp/" + appName + "",
    err => {
      spinner.stop();
      if (err) {
        winston.log(err);
        winston.log(chalk.red("  Initialize failed with errors.\n"));
      } else {
        ncp(
          "./" + projectName + "/.temp/" + appName + "/src/app",
          "./" + projectName + "/src/" + appName + "",
          err1 => {
            rm("./" + projectName + "/.temp");
            if (err1) {
              return winston.error(err1);
            }
            winston.log(chalk.cyan(" " + appName + " Initialize complete.\n"));
          },
        );
      }
    },
  );
}
