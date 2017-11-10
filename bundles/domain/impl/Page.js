"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Page = /** @class */ (function () {
    function Page() {
        this.templatePath = path.join(__dirname, "../../../", ".sgv/page");
    }
    Page.prototype.copyFiles = function () {
        console.log(this.templatePath);
        console.log(path.join("./src/pages"));
    };
    Page.prototype.replace = function () {
        throw new Error("Method not implemented.");
    };
    return Page;
}());
exports.Page = Page;
//# sourceMappingURL=Page.js.map