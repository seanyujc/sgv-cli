import { dealOccurred } from "@/app/pages";

export function <%= parentCamelKeyword%>PagePreloading(): Promise<any> {
  return import("./<%= kebabKeyword%>.vue").catch((error) => dealOccurred(error, "<%= pascalKeyword%>"));
}
