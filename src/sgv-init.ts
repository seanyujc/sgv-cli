#!/usr/bin/env node
import { program } from "commander";
import ora from "ora";
import gitclone from "git-pull-or-clone";
import winston, { level } from "winston";
import chalk from "chalk";
import { sync as rm } from "rimraf";
import { ncp } from "ncp";
import { PC_TPL_GITHUB_REPOSITORY, H5_TPL_GITHUB_REPOSITORY } from "./config";
import path from "path";
import * as fs from "fs";
import { getCurrentDir } from "./core/common";
import inquirer from "inquirer";

program
  .name("init")
  .usage("<project name>")
  .option("-t,--template [template name]", "use custom template")
  .option("-a,--add [add child project]", "add the child project in project")
  .parse(process.argv);

const projectName = program.args[0];

inquirer
  .prompt([
    {
      type: "list",
      name: "platform",
      message: "What platform projcet do you want to create?",
      choices: ["pc", "mobile"],
    },
  ])
  .then((answers) => {
    let template = PC_TPL_GITHUB_REPOSITORY;
    if (answers.platform === "mobile") {
      template = H5_TPL_GITHUB_REPOSITORY;
    }
    buildProject(template, projectName);
  });

async function buildProject(
  template: string,
  projectName: string,
  add = false
) {
  if (!add) {
    const spinner = ora(
      "initializing for " + projectName + " project..."
    ).start();
    const pathFull = path.resolve(getCurrentDir(), projectName);

    if (fs.existsSync(pathFull)) {
      spinner.fail(`the given path exists: ${pathFull}`);
      return;
    }
    gitclone(template, projectName, { depth: '1' }, (err) => {
      if (err) {
        spinner.fail(err.message);
      } else {
        rm(projectName + "/.git");
        spinner.succeed("Initialize completed.");
        spinner.info(`To develop:
cd ${projectName}
npm i
npm run dev`);
      }
    });
  } else {
    const spinner = ora(
      "initializing for " + projectName + " project..."
    ).start();
    gitclone(template, "./.temp/" + projectName + "", { depth: '1' }, (err) => {
      spinner.stop();
      if (err) {
        spinner.fail(err.message);
      } else {
        ncp(
          "./.temp/" + projectName + "/src/app",
          "./src/" + projectName + "",
          (err1) => {
            rm("./" + projectName + "/.temp");
            if (err1) {
              spinner.fail(err1.map((value) => value.message).join(", "));
              return;
            }
            spinner.succeed(" " + projectName + " Initialize completed.");
          }
        );
      }
    });
  }
}
