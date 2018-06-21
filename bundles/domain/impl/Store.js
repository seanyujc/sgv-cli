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
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(pageName, compName, states, appName) {
        if (appName === void 0) { appName = "app"; }
        var _this = _super.call(this) || this;
        _this.states = states;
        _this.appName = appName;
        _this.templateFile = path.join(__dirname, "../../../", ".sgv/store.ts");
        if (pageName) {
            _this.targetPath = "src/" + _this.appName + "/pages/" + pageName;
            _this.name = pageName + "Page";
        }
        else if (compName) {
            _this.targetPath = "src/" + _this.appName + "/components/" + compName;
            _this.name = compName + "Comp";
        }
        return _this;
    }
    Store.prototype.copyFile = function () {
        var _this = this;
        fs.readFile(this.templateFile, function (err, data) {
            if (err) {
                winston.error(err.message);
                return;
            }
            var content = _super.prototype.replaceKeyword.call(_this, data.toString("utf8"), _this.name);
            var basePath = path.join(_super.prototype.getCurrentDir.call(_this), _this.targetPath);
            _super.prototype.writeFile.call(_this, basePath, "store.ts", content);
        });
    };
    return Store;
}(Base_1.Base));
exports.Store = Store;
//# sourceMappingURL=Store.js.map