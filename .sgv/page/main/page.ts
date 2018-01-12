import Vue from "vue";
import Component from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";

@Component
export default class <%= uFKeyword%>Page extends Vue {
  @AutowiredService
  private commonService: ICommonService;

  private title: string = "<%= uFKeyword%>";

  public show() {
    alert(this.commonService.getLocalDomain());
  }

  get today() {
    return new Date();
  }

  private mounted() {
    console.log("mounted");
  }
}
