import fs = require("fs");
import path = require("path");
import * as winston from "winston";
import { STORE } from "../../config";
import { Base } from "./Base";

export class Store extends Base {
  templateFile: string = path.join(__dirname, "../../../", ".sgv/store.ts");
  /**
   * 创建store的路径
   */
  targetPath: string;
  typesFilePath: string = path.join(
    super.getCurrentDir(),
    "src/common/core/store/mutationTypes.ts",
  );
  /**
   * 创建对象名 + Page or Comp 以区分页面还是组件
   */
  name: string;
  componentType: string;
  constantKeyName: string;

  constructor(
    pageName: string,
    compName: string,
    private states?: string[],
    private appName: string = "app",
  ) {
    super();
    // console.log(pageName, compName);
    if (pageName) {
      this.targetPath =
        "src/" + this.appName + "/pages/" + this.changeCaseKebab(pageName);
      this.name = pageName + "Page";
      this.componentType = "Page";
    } else if (compName) {
      this.targetPath = "src/" + this.appName + "/components/";
      this.name = "comp";
      this.componentType = "Comp";
    }
    this.constantKeyName =
      super.changeCaseConstant(this.appName) +
      "_" +
      super.changeCaseConstant(this.name);
  }

  copyFile() {
    let templateFile = this.templateFile;
    // 如果目标位置已存在文件则修改
    if (fs.existsSync(this.targetPath + "/store.ts")) {
      templateFile = path.join(
        super.getCurrentDir(),
        this.targetPath + "/store.ts",
      );
      winston.error("文件已存在，将之后添加内容！");
      // return;
    }

    fs.readFile(templateFile, (err, data) => {
      if (err) {
        winston.error(err.message);
        return;
      }
      let content = super.replaceKeyword(data.toString("utf8"), this.name);
      // 需要添加state吗
      if (this.states) {
        for (const item of this.states) {
          const info: string[] = item.split(":");
          let type = "string";
          if (info.length > 1) {
            type = info[1];
          }
          content = this.addContentToStore(info[0], type, content);
          // 添加导出类型
          this.addExportConstantContent(info[0]);
        }
      }
      const basePath = path.join(super.getCurrentDir(), this.targetPath);
      super.writeFile(basePath, "store.ts", content, true);
    });
  }

  addContentToStore(key: string, type: string, fileContent: string) {
    let initVal = '""';
    if (type.indexOf("[]") !== -1) {
      initVal = "[]";
    } else if (type.indexOf("number") !== -1) {
      initVal = "0";
    }
    let reg = null;
    const constantKeyName =
      this.constantKeyName + "_" + super.changeCaseConstant(key);
    // 添加导入
    reg = new RegExp(STORE.IMPORT_ANCHOR);
    const importContent =
      STORE.IMPORT_ANCHOR +
      super.endl() +
      `  FETCH_${constantKeyName},` +
      super.endl() +
      `  SET_${constantKeyName},`;
    fileContent = fileContent.replace(reg, importContent);
    // 添加state
    reg = new RegExp(STORE.STATE_ANCHOR);
    const stateContent =
      STORE.STATE_ANCHOR + super.endl() + "  " + key + ": " + initVal + ",";
    fileContent = fileContent.replace(reg, stateContent);
    // 添加interface
    reg = new RegExp(STORE.INTERFACE_ANCHOR);
    const interfaceContent =
      STORE.INTERFACE_ANCHOR + super.endl() + "  " + key + ": " + type + ";";
    fileContent = fileContent.replace(reg, interfaceContent);
    // 添加mutations
    reg = new RegExp(STORE.MUTATIONS_ANCHOR);
    const mutationContent =
      STORE.MUTATIONS_ANCHOR +
      super.endl() +
      `  [SET_${constantKeyName}](state: I${super.changeCasePascal(
        this.name,
      )}State, val: ${type}) {` +
      super.endl() +
      `    state.${key} = val;` +
      super.endl() +
      `  },`;
    fileContent = fileContent.replace(reg, mutationContent);
    // 添加actions
    reg = new RegExp(STORE.ACTIONS_ANCHOR);
    const actionContent =
      STORE.ACTIONS_ANCHOR +
      super.endl() +
      `  [FETCH_${constantKeyName}]: ({ commit }: ActionContext<I${super.changeCasePascal(
        this.name,
      )}State, any>) => {` +
      super.endl() +
      `    commit(SET_${constantKeyName}, "");` +
      `    return Promise.resolve();` +
      super.endl() +
      `  },`;
    fileContent = fileContent.replace(reg, actionContent);
    // 添加getters
    return fileContent;
  }

  addExportConstantContent(key: string) {
    const constantKeyName =
      this.constantKeyName + "_" + super.changeCaseConstant(key);
    let mutationsAnchor = `// "${super.changeCaseConstant(
      this.appName,
    )} ${super.changeCasePascal(this.name)}" MUTATIONS # NOT DELETE`;
    let actionsAnchor = `// "${super.changeCaseConstant(
      this.appName,
    )} ${super.changeCasePascal(this.name)}" ACTIONS # NOT DELETE`;
    let exportMutationsContent =
      mutationsAnchor +
      super.endl() +
      `export const SET_${constantKeyName} = "SET_${constantKeyName}";`;

    let exportActionsContent =
      actionsAnchor +
      super.endl() +
      `export const FETCH_${constantKeyName} = "FETCH_${constantKeyName}";`;
    try {
      let fileContent = fs.readFileSync(this.typesFilePath, {
        encoding: "utf8",
      });
      // 判断是否曾添加过这一类
      if (!fileContent.match(new RegExp(mutationsAnchor))) {
        mutationsAnchor =
          this.componentType === "Page"
            ? STORE.CONSTANT_PAGE_MUTATIONS_ANCHOR
            : STORE.CONSTANT_COMP_MUTATIONS_ANCHOR;
        exportMutationsContent =
          mutationsAnchor.replace(/\\/g, "") +
          super.endl() +
          exportMutationsContent;
      }
      if (!fileContent.match(new RegExp(actionsAnchor))) {
        actionsAnchor =
          this.componentType === "Page"
            ? STORE.CONSTANT_PAGE_ACTIONS_ANCHOR
            : STORE.CONSTANT_COMP_ACTIONS_ANCHOR;
        exportActionsContent =
          actionsAnchor.replace(/\\/g, "") +
          super.endl() +
          exportActionsContent;
      }
      fileContent = fileContent
        .replace(new RegExp(mutationsAnchor), exportMutationsContent)
        .replace(new RegExp(actionsAnchor), exportActionsContent);
      fs.writeFileSync(this.typesFilePath, fileContent);
      winston.info("写入类型常量成功！");
    } catch (error) {
      winston.error(error.message);
    }
  }
}
