#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var download = require("download-git-repo");
var ora = require("ora");
var chalk = require("chalk");
var winston = require("winston");
program
    .usage("<project-name>")
    .parse(process.argv);
var projectName = program.args[0];
var spinner = ora("initializing for " + projectName + " project...").start();
download("seanyujc/sgn-tpl-vue", projectName, function (err) {
    spinner.stop();
    if (err) {
        winston.log(err);
        winston.log(chalk.red("  Initialize failed with errors.\n"));
    }
    else {
        winston.log(chalk.cyan("  Initialize complete.\n"));
    }
});
//# sourceMappingURL=sgv-init.js.map