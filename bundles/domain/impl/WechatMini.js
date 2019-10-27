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
var WechatMini = /** @class */ (function (_super) {
    __extends(WechatMini, _super);
    function WechatMini() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WechatMini.prototype.buildPage = function (name) {
        var _this = this;
        var fileName = this.changeCaseKebab(name);
        var beforePath = "";
        if (name.indexOf("/") !== -1) {
            var fn = name.substring(name.lastIndexOf("/") + 1);
            fileName = this.changeCaseKebab(fn);
            beforePath = name.substring(0, name.lastIndexOf("/")).replace(/^\//, "");
        }
        var miniprogramRoot = path.join(_super.prototype.getCurrentDir.call(this), "miniprogram");
        var config = "\"pages/" + beforePath + "/" + fileName + "/" + fileName + "\"";
        fs.readFile(miniprogramRoot + "/app.json", function (error, data) {
            var content = data.toString("utf8");
            try {
                var appJson = JSON.parse(content);
                if (appJson.pages.indexOf(config) === -1) {
                    appJson.pages = appJson.pages.map(JSON.stringify);
                    appJson.pages.push(config);
                    var val = appJson.pages.join("," + _super.prototype.endl.call(_this) + "    ");
                    var res = content.replace(/"pages": \[([^\]]*)/, "\"pages\": [\n    " + val + "\n");
                    _super.prototype.writeFile.call(_this, miniprogramRoot, "/app.json", res, true);
                    _this.buildComponentBase("pages", fileName, beforePath, false);
                }
            }
            catch (error) {
                winston.error(error);
            }
        });
    };
    WechatMini.prototype.buildComponent = function (name) {
        var _this = this;
        var fileName = this.changeCaseKebab(name);
        var miniprogramRoot = path.join(_super.prototype.getCurrentDir.call(this), "miniprogram");
        fs.readdir(miniprogramRoot + "/components", function (error, files) {
            if (error) {
                winston.error(error.message);
                return;
            }
            else {
                var existed = [];
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file = files_1[_i];
                    var dir = miniprogramRoot + "/components/" + file;
                    var stats = fs.statSync(dir);
                    if (stats.isDirectory()) {
                        existed.push(file);
                    }
                }
                if (existed.indexOf(fileName) !== -1) {
                    winston.warn("已经存在！");
                    return;
                }
                _this.buildComponentBase("components", fileName);
            }
        });
    };
    WechatMini.prototype.buildComponentBase = function (dirPath, fileName, prefix, isComponent) {
        if (prefix === void 0) { prefix = ""; }
        if (isComponent === void 0) { isComponent = true; }
        var p = [dirPath];
        if (prefix) {
            p.push(prefix);
        }
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "miniprogram/" + p.join("/"), fileName);
        var jsonContent = isComponent ? "{\n  \"component\": true,\n  \"usingComponents\": {\n  }\n}\n" : "{\n  \"usingComponents\": {\n  }\n}";
        _super.prototype.writeFile.call(this, basePath, fileName + ".json", jsonContent);
        var tsContent = isComponent ? "/**\n * " + fileName + "\n */\nComponent({});\n" : "/**\n * " + fileName + "\n */\nPage({\n  data: {},\n  onLoad() {\n    // todo\n  },\n  onShow() {\n    // todo\n  },\n  onReady() {\n    // todo\n  },\n});\n";
        _super.prototype.writeFile.call(this, basePath, fileName + ".ts", tsContent);
        _super.prototype.writeFile.call(this, basePath, fileName + ".wxml", "<view class=\"container\">" + fileName + "</view>");
        _super.prototype.writeFile.call(this, basePath, fileName + ".wxss", "");
    };
    return WechatMini;
}(Base_1.Base));
exports.WechatMini = WechatMini;
//# sourceMappingURL=WechatMini.js.map