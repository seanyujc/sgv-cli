import Vue from "vue";
import Component from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";
import BasePage from "../BasePage";

interface I<%= uFKeyword%>Page {

}

@Component({
  name: "<%= keyword%>",
  components: {},
})
export default class <%= uFKeyword%>Page extends BasePage implements I<%= uFKeyword%>Page {
  @AutowiredService
  commonService: ICommonService;

  title: string = "<%= uFKeyword%>";

  fetchData() {
    //
  }

  mounted() {
    //
  }
}
