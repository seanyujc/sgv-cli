#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ora_1 = __importDefault(require("ora"));
const git_clone_1 = __importDefault(require("git-clone"));
const rimraf_1 = require("rimraf");
const ncp_1 = require("ncp");
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const common_1 = require("./core/common");
const inquirer_1 = __importDefault(require("inquirer"));
commander_1.program
    .name("init")
    .usage("<project name>")
    .option("-t,--template [template name]", "use custom template")
    .option("-a,--add [add child project]", "add the child project in project")
    .parse(process.argv);
const projectName = commander_1.program.args[0];
inquirer_1.default
    .prompt([
    {
        type: "list",
        name: "platform",
        message: "What platform projcet do you want to create?",
        choices: ["pc", "mobile"],
    },
])
    .then((answers) => {
    let template = config_1.PC_TPL_GITHUB_REPOSITORY;
    if (answers.platform === "mobile") {
        template = config_1.H5_TPL_GITHUB_REPOSITORY;
    }
    buildProject(template, projectName);
});
function buildProject(template, projectName, add = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!add) {
            const spinner = ora_1.default("initializing for " + projectName + " project...").start();
            const pathFull = path_1.default.resolve(common_1.getCurrentDir(), projectName);
            if (fs.existsSync(pathFull)) {
                spinner.fail(`the given path exists: ${pathFull}`);
                return;
            }
            git_clone_1.default(template, projectName, { shallow: true }, (err) => {
                if (err) {
                    spinner.fail(err.message);
                }
                else {
                    rimraf_1.sync(projectName + "/.git");
                    spinner.succeed("Initialize completed.");
                    spinner.info(`To develop:
cd ${projectName}
npm i
npm run dev`);
                }
            });
        }
        else {
            const spinner = ora_1.default("initializing for " + projectName + " project...").start();
            git_clone_1.default(template, "./.temp/" + projectName + "", (err) => {
                spinner.stop();
                if (err) {
                    spinner.fail(err.message);
                }
                else {
                    ncp_1.ncp("./.temp/" + projectName + "/src/app", "./src/" + projectName + "", (err1) => {
                        rimraf_1.sync("./" + projectName + "/.temp");
                        if (err1) {
                            spinner.fail(err1.map((value) => value.message).join(", "));
                            return;
                        }
                        spinner.succeed(" " + projectName + " Initialize completed.");
                    });
                }
            });
        }
    });
}
