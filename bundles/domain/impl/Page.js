"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var config_1 = require("../../config");
var Base_1 = require("./Base");
var rimraf = require("rimraf");
var winston = require("winston");
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page(pageName) {
        var _this = _super.call(this) || this;
        _this.pageName = pageName;
        _this.templatePath = path.join(__dirname, "../../../", ".sgv/page/main");
        _this.routerTplPath = path.join(__dirname, "../../../", ".sgv/page/index.router.ts");
        return _this;
    }
    Page.prototype.copyFiles = function () {
        var _this = this;
        // winston.info(this.templatePath);
        // winston.info(path.join("./src/pages"));
        fs.readdir(this.templatePath, function (err, files) {
            if (err) {
                winston.error(err.message);
                return;
            }
            files.forEach(function (fileName, index, array) {
                var extname = _super.prototype.getExtname.call(_this, fileName);
                var pathName = path.join(_this.templatePath, fileName);
                fs.readFile(pathName, function (error, data) {
                    var content = _super.prototype.replaceKeyword.call(_this, data.toString("utf8"), _this.pageName);
                    var basePath = path.join(_super.prototype.getCurrentDir.call(_this), "src/app/pages", _this.pageName);
                    _super.prototype.writeFile.call(_this, basePath, _this.pageName + extname, content);
                });
            });
        });
    };
    Page.prototype.addFactoryFun = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/pages");
        var fileName = "factory.page.ts";
        var content = _super.prototype.replaceKeyword.call(this, config_1.PAGE.FACTORY_FUNCTION_CONTENT, this.pageName);
        var addContent = config_1.PAGE.FACTORY_ANCHOR + _super.prototype.endl.call(this) + content;
        _super.prototype.addContentToFile.call(this, basePath, fileName, config_1.PAGE.FACTORY_ANCHOR, config_1.PAGE.FACTORY_ANCHOR, addContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.pageName + " page's factory!");
        });
    };
    Page.prototype.addRouter = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app");
        var fileName = "index.router.ts";
        var original = fs.readFileSync(this.routerTplPath).toString("utf8");
        var configContent = config_1.PAGE.ROUTER_CONFIG_ANCHOR + _super.prototype.endl.call(this) + "  "
            + _super.prototype.replaceKeyword.call(this, config_1.PAGE.ROUTER_CONFIG_CONTENT, this.pageName);
        _super.prototype.addContentToFile.call(this, basePath, fileName, original, config_1.PAGE.ROUTER_CONFIG_ANCHOR, configContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.pageName + " page's route!");
        });
    };
    Page.prototype.removeFiles = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/pages", this.pageName);
        rimraf(basePath, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Removed All files of " + _this.pageName + " page.");
        });
    };
    Page.prototype.deleteFactoryFun = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/pages");
        var fileName = "factory.page.ts";
        var pattern = _super.prototype.replaceKeyword.call(this, config_1.PAGE.FACTORY_FUNCTION_PATTERN, this.pageName) + _super.prototype.endl.call(this);
        _super.prototype.deleteContentFromFile.call(this, basePath, fileName, pattern, function (err) {
            if (err && err.name === "without") {
                winston.error("Without config option in factory file!");
                return;
            }
            else if (err) {
                winston.log("error", err.message, err);
                return;
            }
            winston.info("Deleted Factory function of " + _this.pageName + " page.");
        });
    };
    Page.prototype.deleteRouter = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app");
        var fileName = "index.router.ts";
        var pattern = _super.prototype.replaceKeyword.call(this, config_1.PAGE.ROUTER_CONFIG_PATTERN, this.pageName) + _super.prototype.endl.call(this);
        _super.prototype.deleteContentFromFile.call(this, basePath, fileName, pattern, function (err) {
            if (err && err.name === "without") {
                winston.error("Without config option in router file!");
                return;
            }
            else if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Deleted router config of " + _this.pageName + " page.");
        });
    };
    return Page;
}(Base_1.Base));
exports.Page = Page;
//# sourceMappingURL=Page.js.map