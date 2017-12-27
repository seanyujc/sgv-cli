"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE = {
    FACTORY_ANCHOR: "// SGV-BUILD-PAGE-FAC # NOT DELETE",
    FACTORY_FUNCTION_CONTENT: "// '<%= uFKeyword%>' PAGE FACTORY START\nexport function <%= keyword%>PagePreloading(): Promise<any> {\n  return new Promise((resolve) => {\n    require.ensure([], (require) => {\n      const <%= keyword%> = require<{ default: any }>(\"./<%= keyword%>/<%= keyword%>.module\").default;\n      resolve(<%= keyword%>);\n    });\n  });\n}\n// '<%= uFKeyword%>' PAGE FACTORY END",
    FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' PAGE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' PAGE FACTORY END",
    ROUTER_CONFIG_ANCHOR: "  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE",
    ROUTER_CONFIG_CONTENT: "{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
    ROUTER_CONFIG_PATTERN: "[\\t| ]*{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
};
exports.SERVICE = {
    ORIGINAL: "// SGV-BUILD-SERVICE-IMPORT # NOT DELETE\n\nexport class Services {\n  // SGV-BUILD-SERVICE-FAC # NOT DELETE\n};\n",
    IMPORT_ANCHOR: "// SGV-BUILD-SERVICE-IMPORT # NOT DELETE",
    IMPORT_CONTENT: "import { create<%= uFKeyword%>Service, I<%= uFKeyword%>Service, <%= uFKeyword%>Service } from \"./services/<%= keyword%>.serv\";",
    IMPORT_PATTERN: "import { create<%= uFKeyword%>Service, I<%= uFKeyword%>Service, <%= uFKeyword%>Service } from \"./services/<%= keyword%>.serv\";",
    FACTORY_ANCHOR: "  // SGV-BUILD-SERVICE-FAC # NOT DELETE",
    FACTORY_FUNCTION_CONTENT: "  // '<%= uFKeyword%>' SERVICE FACTORY START\n  static <%= keyword%>Service: I<%= uFKeyword%>Service;  \n  static create<%= uFKeyword%>Service() {\n    if (this.<%= keyword%>Service) {\n      return this.<%= keyword%>Service;\n    }\n    this.<%= keyword%>Service = create<%= uFKeyword%>Service(<%= uFKeyword%>Service);\n    return this.<%= keyword%>Service;\n  }\n  // '<%= uFKeyword%>' SERVICE FACTORY END",
    FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' SERVICE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' SERVICE FACTORY END",
    INTERFACE_ANCHOR: "  // SGV-BUILD-SERVICE-INTERFACE # NOT DELETE",
    INTERFACE_CONTENT: "  <%= keyword%>(arg: string): Promise<any>;",
    INTERFACE_PATTERN: "",
    FUNCTION_ANCHOR: "  // SGV-BUILD-SERVICE-FUNCTION # NOT DELETE",
    FUNCTION_FUNCTION_CONTENT: "  <%= keyword%>(arg: string): Promise<any> {\n    return this.proxyHttp.post(\"<%= keyword%>\", {arg});\n  }",
    FUNCTION_FUNCTION_PATTERN: "",
    API_GET_ANCHOR: "    // SGV-BUILD-API-GET # NOT DELETE",
    API_CONTENT: "    <%= keyword%>: \"apiHost:/<%= keyword%>\",",
    API_POST_ANCHOR: "    // SGV-BUILD-API-POST # NOT DELETE"
};
//# sourceMappingURL=index.js.map