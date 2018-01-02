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
var winston = require("winston");
var Base_1 = require("./Base");
var index_1 = require("../../config/index");
var rimraf = require("rimraf");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(compName) {
        var _this = _super.call(this) || this;
        _this.compName = compName;
        _this.templatePath = path.join(__dirname, "../../../", ".sgv/page/main");
        return _this;
    }
    Component.prototype.copyFiles = function () {
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
                    var content = _super.prototype.replaceKeyword.call(_this, data.toString("utf8"), _this.compName);
                    var basePath = path.join(_super.prototype.getCurrentDir.call(_this), "src/app/components", _this.compName);
                    _super.prototype.writeFile.call(_this, basePath, _this.compName + extname, content);
                });
            });
        });
    };
    Component.prototype.addFactoryConfig = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/components");
        var fileName = "factory.comp.ts";
        var content = _super.prototype.replaceKeyword.call(this, index_1.COMP.FACTORY_CONTENT, this.compName);
        var addContent = index_1.COMP.FACTORY_ANCHOR + _super.prototype.endl.call(this) + content;
        _super.prototype.addContentToFile.call(this, basePath, fileName, index_1.COMP.FACTORY_ANCHOR, index_1.COMP.FACTORY_ANCHOR, addContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.compName + " components's factory config!");
        });
    };
    Component.prototype.removeFiles = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/components", this.compName);
        rimraf(basePath, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Removed All files of " + _this.compName + " component.");
        });
    };
    Component.prototype.deleteFactoryConfig = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/app/components");
        var fileName = "factory.comp.ts";
        var pattern = _super.prototype.replaceKeyword.call(this, index_1.COMP.FACTORY_PATTERN, this.compName) + _super.prototype.endl.call(this);
        winston.log("error", pattern);
        _super.prototype.deleteContentFromFile.call(this, basePath, fileName, pattern, function (err) {
            if (err && err.name === "without") {
                winston.error("Without config option in factory file!");
                return;
            }
            else if (err) {
                winston.log("error", err.message, err);
                return;
            }
            winston.info("Deleted Factory function of " + _this.compName + " component.");
        });
    };
    return Component;
}(Base_1.Base));
exports.Component = Component;
//# sourceMappingURL=Component.js.map