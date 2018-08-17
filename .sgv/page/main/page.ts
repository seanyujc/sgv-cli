import Vue from "vue";
import Component from "vue-class-component";
import { ICommonService } from "../../../common/core/services/common.serv";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import BasePage from "../BasePage";

interface I<%= uFKeyword%>Page {

}

@Component({
  components: {},
  name: "<%= keyword%>",
})
export default class <%= uFKeyword%>Page extends BasePage implements I<%= uFKeyword%>Page {
  @AutowiredService
  commonService: ICommonService;

  title: string = "<%= uFKeyword%>";

  fetchData() {
    //
  }
  /* 生命钩子 START */
  mounted() {
    //
  }
}
