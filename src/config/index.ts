export interface IPageConst {
  FACTORY_ANCHOR: string;
  FACTORY_FUNCTION_CONTENT: string;
  FACTORY_FUNCTION_PATTERN: string;
  ROUTER_CONFIG_ANCHOR: string;
  ROUTER_CONFIG_CONTENT: string;
  ROUTER_CONFIG_PATTERN: string;
}

export interface IServiceConst {
  ORIGINAL: string;
  IMPORT_ANCHOR: string;
  IMPORT_CONTENT: string;
  IMPORT_PATTERN: string;
  FACTORY_ANCHOR: string;
  FACTORY_FUNCTION_CONTENT: string;
  FACTORY_FUNCTION_PATTERN: string;
}

export const PAGE: IPageConst = {
  FACTORY_ANCHOR: "// SGV-BUILD-PAGE-FAC # NOT DELETE",
  FACTORY_FUNCTION_CONTENT: `// '<%= uFKeyword%>' PAGE FACTORY START
export function <%= keyword%>PagePreloading(): Promise<any> {
  return new Promise((resolve) => {
    require.ensure([], (require) => {
      const <%= keyword%> = require<{ default: any }>("./<%= keyword%>/<%= keyword%>.module").default;
      resolve(<%= keyword%>);
    });
  });
}
// '<%= uFKeyword%>' PAGE FACTORY END`,
  FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' PAGE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' PAGE FACTORY END",
  ROUTER_CONFIG_ANCHOR: "  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE",
  ROUTER_CONFIG_CONTENT: "{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
  ROUTER_CONFIG_PATTERN: "[\\t| ]*{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
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
  FACTORY_FUNCTION_CONTENT: `// '<%= uFKeyword%>' SERVICE FACTORY START
  static <%= keyword%>Service: I<%= uFKeyword%>Service;  
  static create<%= uFKeyword%>Service() {
    if (this.<%= keyword%>Service) {
      return this.<%= keyword%>Service;
    }
    this.<%= keyword%>Service = create<%= uFKeyword%>Service(<%= uFKeyword%>Service);
    return this.<%= keyword%>Service;
  }
  // '<%= uFKeyword%>' SERVICE FACTORY END`,
  FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' SERVICE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' SERVICE FACTORY END",
};
