#!/usr/bin/env node
import inquirer from "inquirer";

import { program } from "commander";
const packagejson = require("../package");
program.version(packagejson.version);

program
  .description("SGV is A simple CLI for scaffolding Vue.js projects(ts).")
  .name("sgv")
  .usage("<command> [options] ")
  .command("init", "generate a new project from a template")
  .command("build", "generate a new page, commponent or service to current project")
  .command("remove", "remove a new page, commponent or service to current project")
  .parse(process.argv);
