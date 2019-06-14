import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import BasePage from "../BasePage";

interface I<%= uFKeyword%>Page {
  /**
   * 获取页面展示所需的远程数据
   */
  fetchData(): void;
}

@Component({
  components: {},
  name: "<%= keyword%>",
})
export default class <%= uFKeyword%>Page extends mixins(BasePage) implements I<%= uFKeyword%>Page {

  title: string = "<%= uFKeyword%>";

  fetchData() {
    //
  }
  /* 生命钩子 START */
  mounted() {
    //
  }
}
