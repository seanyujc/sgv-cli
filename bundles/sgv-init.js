#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var download = require("download-git-repo");
var ora = require("ora");
var chalk = require("chalk");
var winston = require("winston");
var ncp = require("ncp").ncp;
var rm = require("rimraf").sync;
program
    .usage("<project-name>")
    .option("-n,--new [app-name]", "create new app ")
    .parse(process.argv);
var projectName = program.args[0];
if (!program.hasOwnProperty("new")) {
    var spinner_1 = ora("initializing for " + projectName + " project...").start();
    download("seanyujc/sgv-tpl-webpack", projectName, function (err) {
        spinner_1.stop();
        if (err) {
            winston.log(err);
            winston.log(chalk.red("  Initialize failed with errors.\n"));
        }
        else {
            winston.log(chalk.cyan("  Initialize complete.\n"));
        }
    });
}
if (program.hasOwnProperty("new")) {
    var appName_1 = program.new;
    var spinner_2 = ora("initializing for " + projectName + " project...").start();
    download("seanyujc/sgv-tpl-webpack", projectName + "/.temp/" + appName_1 + "", function (err) {
        spinner_2.stop();
        if (err) {
            winston.log(err);
            winston.log(chalk.red("  Initialize failed with errors.\n"));
        }
        else {
            ncp("./" + projectName + "/.temp/" + appName_1 + "/src/app", "./" + projectName + "/src/" + appName_1 + "", function (err1) {
                rm("./" + projectName + "/.temp");
                if (err1) {
                    return console.error(err1);
                }
                winston.log(chalk.cyan(" " + appName_1 + " Initialize complete.\n"));
            });
        }
    });
}
//# sourceMappingURL=sgv-init.js.map