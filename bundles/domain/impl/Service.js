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
var rimraf = require("rimraf");
var winston = require("winston");
var config_1 = require("../../config");
var Base_1 = require("./Base");
var Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    function Service(name, appName, funName) {
        if (appName === void 0) { appName = "app"; }
        var _this = _super.call(this) || this;
        _this.appName = appName;
        _this.name = name;
        _this.funName = funName;
        _this.templatePath = path.join(__dirname, "../../../", ".sgv/service");
        _this.factoryPath = path.join(__dirname, "../../../", ".sgv/page/index.router.ts");
        return _this;
    }
    Service.prototype.copyFiles = function () {
        var _this = this;
        fs.readdir(this.templatePath, function (err, files) {
            if (err) {
                winston.error(err.message);
                return;
            }
            files.forEach(function (fileName, index, array) {
                var extname = _super.prototype.getExtname.call(_this, fileName);
                var pathName = path.join(_this.templatePath, fileName);
                fs.readFile(pathName, function (error, data) {
                    var content = _super.prototype.replaceKeyword.call(_this, data.toString("utf8"), _this.name);
                    var basePath = path.join(_super.prototype.getCurrentDir.call(_this), "src/" + _this.appName + "/core/services");
                    _super.prototype.writeFile.call(_this, basePath, _this.name + extname, content);
                });
            });
        });
    };
    Service.prototype.addFactoryFun = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/" + this.appName + "/core");
        var fileName = "factory.serv.ts";
        var importContent = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.IMPORT_CONTENT, this.name);
        var addImportContent = config_1.SERVICE.IMPORT_ANCHOR + _super.prototype.endl.call(this) + importContent;
        var facContent = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.FACTORY_FUNCTION_CONTENT, this.name);
        var addFacContent = config_1.SERVICE.FACTORY_ANCHOR + _super.prototype.endl.call(this) + facContent;
        _super.prototype.addContentToFile.call(this, basePath, fileName, config_1.SERVICE.ORIGINAL, config_1.SERVICE.IMPORT_ANCHOR, addImportContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.name + " service's factory import!");
            _super.prototype.addContentToFile.call(_this, basePath, fileName, config_1.SERVICE.ORIGINAL, config_1.SERVICE.FACTORY_ANCHOR, addFacContent, function (err1) {
                if (err1) {
                    winston.error(err1.message);
                    return;
                }
                winston.info("Added " + _this.name + " page's factory function!");
            });
        });
    };
    Service.prototype.removeFiles = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/" + this.appName + "/core/services", this.name + ".serv.ts");
        rimraf(basePath, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Removed All files of " + _this.name + " page.");
        });
    };
    Service.prototype.deleteFactoryFun = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/" + this.appName + "/core");
        var fileName = "factory.serv.ts";
        var pattern = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.FACTORY_FUNCTION_PATTERN, this.name) +
            _super.prototype.endl.call(this);
        _super.prototype.deleteContentFromFile.call(this, basePath, fileName, pattern, function (err) {
            if (err && err.name === "without") {
                winston.error("Without config option in factory file!");
                return;
            }
            else if (err) {
                winston.log("error", err.message, err);
                return;
            }
            winston.info("Deleted Factory function of " + _this.name + " service.");
            pattern =
                _super.prototype.replaceKeyword.call(_this, config_1.SERVICE.IMPORT_PATTERN, _this.name) + _super.prototype.endl.call(_this);
            _super.prototype.deleteContentFromFile.call(_this, basePath, fileName, pattern, function (err1) {
                if (err1 && err1.name === "without") {
                    winston.error("Without config option in factory file!");
                    return;
                }
                else if (err1) {
                    winston.log("error", err1.message, err1);
                    return;
                }
                winston.info("Deleted Factory function of " + _this.name + " service.");
            });
        });
    };
    Service.prototype.addServiceFun = function () {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/" + this.appName + "/core/services");
        var fileName = this.name + ".serv.ts";
        var interfaceContent = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.INTERFACE_CONTENT, this.funName);
        var addIFContent = config_1.SERVICE.INTERFACE_ANCHOR + _super.prototype.endl.call(this) + interfaceContent;
        var funContent = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.FUNCTION_FUNCTION_CONTENT, this.funName);
        var addFunContent = config_1.SERVICE.FUNCTION_ANCHOR + _super.prototype.endl.call(this) + funContent;
        _super.prototype.addContentToFile.call(this, basePath, fileName, "", config_1.SERVICE.INTERFACE_ANCHOR, addIFContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.funName + " interface in " + _this.name + " service!");
        });
        _super.prototype.addContentToFile.call(this, basePath, fileName, "", config_1.SERVICE.FUNCTION_ANCHOR, addFunContent, function (err1) {
            if (err1) {
                winston.error(err1.message);
                return;
            }
            winston.info("Added " + _this.funName + " function in " + _this.name + " service!");
        });
    };
    Service.prototype.addAPI = function (method) {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "src/" + this.appName + "/config");
        var fileName = "api.conf.ts";
        var apiContent = _super.prototype.replaceKeyword.call(this, config_1.SERVICE.API_CONTENT, this.funName);
        var addAPIAnchor = method.toLocaleUpperCase() === "POST"
            ? config_1.SERVICE.API_POST_ANCHOR
            : config_1.SERVICE.API_GET_ANCHOR;
        var addAPIContent = addAPIAnchor + _super.prototype.endl.call(this) + apiContent;
        _super.prototype.addContentToFile.call(this, basePath, fileName, "", addAPIAnchor, addAPIContent, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("Added " + _this.funName + " api cofig!");
        });
    };
    return Service;
}(Base_1.Base));
exports.Service = Service;
//# sourceMappingURL=Service.js.map