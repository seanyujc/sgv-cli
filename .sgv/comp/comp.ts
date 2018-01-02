import Vue from "vue";
import Component from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";
// import Common from "../../core/common";

// console.log(styles);
@Component({
  // components: { HeaderBar },
  mounted: () => {
  },
})
export default class <%= uFKeyword%>Comp extends Vue {
  @AutowiredService
  private commonService: ICommonService;
  
  private name: string = "<%= uFKeyword%>";

  public show() {
  }

  get tomorrow() {
    return new Date();
  }

}
