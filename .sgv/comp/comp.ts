import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from "vue-property-decorator";
import { AutowiredService } from "../../../lib/sg-resource/decorators";
import { ICommonService } from "../../core/services/common.serv";
// import Common from "../../core/common";

@Component({
  // components: { HeaderBar },
})
export default class <%= uFKeyword%>Comp extends Vue {
  @AutowiredService
  commonService: ICommonService;
  @Prop({ default: "<%= uFKeyword%>" })
  name: string = "<%= uFKeyword%>";

  // 一般属性
  nameC: string = this.name;

  // 计算属性
  get today() {
    return new Date();
  }

  @Watch("name")
  onNameChanged(val: string) {
    this.nameC = val;
  }

  @Emit("onChangeName")
  setName(name: string){ this.nameC = name; }

  // 普通方法
  show() {
  }

  // 生命周期钩子
  mounted() {

  }

}
