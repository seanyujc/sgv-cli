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
var config_1 = require("../../config");
var Base_1 = require("./Base");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(pageName, compName, states, appName) {
        if (appName === void 0) { appName = "app"; }
        var _this = _super.call(this) || this;
        _this.states = states;
        _this.appName = appName;
        _this.templateFile = path.join(__dirname, "../../../", ".sgv/store.ts");
        _this.typesFilePath = path.join(_super.prototype.getCurrentDir.call(_this), "src/app/core/store/mutationTypes.ts");
        if (pageName) {
            _this.targetPath = "src/" + _this.appName + "/pages/" + pageName;
            _this.name = pageName + "Page";
            _this.componentType = "Page";
        }
        else if (compName) {
            _this.targetPath = "src/" + _this.appName + "/components/" + compName;
            _this.name = compName + "Comp";
            _this.componentType = "Comp";
        }
        return _this;
    }
    Store.prototype.copyFile = function () {
        var _this = this;
        var templateFile = this.templateFile;
        // 如果目标位置已存在文件
        if (fs.existsSync(this.targetPath + "/store.ts")) {
            templateFile = path.join(_super.prototype.getCurrentDir.call(this), this.targetPath + "/store.ts");
            winston.error("文件已存在，将之后添加内容！");
            // return;
        }
        fs.readFile(templateFile, function (err, data) {
            if (err) {
                winston.error(err.message);
                return;
            }
            var content = _super.prototype.replaceKeyword.call(_this, data.toString("utf8"), _this.name);
            // 需要添加state吗
            if (_this.states) {
                for (var _i = 0, _a = _this.states; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var info = item.split(":");
                    var type = "string";
                    if (info.length > 1) {
                        type = info[1];
                    }
                    content = _this.addContentToStore(info[0], type, content);
                    // 添加导出类型
                    _this.addExportConstantContent(info[0]);
                }
            }
            var basePath = path.join(_super.prototype.getCurrentDir.call(_this), _this.targetPath);
            _super.prototype.writeFile.call(_this, basePath, "store.ts", content, true);
        });
    };
    Store.prototype.addContentToStore = function (key, type, fileContent) {
        var initVal = '""';
        if (type.indexOf("[]") !== -1) {
            initVal = "[]";
        }
        else if (type.indexOf("number") !== -1) {
            initVal = "0";
        }
        var reg = null;
        var constantKeyName = _super.prototype.changeCaseConstant.call(this, this.name) + "_" + _super.prototype.changeCaseConstant.call(this, key);
        // 添加导入
        reg = new RegExp(config_1.STORE.IMPORT_ANCHOR);
        var importContent = config_1.STORE.IMPORT_ANCHOR +
            _super.prototype.endl.call(this) +
            ("  FETCH_" + constantKeyName + ",") +
            _super.prototype.endl.call(this) +
            ("  SET_" + constantKeyName + ",");
        fileContent = fileContent.replace(reg, importContent);
        // 添加state
        reg = new RegExp(config_1.STORE.STATE_ANCHOR);
        var stateContent = config_1.STORE.STATE_ANCHOR + _super.prototype.endl.call(this) + "  " + key + ": " + initVal + ",";
        fileContent = fileContent.replace(reg, stateContent);
        // 添加interface
        reg = new RegExp(config_1.STORE.INTERFACE_ANCHOR);
        var interfaceContent = config_1.STORE.INTERFACE_ANCHOR + _super.prototype.endl.call(this) + "  " + key + ": " + type + ";";
        fileContent = fileContent.replace(reg, interfaceContent);
        // 添加mutations
        reg = new RegExp(config_1.STORE.MUTATIONS_ANCHOR);
        var mutationContent = config_1.STORE.MUTATIONS_ANCHOR +
            _super.prototype.endl.call(this) +
            ("  [SET_" + constantKeyName + "](state: I" + _super.prototype.upperFirst.call(this, this.name) + "State, val: any[]) {") +
            _super.prototype.endl.call(this) +
            ("    state." + key + " = val;") +
            _super.prototype.endl.call(this) +
            "  },";
        fileContent = fileContent.replace(reg, mutationContent);
        // 添加actions
        reg = new RegExp(config_1.STORE.ACTIONS_ANCHOR);
        var actionContent = config_1.STORE.ACTIONS_ANCHOR +
            _super.prototype.endl.call(this) +
            ("  [FETCH_" + constantKeyName + "]: ({ commit }: ActionContext<I" + _super.prototype.upperFirst.call(this, this.name) + "State, any>) => {") +
            _super.prototype.endl.call(this) +
            ("    commit(SET_" + constantKeyName + ", \"\");") +
            "    return Promise.resolve();" +
            _super.prototype.endl.call(this) +
            "  },";
        fileContent = fileContent.replace(reg, actionContent);
        // 添加getters
        return fileContent;
    };
    Store.prototype.addExportConstantContent = function (key) {
        var constantKeyName = _super.prototype.changeCaseConstant.call(this, this.name) + "_" + _super.prototype.changeCaseConstant.call(this, key);
        var mutationsAnchor = "// \"" + _super.prototype.upperFirst.call(this, this.name) + "\" MUTATIONS # NOT DELETE";
        var actionsAnchor = "// \"" + _super.prototype.upperFirst.call(this, this.name) + "\" ACTIONS # NOT DELETE";
        var exportMutationsContent = mutationsAnchor +
            _super.prototype.endl.call(this) +
            ("export const SET_" + constantKeyName + " = \"SET_" + constantKeyName + "\";");
        var exportActionsContent = actionsAnchor +
            _super.prototype.endl.call(this) +
            ("export const FETCH_" + constantKeyName + " = \"FETCH_" + constantKeyName + "\";");
        try {
            var fileContent = fs.readFileSync(this.typesFilePath, {
                encoding: "utf8",
            });
            // 判断是否曾添加过这一类
            if (!fileContent.match(new RegExp(mutationsAnchor))) {
                mutationsAnchor =
                    this.componentType === "Page"
                        ? config_1.STORE.CONSTANT_PAGE_MUTATIONS_ANCHOR
                        : config_1.STORE.CONSTANT_COMP_MUTATIONS_ANCHOR;
                exportMutationsContent =
                    mutationsAnchor.replace(/\\/g, "") + _super.prototype.endl.call(this) + exportMutationsContent;
            }
            if (!fileContent.match(new RegExp(actionsAnchor))) {
                actionsAnchor =
                    this.componentType === "Page"
                        ? config_1.STORE.CONSTANT_PAGE_ACTIONS_ANCHOR
                        : config_1.STORE.CONSTANT_COMP_ACTIONS_ANCHOR;
                exportActionsContent =
                    actionsAnchor.replace(/\\/g, "") + _super.prototype.endl.call(this) + exportActionsContent;
            }
            fileContent = fileContent
                .replace(new RegExp(mutationsAnchor), exportMutationsContent)
                .replace(new RegExp(actionsAnchor), exportActionsContent);
            fs.writeFileSync(this.typesFilePath, fileContent);
            winston.info("写入类型常量成功！");
        }
        catch (error) {
            winston.error(error.message);
        }
    };
    return Store;
}(Base_1.Base));
exports.Store = Store;
//# sourceMappingURL=Store.js.map