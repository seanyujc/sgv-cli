#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const packagejson = require("../package");
commander_1.program.version(packagejson.version);
commander_1.program
    .description("SGV(Smart Grand Visual) is A simple CLI for scaffolding Vue.js projects(typescript).")
    .name("sgv")
    .usage("<command> [options] ")
    .command("init", "generate a new project from a template")
    .command("build", "generate a new page, commponent or service to current project")
    .command("remove", "remove a new page, commponent or service to current project")
    .parse(process.argv);
