import { BaseComp } from "@/app/components/BaseComp";
import Component, { mixins } from "vue-class-component";

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
