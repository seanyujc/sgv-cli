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
export declare const PAGE: IPageConst;
export declare const COMP: ICompConst;
export declare const SERVICE: IServiceConst;
export declare const STORE: IStoreConst;
