
export interface IPageConst {
  FACTORY_ANCHOR: string;
  FACTORY_FUNCTION_CONTENT: string;
  FACTORY_FUNCTION_PATTERN: string;
  ROUTER_CONFIG_ANCHOR: string;
  ROUTER_CONFIG_CONTENT: string;
  ROUTER_CONFIG_PATTERN: string;
}

export const PAGE: IPageConst = {
  FACTORY_ANCHOR: "// SGV-BUILD-PAGE-FAC # NOT DELETE",
  ROUTER_CONFIG_ANCHOR: "  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE",
  FACTORY_FUNCTION_CONTENT: `// '<%= uFKeyword%>' PAGE FACTORY START
export function <%= keyword%>PagePreloading(): Promise<any> {
  return new Promise((resolve, reject) => {
    require.ensure([], (require) => {
      const <%= keyword%> = require<{ default: any }>("./<%= keyword%>/<%= keyword%>.module").default;
      resolve(<%= keyword%>);
    });
  });
}
// '<%= uFKeyword%>' PAGE FACTORY END`,
  FACTORY_FUNCTION_PATTERN: "// '<%= uFKeyword%>' PAGE FACTORY START[\\s\\S]*// '<%= uFKeyword%>' PAGE FACTORY END",
  ROUTER_CONFIG_CONTENT: "{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
  ROUTER_CONFIG_PATTERN: "[\\t| ]*{ path: \"/<%= keyword%>\", component: PageFactory.<%= keyword%>PagePreloading },",
};
