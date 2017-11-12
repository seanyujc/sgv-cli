"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE = {
    FACTORY_ANCHOR: "// SGV-BUILD-PAGE-FAC # NOT DELETE",
    ROUTER_CONFIG_ANCHOR: "  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE",
    FACTORY_FUNCTION_CONTENT: "// '<%= uFKeyword%>' PAGE FACTORY START\nexport function <%= keyword%>PagePreloading(): Promise<any> {\n  return new Promise((resolve, reject) => {\n    require.ensure([], (require) => {\n      const <%= keyword%> = require<{ default: any }>(\"./<%= keyword%>/<%= keyword%>.module\").default;\n      resolve(<%= keyword%>);\n    });\n  });\n}\n// '<%= uFKeyword%>' PAGE FACTORY END",
    FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' PAGE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' PAGE FACTORY END",
    ROUTER_CONFIG_CONTENT: "{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
    ROUTER_CONFIG_PATTERN: "[\\t| ]*{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
};
//# sourceMappingURL=index.js.map