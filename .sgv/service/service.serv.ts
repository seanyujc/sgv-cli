import { BaseService } from "./base.serv";

export interface I<%= uFKeyword%>Service {

}

interface I<%= uFKeyword%>ServiceConstructor {
  new(): I<%= uFKeyword%>Service;
}

export function create<%= uFKeyword%>Service(ctor: I<%= uFKeyword%>ServiceConstructor): I<%= uFKeyword%>Service {
  return new ctor();
}

export class <%= uFKeyword%>Service extends BaseService implements I<%= uFKeyword%>Service {
  constructor() {
    super();
  }
}
