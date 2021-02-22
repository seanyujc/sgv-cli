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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const common_1 = require("./core/common");
const page_1 = require("./core/page");
const fs = __importStar(require("fs"));
commander_1.program
    .name("build")
    .usage("<project name>")
    .option("-p,--page [page name]", "generate a new page to current project")
    .option("-c,--component [component name]", "generate a new component to current project")
    .option("-s,--service [service name]", "generate a new service to current project")
    .parse(process.argv);
const options = commander_1.program.opts();
const packageJson = require(path_1.default.resolve(common_1.getCurrentDir(), "package.json"));
// vue version
let version = 3;
if (packageJson.dependencies && packageJson.dependencies.vue) {
    const vue = packageJson.dependencies.vue;
    const m = vue.match(/(\d+)\.\d+\.\d/);
    if (m !== null) {
        const v = +m[1];
        if (+m[1] === 2 || +m[1] === 3) {
            version = +m[1];
        }
    }
}
if (options.page) {
    let parentPath = [];
    const jar = options.page.replace(/^\//, "").split("/");
    for (let i = 0; i < jar.length; i++) {
        const pageName = jar[i];
        page_1.buildPage(parentPath.join("/"), pageName, i + 1 === jar.length, version);
        parentPath.push(change_case_1.paramCase(pageName));
    }
}
if (options.component) {
    const jar = options.component.replace(/^\//, "").split("/");
    const name = jar.pop() || options.component;
    const parentPath = jar.join("/");
    const parentPathUri = path_1.default.resolve(common_1.getCurrentDir(), "src/app/components", options.component);
    const templates = { 2: "component/v2", 3: "component/main" };
    const templatePath = path_1.default.resolve(__dirname, "../.template", templates[version]);
    if (!fs.existsSync(parentPathUri)) {
        fs.mkdirSync(parentPathUri, { recursive: true });
    }
    // console.log(templatePath);
    common_1.writeTemplateFiles(templatePath, parentPathUri, parentPath, name, {
        createFileName: "index.ts",
    });
}
