"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var template = require("lodash.template");
var mkdirp = require("mkdirp");
var path = require("path");
var winston = require("winston");
var os = require("os");
var Base = /** @class */ (function () {
    function Base() {
    }
    Base.prototype.endl = function () {
        return os.EOL;
    };
    Base.prototype.getCurrentDir = function () {
        return process.env.PWD || process.cwd();
    };
    Base.prototype.getExtname = function (filename) {
        var i = filename.indexOf(".");
        return (i < 0) ? "" : filename.substr(i);
    };
    Base.prototype.upperFirst = function (str) {
        var first = str.substr(0, 1).toLocaleUpperCase();
        var surplus = str.substr(1, str.length);
        return first + surplus;
    };
    Base.prototype.replaceKeyword = function (tplContent, keyword) {
        var compiled = template(tplContent);
        var uFKeyword = this.upperFirst(keyword);
        return compiled({ keyword: keyword, uFKeyword: uFKeyword });
    };
    Base.prototype.mkdirs = function (dirpath, mode, callback) {
        if (fs.existsSync(dirpath)) {
            callback();
        }
        else {
            this.mkdirs(path.dirname(dirpath), mode, function () {
                fs.mkdirSync(dirpath, mode);
                callback();
            });
        }
    };
    Base.prototype.writeFile = function (basePath, fileName, data) {
        // const srcRoot = path.join(commons.currentPath(),  dir)
        var filePath = path.join(basePath, fileName);
        if (fs.existsSync(basePath) && fs.existsSync(filePath)) {
            return;
        }
        if (!fs.existsSync(basePath)) {
            mkdirp.sync(basePath);
        }
        fs.writeFile(filePath, data, { flag: "a" }, function (err) {
            if (err) {
                winston.error(err.message);
                return;
            }
            winston.info("created file: " + filePath);
        });
    };
    Base.prototype.addContentToFile = function (basePath, fileName, original, anchor, content, callback) {
        var filePath = path.join(basePath, fileName);
        if (!fs.existsSync(filePath)) {
            this.writeFile(basePath, fileName, original);
        }
        // 读文件写文件
        fs.readFile(filePath, function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            var fileContent = data.toString();
            var reg = new RegExp(anchor);
            if (fileContent.search(reg) === -1) {
                winston.error("Failed! Anchor not find.");
                return;
            }
            fileContent = fileContent.replace(reg, content);
            fs.writeFile(filePath, fileContent, function (error) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(undefined);
            });
        });
    };
    Base.prototype.deleteContentFromFile = function (basePath, fileName, pattern, callback) {
        var pathName = path.join(basePath, fileName);
        // console.log(pathName);
        fs.readFile(pathName, function (err, data) {
            if (err) {
                winston.log("error", err.message, err);
                return;
            }
            var content = data.toString("utf8");
            // console.log('readed');
            // console.log(pattern);
            var reg = new RegExp(pattern);
            if (content.search(reg) === -1) {
                var error = new Error();
                error.name = "没有找到配置";
                callback(error);
                return;
            }
            content = content.replace(reg, "");
            fs.writeFile(pathName, content, function (error) {
                if (error) {
                    callback(error);
                    return;
                }
                // console.log('writed');
                callback(undefined);
            });
        });
    };
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=Base.js.map