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
var Base_1 = require("./Base");
var WechatMini = /** @class */ (function (_super) {
    __extends(WechatMini, _super);
    function WechatMini() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WechatMini.prototype.buildPage = function (name) {
        var _this = this;
        var basePath = path.join(_super.prototype.getCurrentDir.call(this), "miniprogram/pages", this.changeCaseKebab(name));
        var fileName = this.changeCaseKebab(name);
        _super.prototype.writeFile.call(this, basePath, fileName + ".json", "{\n  \"usingComponents\": {\n  }\n}\n");
        _super.prototype.writeFile.call(this, basePath, fileName + ".ts", "/**\n * " + name + "\n */\nPage({});\n");
        _super.prototype.writeFile.call(this, basePath, fileName + ".wxml", "<view class=\"container\"></view>");
        _super.prototype.writeFile.call(this, basePath, fileName + ".wxss", "");
        var dir = path.join(_super.prototype.getCurrentDir.call(this), "miniprogram");
        // console.log(dir);
        fs.readFile(dir + "/app.json", function (error, data) {
            var content = data.toString("utf8");
            var res = content.replace(/"pages": \[([^\]]*)/, "\"pages\": [\n    \"pages/" + fileName + "/" + fileName + "\",$1");
            // console.log(res);
            _super.prototype.writeFile.call(_this, dir, "/app.json", res, true);
        });
    };
    return WechatMini;
}(Base_1.Base));
exports.WechatMini = WechatMini;
//# sourceMappingURL=WechatMini.js.map