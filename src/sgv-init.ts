#!/usr/bin/env node
import program = require("commander");
import download = require("download-git-repo");
import ora = require("ora");
import { TPL_GITHUB_REPOSITORY } from "./config";
const chalk = require("chalk");
const winston = require("winston");
const ncp = require("ncp").ncp;
const rm = require("rimraf").sync;
const gitclone = require("git-clone");

const sgvConfig = require("../package").sgvConfig;

program
  .usage("<project-name>")
  .option("-n,--new [app-name]", "create sub app ")
  .option("-t,--template [template-name]", "create sub app ")
  .parse(process.argv);

const projectName = program.args[0] || ".";
const template = program.template || sgvConfig.template;

if (!program.hasOwnProperty("new")) {
  const spinner = ora(
    "initializing for " + projectName + " project...",
  ).start();
  if (sgvConfig.private) {
    gitclone(template, projectName, {}, (err) => {
      if (err) {
        winston.log(err);
        winston.log(chalk.red("  Initialize failed with errors.\n"));
      } else {
        rm(projectName + "/.git");
        winston.log(chalk.cyan("  Initialize complete.\n"));
      }
      spinner.stop();
    });
  } else {
    gitclone(TPL_GITHUB_REPOSITORY, projectName, {}, (err) => {
      if (err) {
        winston.log(err);
        winston.log(chalk.red("  Initialize failed with errors.\n"));
      } else {
        winston.log(chalk.cyan("  Initialize complete.\n"));
      }
      spinner.stop();
    });
  }
}
if (program.hasOwnProperty("new")) {
  const appName = program.new;
  const spinner = ora(
    "initializing for " + projectName + " project...",
  ).start();
  if (sgvConfig.private) {
    gitclone(template, projectName + "/.temp/" + appName + "", (err) => {
      spinner.stop();
      if (err) {
        winston.log(err);
        winston.log(chalk.red("  Initialize failed with errors.\n"));
      } else {
        ncp(
          "./" + projectName + "/.temp/" + appName + "/src/app",
          "./" + projectName + "/src/" + appName + "",
          (err1) => {
            rm("./" + projectName + "/.temp");
            if (err1) {
              return winston.error(err1);
            }
            winston.log(chalk.cyan(" " + appName + " Initialize complete.\n"));
          },
        );
      }
    });
  } else {
    gitclone(
      TPL_GITHUB_REPOSITORY,
      projectName + "/.temp/" + appName + "",
      (err) => {
        spinner.stop();
        if (err) {
          winston.log(err);
          winston.log(chalk.red("  Initialize failed with errors.\n"));
        } else {
          ncp(
            "./" + projectName + "/.temp/" + appName + "/src/app",
            "./" + projectName + "/src/" + appName + "",
            (err1) => {
              rm("./" + projectName + "/.temp");
              if (err1) {
                return winston.error(err1);
              }
              winston.log(
                chalk.cyan(" " + appName + " Initialize complete.\n"),
              );
            },
          );
        }
      },
    );
  }
}
