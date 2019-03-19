export interface IPageConst {
  FACTORY_ANCHOR: string;
  FACTORY_FUNCTION_CONTENT: string;
  FACTORY_FUNCTION_PATTERN: string;
  ROUTER_CONFIG_ANCHOR: string;
  ROUTER_CONFIG_CONTENT: string;
  ROUTER_CONFIG_PATTERN: string;
}

export interface ICompConst {
  FACTORY_ANCHOR: string;
  FACTORY_CONTENT: string;
  FACTORY_PATTERN: string;
}

export interface IServiceConst {
  ORIGINAL: string;
  IMPORT_ANCHOR: string;
  IMPORT_CONTENT: string;
  IMPORT_PATTERN: string;
  FACTORY_ANCHOR: string;
  FACTORY_FUNCTION_CONTENT: string;
  FACTORY_FUNCTION_PATTERN: string;
  INTERFACE_ANCHOR: string;
  INTERFACE_CONTENT: string;
  INTERFACE_PATTERN: string;
  FUNCTION_ANCHOR: string;
  FUNCTION_FUNCTION_CONTENT: string;
  FUNCTION_FUNCTION_PATTERN: string;
  API_CONTENT: string;
  API_GET_ANCHOR: string;
  API_POST_ANCHOR: string;
}

export interface IStoreConst {
  IMPORT_ANCHOR: string;
  INTERFACE_ANCHOR: string;
  STATE_ANCHOR: string;
  MUTATIONS_ANCHOR: string;
  ACTIONS_ANCHOR: string;
  GETTERS_ANCHOR: string;
  CONSTANT_PAGE_MUTATIONS_ANCHOR: string;
  CONSTANT_PAGE_ACTIONS_ANCHOR: string;
  CONSTANT_COMP_MUTATIONS_ANCHOR: string;
  CONSTANT_COMP_ACTIONS_ANCHOR: string;
}

export const PAGE: IPageConst = {
  FACTORY_ANCHOR: "// SGV-BUILD-PAGE-FAC # NOT DELETE",
  FACTORY_FUNCTION_CONTENT: `// '<%= uFKeyword%>' PAGE FACTORY START
export function <%= keyword%>PagePreloading(): Promise<any> {
  return import("./<%= kebabKeyword%>/<%= kebabKeyword%>.vue").catch(error => {
    return dealOccurred(error, "<%= uFKeyword%>");
  });
}
// '<%= uFKeyword%>' PAGE FACTORY END`,
  FACTORY_FUNCTION_PATTERN:
    "// '<%= uFKeyword%>' PAGE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' PAGE FACTORY END",
  ROUTER_CONFIG_ANCHOR: "  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE",
  ROUTER_CONFIG_CONTENT:
    '{ path: "/<%= snakeKeyword%>", name: "<%= keyword%>", component: PageFactory.<%= keyword%>PagePreloading },',
  ROUTER_CONFIG_PATTERN:
    '[\\t ]*{ path: "/<%= snakeKeyword%>", name: "<%= keyword%>", component: PageFactory.<%= keyword%>PagePreloading \\},',
};

export const COMP: ICompConst = {
  FACTORY_ANCHOR: "// SGV-BUILD-COMP-FAC # NOT DELETE",
  FACTORY_CONTENT:
    'Vue.component("<%= keyword%>", require("./<%= kebabKeyword%>/<%= kebabKeyword%>.vue").default);',
  FACTORY_PATTERN:
    'Vue\\.component\\("<%= keyword%>", require\\("./<%= kebabKeyword%>/<%= kebabKeyword%>.vue"\\).default\\);',
};

export const SERVICE: IServiceConst = {
  ORIGINAL: `// SGV-BUILD-SERVICE-IMPORT # NOT DELETE

export class Services {
  // SGV-BUILD-SERVICE-FAC # NOT DELETE
};
`,
  IMPORT_ANCHOR: "// SGV-BUILD-SERVICE-IMPORT # NOT DELETE",
  IMPORT_CONTENT: `import { create<%= uFKeyword%>Service, I<%= uFKeyword%>Service, <%= uFKeyword%>Service } from "./services/<%= keyword%>.serv";`,
  IMPORT_PATTERN: `import { create<%= uFKeyword%>Service, I<%= uFKeyword%>Service, <%= uFKeyword%>Service } from "./services/<%= keyword%>.serv";`,
  FACTORY_ANCHOR: "  // SGV-BUILD-SERVICE-FAC # NOT DELETE",
  FACTORY_FUNCTION_CONTENT: `  // '<%= uFKeyword%>' SERVICE FACTORY START
  static <%= keyword%>Service: I<%= uFKeyword%>Service;
  static create<%= uFKeyword%>Service() {
    if (this.<%= keyword%>Service) {
      return this.<%= keyword%>Service;
    }
    this.<%= keyword%>Service = create<%= uFKeyword%>Service(<%= uFKeyword%>Service);
    return this.<%= keyword%>Service;
  }
  // '<%= uFKeyword%>' SERVICE FACTORY END`,
  FACTORY_FUNCTION_PATTERN:
    "// '<%= uFKeyword%>' SERVICE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' SERVICE FACTORY END",
  INTERFACE_ANCHOR: "  // SGV-BUILD-SERVICE-INTERFACE # NOT DELETE",
  INTERFACE_CONTENT: "  <%= keyword%>(arg: string): Promise<any>;",
  INTERFACE_PATTERN: "",
  FUNCTION_ANCHOR: "  // SGV-BUILD-SERVICE-FUNCTION # NOT DELETE",
  FUNCTION_FUNCTION_CONTENT: `  public <%= keyword%>(arg: string): Promise<any> {
    return this.proxyHttp.post("<%= keyword%>", {arg});
  }`,
  FUNCTION_FUNCTION_PATTERN: "",
  API_GET_ANCHOR: "    // SGV-BUILD-API-GET # NOT DELETE",
  API_CONTENT: `    <%= keyword%>: "apiHost:/<%= keyword%>",`,
  API_POST_ANCHOR: "    // SGV-BUILD-API-POST # NOT DELETE",
};

export const STORE: IStoreConst = {
  IMPORT_ANCHOR: "// SGV-BUILD-STORE-IMPORT # NOT DELETE",
  INTERFACE_ANCHOR: "// SGV-BUILD-STORE-INTERFACE # NOT DELETE",
  STATE_ANCHOR: "// SGV-BUILD-STORE-STATE # NOT DELETE",
  MUTATIONS_ANCHOR: "// SGV-BUILD-STORE-MUTATIONS # NOT DELETE",
  ACTIONS_ANCHOR: "// SGV-BUILD-STORE-ACTIONS # NOT DELETE",
  GETTERS_ANCHOR: "// SGV-BUILD-STORE-GETTERS # NOT DELETE",
  CONSTANT_PAGE_MUTATIONS_ANCHOR: "/\\* PAGE-MUTATIONS-TYPE-SGV-BUILD # NOT DELETE \\*/",
  CONSTANT_PAGE_ACTIONS_ANCHOR: "/\\* PAGE-ACTIONS-TYPE-SGV-BUILD # NOT DELETE \\*/",
  CONSTANT_COMP_MUTATIONS_ANCHOR: "/\\* COMP-MUTATIONS-TYPE-SGV-BUILD # NOT DELETE \\*/",
  CONSTANT_COMP_ACTIONS_ANCHOR: "/\\* COMP-ACTIONS-TYPE-SGV-BUILD # NOT DELETE \\*/",
};
