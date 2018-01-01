import Vue from "vue";
import Component from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";
// import Common from "../../core/common";

// console.log(styles);
@Component({
  // components: { HeaderBar },
  mounted: () => {
    // const file = new File([""], "file.txt");
    const file: any = document.getElementById("file");
    console.log(file);
  },
})
export default class <%= uFKeyword%>Page extends Vue {
  @AutowiredService
  private commonService: ICommonService;
  
  private title: string = "<%= uFKeyword%>";

  public show() {
    alert(this.commonService.getLocalDomain());
  }

  get tomorrow() {
    return new Date();
  }

}
