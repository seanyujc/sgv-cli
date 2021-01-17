import { dealOccurred } from "@/app/pages/BasePage";

export function <%= parentCamelKeyword%>PagePreloading(): Promise<any> {
  return import("./<%= kebabKeyword%>").catch((error) => dealOccurred(error, "<%= pascalKeyword%>"));
}
