import Component, { mixins } from "vue-class-component";
import { BaseComp } from "@/app/components/BaseComp";

@Component({
  components: {},
  name: "<%= camelKeyword%>",
})
export default class <%= pascalKeyword%>Comp extends mixins(BaseComp) {
  /* Lifecycle Hooks */
  mounted() {
    //
  }
  /* Lifecycle Hooks END */
}
