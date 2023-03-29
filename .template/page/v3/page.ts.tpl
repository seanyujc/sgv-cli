import { defineComponent, getCurrentInstance } from "vue";
import { useBasePage } from "@/app/pages/base-page";

export default defineComponent({
  name: "<%= pascalKeyword%>Page",
  components: {},
  setup() {
    useBasePage(getCurrentInstance());
    return {};
  },
});
