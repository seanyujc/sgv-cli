#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ora = require("ora");
var program = require("commander");
var download = require("download-git-repo");
var chalk = require('chalk');
program
    .usage('<project-name>')
    .parse(process.argv);
var projectName = program.args[0];
var spinner = ora('initializing for ' + projectName + ' project...').start();
download('seanyujc/sgn-tpl-vue', projectName, function (err) {
    spinner.stop();
    if (err) {
        console.log(err);
        console.log(chalk.red('  Initialize failed with errors.\n'));
    }
    else {
        console.log(chalk.cyan('  Initialize complete.\n'));
    }
});
//# sourceMappingURL=sgv-init.js.map