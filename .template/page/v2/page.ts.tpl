import Component, { mixins } from "vue-class-component";
import BasePage from "@/app/pages/BasePage";

@Component({
  components: {},
  name: "<%= parentCamelKeyword%>",
})
export default class <%= pascalKeyword%>Page extends mixins(BasePage) {
  title = "<%= pascalKeyword%>";

  fetchData() {
    // todo
  }
  /* Lifecycle Hooks */
  mounted() {
    //
  }
  /* Lifecycle Hooks END */
}
