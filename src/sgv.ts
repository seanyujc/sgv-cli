#!/usr/bin/env node
import inquirer from "inquirer";

import { program } from "commander";
const packagejson = require("../package");
program.version(packagejson.version);

program
  .description(
    "SGV(Smart Grand Visual) is A simple CLI for scaffolding Vue.js projects(typescript).",
  )
  .name("sgv")
  .usage("<command> [options] ")
  .command("init", "generate a new project from a template")
  .command(
    "build",
    "generate a new page, commponent or service to current project",
  )
  .command(
    "remove",
    "remove a new page, commponent or service to current project",
  )
  .command("mini", "miniprogram")
  .parse(process.argv);
