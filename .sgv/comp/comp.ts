import Vue from "vue";
import Component from "vue-class-component";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";

@Component({
  props: {
    message: String,
  },
})
export default class <%= uFKeyword%>Comp extends Vue {
  @AutowiredService
  private commonService: ICommonService;

  private name: string = "<%= uFKeyword%>";

  public show() {
  }

  get today() {
    return new Date();
  }

  private mounted(){
    console.log(this.message);
  }

}
